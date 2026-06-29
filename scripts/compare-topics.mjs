import XLSX from 'xlsx';
const wb = XLSX.readFile('D:\\CNPM\\DanhSachSinhVien_CNPM.xlsx');

console.log('=== Sheet "Điểm Danh" ===');
console.log('Header row 7:', XLSX.utils.sheet_to_json(wb.Sheets['Điểm Danh'], {header:1,defval:''})[6]);

console.log('\n=== Sheet "Điểm Thi" ===');
console.log('Header row 7:', XLSX.utils.sheet_to_json(wb.Sheets['Điểm Thi'], {header:1,defval:''})[6]);

console.log('\n=== Đối chiếu nhóm 12..17 ===');
const dd = XLSX.utils.sheet_to_json(wb.Sheets['Điểm Danh'], {header:1,defval:''});
const dt = XLSX.utils.sheet_to_json(wb.Sheets['Điểm Thi'], {header:1,defval:''});

// Lấy hàng đầu của mỗi nhóm (có Nhóm number) - chỉ 12..17
const findGroupRow = (rows, gno) => rows.slice(7).find(r => Number(r[4]) === gno);

for (let g = 12; g <= 17; g++) {
  const rDD = findGroupRow(dd, g) || [];
  const rDT = findGroupRow(dt, g) || [];
  console.log(`\nNhóm ${g}:`);
  console.log(`  ĐiểmDanh  → Tên nhóm: "${rDD[5]}", Đề tài (cột G): "${rDD[6]}"`);
  console.log(`  ĐiểmThi   → Tên nhóm: "${rDT[5]}", Đề tài (cột G): "${rDT[6]}", Tên đề tài (cột H): "${rDT[7]}"`);
}
