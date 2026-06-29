import XLSX from 'xlsx';

const wb = XLSX.readFile('D:\\CNPM\\DanhSachSinhVien_CNPM.xlsx');
console.log('SHEETS:', wb.SheetNames);
for (const sn of wb.SheetNames) {
  const ws = wb.Sheets[sn];
  const ref = ws['!ref'];
  console.log(`\n=== Sheet "${sn}" (range ${ref}) ===`);
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  rows.slice(0, 30).forEach((r, i) => console.log(`R${i + 1}:`, JSON.stringify(r)));
  console.log(`... total rows: ${rows.length}`);
}
