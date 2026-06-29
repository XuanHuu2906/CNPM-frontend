import XLSX from 'xlsx';

const SRC = 'D:\\CNPM\\DanhSachSinhVien_CNPM.xlsx';
const OUT = 'D:\\CNPM\\CNPM-frontend-push\\public\\templates\\LopHocPhan_CNPM_D23CQCN01-N.xlsx';

// Cấu hình lớp (PDT có thể sửa lại trong file Excel trước khi upload)
const TERM_NAME   = 'HỌC KỲ 2 - NĂM HỌC 2025 - 2026';
const SUBJECT_NAME = 'Nhập môn công nghệ phần mềm';
const SUBJECT_CODE = 'INT1339';
const CLASS_CODE   = 'D23CQCN01-N';
const TEACHER_CODE = 'GV001';

// Đọc danh sách SV từ Excel gốc (sheet "Điểm Danh", row 8+)
const wb = XLSX.readFile(SRC);
const srcWs = wb.Sheets['Điểm Danh'];
const srcRows = XLSX.utils.sheet_to_json(srcWs, { header: 1, defval: '' });
const dataRows = srcRows.slice(7);

const seen = new Set();
const students = [];
for (const r of dataRows) {
  const mssv = String(r[1] ?? '').trim();
  const hoLot = String(r[2] ?? '').trim();
  const ten = String(r[3] ?? '').trim();
  if (!mssv || seen.has(mssv)) continue;
  seen.add(mssv);
  students.push({ mssv, hoLot, ten });
}

// Build AoA (Array of Arrays) đúng layout AcademicClassImport mong đợi
// Row 1: tiêu đề
// Row 2: D2 = học kỳ
// Row 4: C4 = tên môn, E4 = mã môn (đặt theo header "Học phần | <tên> | | <mã>")
// Row 5: số tín chỉ
// Row 6: B6 = mã lớp, D6 = mã GV (kèm label rõ ràng cho người đọc)
// Row 7: header bảng SV
// Row 8+: SV
const aoa = [];

// Row 1
aoa.push(['', '', '', 'BẢNG KẾT QUẢ ĐIỂM DANH HỌC PHẦN']);
// Row 2 (D2 = TERM_NAME)
aoa.push(['', '', '', TERM_NAME]);
// Row 3
aoa.push([]);
// Row 4: C4 (col index 2) = SUBJECT_NAME, E4 (col index 4) = SUBJECT_CODE
aoa.push(['', 'Học phần', SUBJECT_NAME, 'Mã môn', SUBJECT_CODE]);
// Row 5
aoa.push(['', 'Số tín chỉ', 3]);
// Row 6: B6 (col index 1) = CLASS_CODE, D6 (col index 3) = TEACHER_CODE (kèm label)
aoa.push(['Mã lớp', CLASS_CODE, 'Mã GV', TEACHER_CODE]);
// Row 7: header bảng SV
aoa.push(['STT', 'Mã SV', 'Họ lót', 'Tên', 'Nhóm', 'Tên nhóm', 'Đề tài']);
// Row 8+
students.forEach((s, i) => {
  aoa.push([i + 1, s.mssv, s.hoLot, s.ten]);
});

const ws = XLSX.utils.aoa_to_sheet(aoa);

// Set column widths cho dễ đọc
ws['!cols'] = [
  { wch: 6 },  // STT
  { wch: 14 }, // Mã SV
  { wch: 22 }, // Họ lót
  { wch: 12 }, // Tên
  { wch: 8 },  // Nhóm
  { wch: 18 }, // Tên nhóm
  { wch: 30 }, // Đề tài
];

const newWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWb, ws, 'Điểm Danh');
XLSX.writeFile(newWb, OUT);

console.log(`Đã tạo file lớp học phần: ${OUT}`);
console.log(`  Học kỳ:  ${TERM_NAME}`);
console.log(`  Môn:     ${SUBJECT_NAME} (${SUBJECT_CODE})`);
console.log(`  Lớp:     ${CLASS_CODE}`);
console.log(`  GV:      ${TEACHER_CODE}`);
console.log(`  SV:      ${students.length}`);
