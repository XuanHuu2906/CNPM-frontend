import XLSX from 'xlsx';
const wb = XLSX.readFile('D:\\CNPM\\DanhSachSinhVien_CNPM.xlsx');

function audit(sheetName) {
  console.log(`\n=== Audit sheet "${sheetName}" ===`);
  const ws = wb.Sheets[sheetName];
  if (!ws) { console.log('(không có sheet)'); return null; }
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const dataRows = rows.slice(7); // row 8+

  const all = [];
  const byMssv = new Map();
  const missingGroup = [];
  let currentGroupNo = null;
  const groupNoSet = new Set();
  const groupMemberCount = new Map();

  dataRows.forEach((r, i) => {
    const rowNum = i + 8;
    const mssv = String(r[1] ?? '').trim();
    if (!mssv) return;
    const hoLot = String(r[2] ?? '').trim();
    const ten = String(r[3] ?? '').trim();
    const nhomRaw = r[4];
    const tenNhom = String(r[5] ?? '').trim();

    let groupNoForThisRow = null;
    if (nhomRaw !== '' && nhomRaw !== null && nhomRaw !== undefined) {
      const n = Number(nhomRaw);
      if (Number.isInteger(n) && n > 0) {
        currentGroupNo = n;
        groupNoSet.add(n);
        groupNoForThisRow = n;
      }
    }
    if (currentGroupNo === null) {
      missingGroup.push({ rowNum, mssv, fullName: `${hoLot} ${ten}`.trim() });
    } else {
      groupMemberCount.set(currentGroupNo, (groupMemberCount.get(currentGroupNo) || 0) + 1);
    }

    all.push({ rowNum, mssv, fullName: `${hoLot} ${ten}`.trim(), groupNoForThisRow, tenNhom, assignedGroup: currentGroupNo });
    if (byMssv.has(mssv)) {
      byMssv.get(mssv).push(rowNum);
    } else {
      byMssv.set(mssv, [rowNum]);
    }
  });

  const dups = [...byMssv.entries()].filter(([_, rows]) => rows.length > 1);

  console.log(`Tổng dòng có MSSV: ${all.length}`);
  console.log(`MSSV unique:       ${byMssv.size}`);
  console.log(`Số nhóm distinct:  ${groupNoSet.size}`);
  console.log(`Tổng member (nếu kế thừa currentGroupNo): ${[...groupMemberCount.values()].reduce((s, v) => s + v, 0)}`);

  if (dups.length) {
    console.log(`\nDUPLICATE MSSV (${dups.length}):`);
    dups.forEach(([mssv, rows]) => console.log(`  ${mssv} → rows ${rows.join(', ')}`));
  } else {
    console.log('Không có MSSV trùng.');
  }

  if (missingGroup.length) {
    console.log(`\nSV không có "Nhóm" cha (xuất hiện TRƯỚC nhóm đầu tiên): ${missingGroup.length}`);
    missingGroup.forEach(s => console.log(`  R${s.rowNum}: ${s.mssv} - ${s.fullName}`));
  }

  // Nhóm có size bất thường
  console.log('\nKích thước từng nhóm:');
  [...groupMemberCount.entries()].sort((a, b) => a[0] - b[0]).forEach(([no, cnt]) => {
    const marker = cnt === 3 ? '' : `  ← (≠3)`;
    console.log(`  Nhóm ${no}: ${cnt} SV${marker}`);
  });

  return { all, dups, missingGroup, groupNoSet, groupMemberCount };
}

const dd = audit('Điểm Danh');
const dt = audit('Điểm Thi');

// So sánh MSSV giữa 2 sheet
if (dd && dt) {
  const ddMssv = new Set(dd.all.map(x => x.mssv));
  const dtMssv = new Set(dt.all.map(x => x.mssv));
  const onlyInDD = [...ddMssv].filter(m => !dtMssv.has(m));
  const onlyInDT = [...dtMssv].filter(m => !ddMssv.has(m));
  console.log('\n=== So sánh 2 sheet ===');
  console.log(`Chỉ có trong Điểm Danh: ${onlyInDD.length}`, onlyInDD);
  console.log(`Chỉ có trong Điểm Thi: ${onlyInDT.length}`, onlyInDT);
}
