import XLSX from 'xlsx';
const wb = XLSX.readFile('D:\\CNPM\\DanhSachSinhVien_CNPM.xlsx');
const ws = wb.Sheets['Điểm Thi'];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// In tất cả các dòng SV của nhóm 44 + 5 dòng cuối
console.log('=== 10 dòng cuối ===');
rows.slice(-10).forEach((r, i) => {
  const rowNum = rows.length - 10 + i + 1;
  console.log(`R${rowNum}: nhóm=${JSON.stringify(r[4])} tenNhom=${JSON.stringify(r[5])} mssv=${JSON.stringify(r[1])} ten="${r[2]} ${r[3]}"`);
});

// Tìm tất cả dòng có nhóm = 44 + dòng kế thừa
console.log('\n=== Member của nhóm 44 (T1) ===');
let inG44 = false;
rows.slice(7).forEach((r, i) => {
  const rowNum = i + 8;
  const n = r[4];
  if (n !== '' && n !== null && n !== undefined) {
    inG44 = Number(n) === 44;
  }
  if (inG44 && r[1]) {
    console.log(`  R${rowNum}: ${r[1]} - ${r[2]} ${r[3]} (nhóm cell raw: ${JSON.stringify(n)})`);
  }
});
