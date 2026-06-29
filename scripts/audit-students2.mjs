import XLSX from 'xlsx';
const wb = XLSX.readFile('D:\\CNPM\\DanhSachSinhVien_CNPM.xlsx');

console.log('Sheets có sẵn:');
wb.SheetNames.forEach(n => {
  const codes = [...n].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(' ');
  console.log(`  "${n}"  bytes=${codes}`);
});

// Dùng đúng tên từ workbook
const ddName = wb.SheetNames.find(n => n.toLowerCase().includes('danh'));
const dtName = wb.SheetNames.find(n => n.toLowerCase().includes('thi'));

function audit(sheetName) {
  console.log(`\n=== Audit "${sheetName}" ===`);
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const dataRows = rows.slice(7);

  const all = [];
  const byMssv = new Map();
  let currentGroupNo = null;
  const groupNoSet = new Set();
  const groupMemberCount = new Map();
  const groupFirstRow = new Map(); // groupNo → tên nhóm (cột F)

  dataRows.forEach((r, i) => {
    const rowNum = i + 8;
    const mssv = String(r[1] ?? '').trim();
    if (!mssv) return;
    const fullName = `${String(r[2] ?? '').trim()} ${String(r[3] ?? '').trim()}`.trim();
    const nhomRaw = r[4];
    const tenNhom = String(r[5] ?? '').trim();
    if (nhomRaw !== '' && nhomRaw !== null && nhomRaw !== undefined) {
      const n = Number(nhomRaw);
      if (Number.isInteger(n) && n > 0) {
        currentGroupNo = n;
        groupNoSet.add(n);
        if (!groupFirstRow.has(n)) groupFirstRow.set(n, tenNhom || `(nhóm ${n})`);
      }
    }
    groupMemberCount.set(currentGroupNo, (groupMemberCount.get(currentGroupNo) || 0) + 1);
    all.push({ rowNum, mssv, fullName, groupNo: currentGroupNo });
    if (byMssv.has(mssv)) byMssv.get(mssv).push(rowNum);
    else byMssv.set(mssv, [rowNum]);
  });

  console.log(`Tổng dòng có MSSV: ${all.length}`);
  console.log(`MSSV unique:       ${byMssv.size}`);
  console.log(`Số nhóm distinct:  ${groupNoSet.size}`);

  const dups = [...byMssv.entries()].filter(([_, rows]) => rows.length > 1);
  if (dups.length) {
    console.log(`\nDUPLICATE MSSV (${dups.length}):`);
    dups.forEach(([mssv, rows]) => console.log(`  ${mssv} → rows ${rows.join(', ')}`));
  }

  console.log('\nNhóm có size ≠ 3:');
  let anomalies = 0;
  [...groupMemberCount.entries()].sort((a, b) => a[0] - b[0]).forEach(([no, cnt]) => {
    if (cnt !== 3) {
      console.log(`  Nhóm ${no} ("${groupFirstRow.get(no)}"): ${cnt} SV`);
      anomalies++;
    }
  });
  if (anomalies === 0) console.log('  (tất cả nhóm đều 3 SV)');

  return { all, byMssv };
}

const ddResult = audit(ddName);
const dtResult = audit(dtName);

// So sánh MSSV giữa 2 sheet
const ddSet = new Set(ddResult.all.map(x => x.mssv));
const dtSet = new Set(dtResult.all.map(x => x.mssv));
const onlyInDD = [...ddSet].filter(m => !dtSet.has(m));
const onlyInDT = [...dtSet].filter(m => !ddSet.has(m));
console.log('\n=== So sánh MSSV giữa 2 sheet ===');
console.log(`Chỉ có ở "${ddName}": ${onlyInDD.length}`, onlyInDD);
console.log(`Chỉ có ở "${dtName}": ${onlyInDT.length}`, onlyInDT);
