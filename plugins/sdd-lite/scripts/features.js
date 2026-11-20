#!/usr/bin/env node
/**
 * SDD Lite v1.0.0 - Bảng ánh xạ ID <-> tên feature và công cụ cấp ID.
 *
 * Đặt tại specs/features.js. Cần Node.js >= 14, không cần cài thư viện.
 * Chạy từ gốc dự án. Mọi lệnh in JSON ra stdout (trừ `list --table`); lỗi thoát mã 1.
 *
 *   node specs/features.js register "<tên ngắn>"      Cấp ID mới, tạo thư mục specs/<ID>/
 *   node specs/features.js get <ID>                   Tra feature theo ID (thư mục, trạng thái, file đã có)
 *   node specs/features.js set <ID> --status <s>      Đổi trạng thái / tên [--name "<tên>"]; đồng bộ cả spec.md
 *   node specs/features.js list [--table]             Liệt kê mọi feature
 *   node specs/features.js sync                       Dựng lại bảng ánh xạ từ thư mục specs/
 *
 * Có thể require() để dùng bảng ánh xạ: { REGISTRY, idToName, nameToId }.
 *
 * Quy tắc: ID gồm 4 chữ số, bắt đầu 0001, không đổi, không tái sử dụng.
 * Nguồn sự thật về sự tồn tại của feature là các thư mục con của specs/;
 * trạng thái nằm ở frontmatter spec.md. Bảng REGISTRY bên dưới là bản ánh xạ do công cụ này ghi.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SPECS_DIR = __dirname;
const STATUSES = ['draft', 'approved', 'in-progress', 'done', 'cancelled'];

// <registry>
const REGISTRY = [];
// </registry>

// ---------- Tiện ích ----------

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fail(message, extra) {
  console.log(JSON.stringify({ ok: false, error: message, ...(extra || {}) }, null, 2));
  process.exit(1);
}

function out(obj) {
  console.log(JSON.stringify({ ok: true, ...obj }, null, 2));
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i += 1;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

// ---------- Đọc dữ liệu ----------

function readFrontmatter(file) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (e) {
    return null;
  }
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const result = {};
  if (!match) return result;
  match[1].split(/\r?\n/).forEach((line) => {
    const kv = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
    if (kv) result[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  });
  return result;
}

function scanFolders() {
  return fs
    .readdirSync(SPECS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => /^\d{4}$/.test(d.name))
    .map((d) => ({ id: d.name, dir: d.name }));
}

/** Gộp bảng REGISTRY với thư mục thực tế; trả về danh sách feature và cảnh báo. */
function loadState() {
  const folders = scanFolders();
  const warnings = [];
  const byId = new Map();

  REGISTRY.forEach((e) => byId.set(e.id, { ...e, registered: true, dir: null }));

  folders.forEach((f) => {
    const existing = byId.get(f.id);
    if (existing && existing.dir) {
      warnings.push(`Hai thư mục cùng ID ${f.id}: ${existing.dir} và ${f.dir}. Cần xử lý thủ công.`);
      return;
    }
    if (existing) {
      existing.dir = f.dir;
      return;
    }
    const fm = readFrontmatter(path.join(SPECS_DIR, f.dir, 'spec.md')) || {};
    byId.set(f.id, {
      id: f.id,
      name: fm.name || f.id,
      status: STATUSES.includes(fm.status) ? fm.status : 'draft',
      updated: fm.updated || today(),
      registered: false,
      dir: f.dir,
    });
    warnings.push(`Thư mục ${f.dir} chưa có trong bảng ánh xạ. Chạy: node specs/features.js sync`);
  });

  byId.forEach((e) => {
    if (!e.dir) warnings.push(`ID ${e.id} (${e.name}) có trong bảng ánh xạ nhưng thiếu thư mục. ID vẫn được giữ chỗ.`);
  });

  const features = Array.from(byId.values()).sort((a, b) => a.id.localeCompare(b.id));
  return { features, warnings };
}

function nextId(features) {
  const max = features.reduce((m, e) => Math.max(m, parseInt(e.id, 10)), 0);
  if (max >= 9999) fail('Đã dùng hết ID (9999).');
  return String(max + 1).padStart(4, '0');
}

function publicFeature(e) {
  return {
    id: e.id,
    name: e.name,
    status: e.status,
    updated: e.updated,
    folder: e.dir ? `specs/${e.dir}` : null,
  };
}

// ---------- Ghi dữ liệu ----------

function writeRegistry(features) {
  const entries = features
    .map((e) => ({ id: e.id, name: e.name, status: e.status, updated: e.updated }))
    .sort((a, b) => a.id.localeCompare(b.id));
  const body = entries.length
    ? `const REGISTRY = [\n${entries.map((e) => `  ${JSON.stringify(e)}`).join(',\n')},\n];`
    : 'const REGISTRY = [];';
  const source = fs.readFileSync(__filename, 'utf8');
  const pattern = /(\/\/ <registry>\r?\n)[\s\S]*?(\r?\n\/\/ <\/registry>)/;
  if (!pattern.test(source)) fail('Không tìm thấy khối <registry> trong features.js.');
  const updated = source.replace(pattern, (_, open, close) => `${open}${body}${close}`);
  const tmp = `${__filename}.tmp`;
  fs.writeFileSync(tmp, updated, 'utf8');
  fs.renameSync(tmp, __filename);
}

function updateSpecFrontmatter(dir, changes) {
  const file = path.join(SPECS_DIR, dir, 'spec.md');
  if (!fs.existsSync(file)) return false;
  const text = fs.readFileSync(file, 'utf8');
  const match = /^(---\r?\n)([\s\S]*?)(\r?\n---)/.exec(text);
  if (!match) return false;
  let block = match[2];
  Object.keys(changes).forEach((key) => {
    const value = key === 'name' ? JSON.stringify(changes[key]) : changes[key];
    const line = new RegExp(`^${key}:.*$`, 'm');
    block = line.test(block) ? block.replace(line, () => `${key}: ${value}`) : `${block}\n${key}: ${value}`;
  });
  fs.writeFileSync(file, text.replace(match[0], () => `${match[1]}${block}${match[3]}`), 'utf8');
  return true;
}

// ---------- Lệnh ----------

function cmdRegister(name) {
  if (!name || name === true) fail('Thiếu tên feature. Dùng: register "<tên ngắn>"');
  const { features, warnings } = loadState();
  const id = nextId(features);
  const dir = id;
  try {
    fs.mkdirSync(path.join(SPECS_DIR, dir));
  } catch (e) {
    fail(`Không tạo được thư mục specs/${dir}: ${e.message}`);
  }
  const entry = { id, name: String(name).trim(), status: 'draft', updated: today(), dir };
  writeRegistry(features.concat([entry]));
  out({
    id,
    name: entry.name,
    status: 'draft',
    folder: `specs/${dir}`,
    spec_file: `specs/${dir}/spec.md`,
    created: today(),
    warnings,
  });
}

function resolve(idArg, features) {
  const raw = String(idArg === undefined ? '' : idArg);
  if (!/^\d{1,4}$/.test(raw) || parseInt(raw, 10) === 0) {
    fail(`ID không hợp lệ: "${raw}". ID gồm 1-4 chữ số, lớn hơn 0 (ví dụ 3 hoặc 0003).`, {
      features: features.map(publicFeature),
    });
  }
  const id = raw.padStart(4, '0');
  const found = features.find((e) => e.id === id);
  if (!found) fail(`Không có feature ${id}.`, { features: features.map(publicFeature) });
  return found;
}

function cmdGet(idArg) {
  const { features, warnings } = loadState();
  const feature = resolve(idArg, features);
  const files = {};
  ['spec', 'plan', 'tasks'].forEach((name) => {
    files[name] = Boolean(feature.dir) && fs.existsSync(path.join(SPECS_DIR, feature.dir, `${name}.md`));
  });
  out({ feature: publicFeature(feature), files, warnings });
}

function cmdSet(idArg, flags) {
  const { features, warnings } = loadState();
  const feature = resolve(idArg, features);
  if (flags.status === undefined && flags.name === undefined) fail('Cần ít nhất --status hoặc --name.');
  const frontmatter = { updated: today() };
  if (flags.status !== undefined) {
    if (!STATUSES.includes(flags.status)) fail(`Trạng thái không hợp lệ: "${flags.status}". Hợp lệ: ${STATUSES.join(', ')}.`);
    feature.status = flags.status;
    frontmatter.status = flags.status;
  }
  if (flags.name !== undefined) {
    if (flags.name === true || !String(flags.name).trim()) fail('--name không được rỗng.');
    feature.name = String(flags.name).trim();
    frontmatter.name = feature.name;
  }
  feature.updated = today();
  writeRegistry(features);
  const specUpdated = feature.dir ? updateSpecFrontmatter(feature.dir, frontmatter) : false;
  out({ feature: publicFeature(feature), spec_frontmatter_updated: specUpdated, warnings });
}

function cmdList(flags) {
  const { features, warnings } = loadState();
  if (flags.table) {
    const rows = features.map((e) => `| ${e.id} | ${e.name} | ${e.status} | ${e.updated} | ${e.dir ? `specs/${e.dir}/` : '(thiếu thư mục)'} |`);
    console.log(['| ID | Tên | Trạng thái | Cập nhật | Thư mục |', '|---|---|---|---|---|'].concat(rows).join('\n'));
    warnings.forEach((w) => console.log(`! ${w}`));
    return;
  }
  out({ next_id: nextId(features), features: features.map(publicFeature), warnings });
}

function cmdSync() {
  const { features } = loadState();
  const changes = [];
  const synced = features.map((e) => {
    if (!e.dir) return e;
    const fm = readFrontmatter(path.join(SPECS_DIR, e.dir, 'spec.md')) || {};
    const next = {
      ...e,
      name: fm.name || e.name,
      status: STATUSES.includes(fm.status) ? fm.status : e.status,
      updated: fm.updated || e.updated,
    };
    if (!e.registered) changes.push(`Thêm ${e.id} (${next.name})`);
    else if (next.name !== e.name || next.status !== e.status || next.updated !== e.updated) changes.push(`Cập nhật ${e.id}`);
    return next;
  });
  writeRegistry(synced);
  const after = loadState();
  out({ changes, features: after.features.map(publicFeature), warnings: after.warnings });
}

function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const [command, arg] = positional;
  switch (command) {
    case 'register': return cmdRegister(arg);
    case 'get': return cmdGet(arg);
    case 'set': return cmdSet(arg, flags);
    case 'list': return cmdList(flags);
    case 'sync': return cmdSync();
    default:
      return fail('Lệnh không hợp lệ. Dùng: register | get | set | list | sync (xem phần đầu file features.js).');
  }
}

if (require.main === module) {
  main();
} else {
  module.exports = {
    REGISTRY,
    idToName: Object.fromEntries(REGISTRY.map((e) => [e.id, e.name])),
    nameToId: Object.fromEntries(REGISTRY.map((e) => [e.name, e.id])),
  };
}
