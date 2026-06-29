import XLSX from 'xlsx';
import fs from 'fs';

const SRC = 'D:\\CNPM\\DanhSachSinhVien_CNPM.xlsx';
const OUT = 'D:\\CNPM\\CNPM-frontend-push\\public\\templates\\tai_khoan_sinh_vien_CNPM.csv';

const wb = XLSX.readFile(SRC);
const ws = wb.Sheets['Điểm Danh'];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// Header ở row 7 (index 6). Data từ row 8 (index 7) tới hết.
const dataRows = rows.slice(7);

const seen = new Set();
const out = [];
out.push('Họ và tên,Email,Mã số định danh (MSSV),Số điện thoại,Vai trò,Mã lớp học phần');

let skippedNoMssv = 0;
let skippedDup = 0;

for (const r of dataRows) {
  const mssv = String(r[1] ?? '').trim();
  const hoLot = String(r[2] ?? '').trim();
  const ten = String(r[3] ?? '').trim();
  if (!mssv) { skippedNoMssv++; continue; }
  if (seen.has(mssv)) { skippedDup++; continue; }
  seen.add(mssv);
  const fullName = [hoLot, ten].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  const email = `${mssv.toLowerCase()}@student.ptithcm.edu.vn`;
  // Escape commas/quotes trong fullName nếu có
  const escFullName = /[",\n]/.test(fullName) ? `"${fullName.replace(/"/g, '""')}"` : fullName;
  out.push(`${escFullName},${email},${mssv},,STUDENT,`);
}

fs.writeFileSync(OUT, out.join('\n') + '\n', 'utf8');
console.log(`Đã tạo file: ${OUT}`);
console.log(`Tổng SV: ${seen.size}`);
console.log(`Bỏ qua (không có MSSV): ${skippedNoMssv}`);
console.log(`Bỏ qua (trùng MSSV): ${skippedDup}`);
