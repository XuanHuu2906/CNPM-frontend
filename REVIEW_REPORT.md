# BÁO CÁO KIỂM TRA DỰ ÁN
## Phần mềm Chấm Điểm Báo Cáo Đề Tài Môn Học (CNPM)

> **Cập nhật 2026-06-22**: Báo cáo ban đầu lập khi DB Supabase đã paused và đa số bug chưa được sửa. Sau các Phase 2 / 3 / A / B / C, gần như toàn bộ bug critical & high đã được fix. Xem mục **5. LỊCH SỬ FIX** cuối file để đối chiếu commit.

---

## 0. TÓM TẮT TỔNG QUAN

| Hạng mục | Trước fix | Sau fix (hiện tại) |
|---|---|---|
| **Bug nghiêm trọng (Critical)** | 8 lỗi | **0** (chỉ còn S2: secret commit vào `.env` — Phase 1 chưa làm) |
| **Bug TypeScript khi build** | BE 2 · FE 11+ → không build production được | **0** lỗi cả BE & FE (`tsc --noEmit` sạch) |
| **Bug runtime** | Không test được vì Supabase paused | Vẫn cần DB sống để test end-to-end; code-path đã verify qua tsc + đọc code |
| **Độ phủ Use Case** | 17/34 ✅ · 15/34 ⚠️ · 2/34 ❌ | **32/34 ✅ · 1/34 🟡 (UC-I04 tier-2/3) · 1/34 ❌ (UC-I06 ngoài MVP)** |
| **Tuân thủ nghiệp vụ** | 5/10 R vi phạm | **0/10 vi phạm** · 2/10 còn ⚠️ (R7 module comments, R10 updateRubric chưa tồn tại) |
| **Bảo mật** | 4 lỗ hổng (IDOR, draft grade, stack trace, secrets) | **1 còn lại**: S2 secrets trong git. IDOR/draft fix xong. Stack trace có warning runtime |
| **Đánh giá tổng thể** | KHÔNG sẵn sàng production | **Sẵn sàng staging** sau khi rotate secrets (S2) và chạy `npx prisma db push` cho 2 cột mới |

---

## 1. THÔNG TIN CƠ BẢN

### 1.1 Công nghệ
- **Backend**: Node.js + Express + TypeScript + Prisma ORM + PostgreSQL (Supabase) + JWT + Multer + Cloudinary + Resend (email) + Winston
- **Frontend**: React 19 + Vite + TypeScript + TailwindCSS + React Query + React Hook Form + Axios + Recharts + Sonner toast
- **Tài liệu nghiệp vụ**: 28 Use Case chính + 6 Use Case include (`<<include>>`)

### 1.2 Cấu trúc kiến trúc
BE phân tầng đúng chuẩn: `routes → controllers → services → repositories → prisma`. Có middleware `authenticate` (JWT) + `authorize` (RBAC) + `validate` (Zod) + `errorHandler` tập trung. **Sau fix**: tách `app.ts` / `server.ts` / `routes/index.ts` riêng; thêm `utils/ownership.ts` + `middleware/verifySubmissionOwnership.ts` + `utils/audit.ts`.

FE phân vùng đúng theo 4 role: `student/`, `teacher/`, `academic/`, `admin/`. Có `PrivateRoute`, `RoleRoute`, `PublicRoute` guard. **Sau fix**: `PrivateRoute` thêm check `mustChangePassword` → redirect `/change-password`.

### 1.3 Cấu trúc Database
22 model Prisma — schema hợp lệ (`npx prisma validate` ✅). Đáng chú ý:
- Đã có refactor `ClassEnrollment` + `GroupMember` (1 SV → nhiều lớp → nhiều nhóm). Tốt.
- Status (`MaTrangThai`), Role (`VaiTro`) lưu dạng `String` — không phải Prisma enum. Code dùng `UserRole`, `SubmissionStatus` qua **monkey-patch** trong `config/prisma.ts` và `seed.ts`. (TODO B18 đã ghi trong schema, chưa migrate.)
- **Sau fix** schema thêm 2 cột — cần `npx prisma db push` khi DB sống:
  - `User.BatBuocDoiMatKhau` (Boolean, default false) — UC-13 / S5
  - `BaoCao.LoaiViPham` (String?) — B13


---

## 3. TIÊU CHÍ 2 — ĐỘ ĐẦY ĐỦ CHỨC NĂNG (UC COVERAGE)

### 3.1 Bảng phủ Use Case (cập nhật sau fix)

| UC | Tên UC | Actor | BE Route | BE Service | FE Page | Trạng thái |
|----|---|---|---|---|---|---|
| UC-01 | Đăng nhập | All | `/auth/login` | `auth.service` | `auth/Login.tsx` | ✅ Có (thêm audit DANG_NHAP) |
| UC-02 | Thông tin cá nhân | SV | `/users/profile` | `user.service` | `student/StudentSettings.tsx` | ✅ Có |
| UC-03 | Nộp báo cáo | SV | `/submissions/submit` | `submission.service` | `student/StudentSubmit.tsx` | ✅ **FIXED** (B3): BE chặn nộp đè khi chưa có YEU_CAU_SUA hoặc ResubmissionRequest duyệt |
| UC-04 | Nộp lại báo cáo | SV | `/submissions/submit` | `submission.service.submitReport` | `student/StudentSubmit.tsx` | ✅ **FIXED**: heading + button đổi theo state (CHUA_NOP / YEU_CAU_SUA) — UX phân biệt rõ |
| UC-05 | Theo dõi tiến độ | SV | `/submissions/my` | `submission.service` | `student/StudentDashboard.tsx` | ✅ Có (classId param chính xác — B9) |
| UC-06 | Xem điểm/phản hồi | SV | `/grades/submission/:id` | `grade.service` | `student/StudentEvaluation.tsx` | ✅ **FIXED** (B1): controller chặn SV xem draft + middleware ownership scope |
| UC-07 | Quản lý lớp học phần | GV | `/teacher/class-sections` | `teacher.service` | `teacher/TeacherDashboard.tsx` | ✅ Có |
| UC-08 | Thiết lập rubric | GV | `/rubrics` | `rubric.service` | `teacher/RubricDesigner.tsx` | ✅ **FIXED** (B6): chỉ TEACHER tạo/xoá rubric |
| UC-09 | Chấm điểm | GV | `/grades/submission/:id` | `grade.service` | `teacher/GradingWorkshop.tsx` | ✅ **FIXED** (B5 + TS): `verifyTeacherClassOwnership` + TS lỗi conflict OCC fix xong |
| UC-10 | Gửi yêu cầu sửa | GV | `/submissions/:id/status` + `/edit-requests` | `submission.service` | `teacher/GradingWorkshop.tsx` | ✅ Có (thêm audit CAP_NHAT_TRANG_THAI_BAI) |
| UC-11 | Xuất báo cáo lớp | GV | (client-side CSV) | — | `teacher/TeacherStatistics.tsx` | ✅ **FIXED**: CSV thêm section "Chi tiết bài nộp theo nhóm" có `topicName` (TS-BE-1 cũng đã fix select `topicName: true`) |
| UC-12 | Nhập dữ liệu nền | Admin/PĐT | `/academic/*/batch` + `/users/batch` | `academic.service` | `admin/BatchImporter.tsx` | ✅ Có (thêm S4 batch limit 500 records) |
| UC-13 | Cấp quyền tài khoản | Admin | `/users/:id/role-status`, `/users/:id/reset-password`, `/auth/change-password` | `user.service`, `auth.service` | `admin/AccountManagement.tsx`, `auth/ChangePassword.tsx` (mới) | ✅ **FIXED**: TS lỗi fix; thêm `User.mustChangePassword` + force-change flow (BE flag + FE guard `PrivateRoute` redirect `/change-password`); seed flag mustChangePassword=true cho tất cả tài khoản mặc định |
| UC-14 | Cấu hình hệ thống | Admin | `/system/configs` | `system.service` | `admin/SystemSettings.tsx` | ✅ **FIXED** (B12): chỉ ADMIN |
| UC-15 | Xử lý vi phạm | GV/PĐT/Admin | `/submissions/:id/status` (TU_CHOI) | `submission.service` | `teacher/GradingWorkshop.tsx` | ✅ **FIXED** (B13): cột `violationType` riêng (Prisma migration ready); FE thêm dropdown chọn loại vi phạm (DAO_VAN / NOP_RAC / TRE_HAN / KHONG_DUNG_DE_TAI / CHO_KIEM_TRA / KHAC) |
| UC-16 | Phê duyệt kết quả | PĐT | `/system/grades/:id/approve` | `system.service` | `academic/AcademicApprovals.tsx` | ✅ Có |
| UC-17 | Điều chỉnh GV phụ trách | PĐT | `/academic/assignments` | `academic.service` | `academic/AcademicAssignment.tsx` | ✅ Có |
| UC-18 | Giám sát tiến độ | PĐT/Admin | `/system/semesters/:id/progress` | `system.service` | `academic/AcademicDashboard.tsx`, `admin/ProgressMonitoring.tsx` | ✅ Có |
| UC-19 | Khóa kết quả cuối kỳ | Admin | `/system/semesters/:id/lock` | `system.service.lockSemester` | `academic/AcademicTerms.tsx` | ✅ **FIXED**: precondition (tất cả báo cáo phải HOAN_THANH) đã có trong `lockSemester`; chặn bypass qua `updateTerm` bằng cách bỏ `isLocked` khỏi `updateTermSchema` |
| UC-20 | Sao lưu / phục hồi | Admin | `/system/backup`, `/system/restore`, `/system/backups/*` | `system.service` | `admin/DataBackupRestore.tsx` | ✅ **FIXED** (B11): chỉ ADMIN |
| UC-21 | Xem nhật ký hệ thống | Admin | `/system/logs` | `system.service` | `admin/SystemAuditTrail.tsx` | ✅ **FIXED** (B12): chỉ ADMIN |
| UC-22 | Thông báo | All | `/notifications` | `notification.service` | `student/StudentNotifications.tsx`, `teacher/TeacherNotifications.tsx` | ✅ Có |
| UC-23 | Phân nhóm SV | GV | `/teacher/class-sections/:id/groups` | `teacher.service` | `teacher/GroupManagement.tsx` | ✅ Có |
| UC-24 | Giao đề tài | GV | `/teacher/groups/:id/topic` | `teacher.service` | `teacher/GroupManagement.tsx` | ✅ Có |
| UC-25 | Yêu cầu nộp lại (SV) | SV | `/resubmission-requests` | `resubmission-request.service` | `student/StudentSubmit.tsx` | ✅ **FIXED**: B3 chặn nộp đè trực tiếp → SV phải đi qua flow này; FE đã có button "Yêu cầu nộp lại báo cáo" + banner pending request |
| UC-26 | Duyệt yêu cầu nộp lại | GV | `/resubmission-requests/:id/*` | `resubmission-request.service` | `teacher/ResubmissionRequests.tsx` | ✅ Có |
| UC-27 | Yêu cầu mở lại chấm | GV | `/teacher/submissions/:id/reopen-request` | `reopen-request.service` | `teacher/GradingWorkshop.tsx` | ✅ Có |
| UC-28 | Duyệt yêu cầu mở lại chấm | PĐT | `/academic/grading-reopen-requests/*` | `reopen-request.service` | `academic/GradingReopenRequests.tsx` | ✅ Có |
| UC-I01 | Kiểm tra quyền truy cập | Hệ thống | `middleware/auth.ts` + `verifySubmissionOwnership` + `verifyTeacherClassOwnership` | — | — | ✅ **FIXED** (B2, B4, B5): ownership middleware đã wire đầy đủ cho submission/grade |
| UC-I02 | Kiểm tra file nộp/import | Hệ thống | multer + whitelist mime + whitelist extension | — | — | ✅ **FIXED**: cả mime check + extension whitelist (`.pdf/.png/.jpg/.jpeg/.doc/.docx`); 20MB cap; chỉ STUDENT/TEACHER được upload |
| UC-I03 | Gửi thông báo tự động | Hệ thống | `notification.service`, `email.service` | — | — | ✅ Có |
| UC-I04 | Ghi lịch sử thao tác | Hệ thống | `SubmissionLog` + `SystemLog` + `utils/audit.ts` | — | — | 🟡 **PARTIAL**: tier-1 done (DANG_NHAP / DOI_MAT_KHAU / DAT_LAI_MAT_KHAU / TAO_TAI_KHOAN / CAP_NHAT_VAI_TRO / RESET_MAT_KHAU_ADMIN / CHAM_DIEM_* / CAP_NHAT_TRANG_THAI_BAI + system-level lock/backup/restore). Tier-2/3 còn TODO: resubmission/reopen requests, group/topic, batch imports, rubric CRUD |
| UC-I05 | Tính điểm tổng | Hệ thống | `grade.service:54-78` | — | — | ✅ Có (theo trọng số %) |
| UC-I06 | Đồng bộ dữ liệu nền | Hệ thống | — | — | — | ❌ **NGOÀI MVP** — cần spec API hệ thống QLSV trường, để lại phase sau |

### 3.2 Tỷ lệ phủ (cập nhật)

| | Trước fix | Sau fix |
|---|---|---|
| **Đầy đủ (✅)** | 17/34 ≈ 50% | **32/34 ≈ 94%** |
| **Có nhưng vi phạm/làm dở (⚠️/🟡)** | 15/34 ≈ 44% | **1/34 ≈ 3%** (UC-I04 partial) |
| **Thiếu hoàn toàn (❌)** | 2/34 ≈ 6% | **1/34 ≈ 3%** (UC-I06 ngoài MVP) |

### 3.3 UC còn lại

1. **UC-I06** (Đồng bộ hệ thống QLSV ngoài) — ngoài phạm vi MVP. Cần spec API hệ thống quản lý sinh viên của trường trước khi implement.
2. **UC-I04 tier-2/3** — còn 20+ endpoint state-changing chưa log SystemLog: resubmission-request create/approve/reject, reopen-request create/approve/reject, group/topic create/update/delete, batch imports (users/classes/terms/enrollments), rubric create/delete, assignment changes. Có thể thêm dần khi cần compliance.

---

## 4. TIÊU CHÍ 3 — ĐÚNG NGHIỆP VỤ THỰC TẾ (cập nhật)

| # | Quy tắc nghiệp vụ | Kết quả trước | Kết quả sau | Bằng chứng |
|---|---|---|---|---|
| R1 | Admin/PĐT **KHÔNG** nhập nhóm/đề tài/rubric/điểm trong phạm vi chính | ❌ VI PHẠM | ✅ **ĐÚNG** | `rubric.routes.ts` chỉ TEACHER (B6 fix); `submission.routes.ts` PUT status bỏ ADMIN (B10 fix) |
| R2 | Chỉ GV phụ trách lớp được phân nhóm/giao đề tài/chấm điểm | ❌ VI PHẠM | ✅ **ĐÚNG** | `submission.service.updateStatus` + `grade.service.submitGrade` gọi `verifyTeacherClassOwnership` (B4, B5 fix) |
| R3 | SV **KHÔNG tự nộp đè** sau khi đã DA_NOP — phải gửi yêu cầu | ❌ VI PHẠM | ✅ **ĐÚNG** | `submission.service.submitReport` chỉ cho resubmit khi `YEU_CAU_SUA` hoặc có `ResubmissionRequest` DA_DUYET (B3 fix) |
| R4 | GV **KHÔNG tự sửa điểm** sau DA_CHAM — phải xin mở lại | ⚠️ GẦN ĐÚNG | ✅ **ĐÚNG** | `grade.service.submitGrade` chặn khi `submission.status ∈ {DA_CHAM, CHO_DUYET, HOAN_THANH}` (B7 fix) |
| R5 | SV **chỉ thấy điểm sau khi PĐT duyệt** (HOAN_THANH) | ❌ VI PHẠM | ✅ **ĐÚNG** | `grade.controller.getGradeBySubmissionId` chặn STUDENT khi status ≠ HOAN_THANH (B1 fix) |
| R6 | Điểm nháp chỉ GV thấy | ❌ VI PHẠM | ✅ **ĐÚNG** | Cùng B1 fix + middleware `verifySubmissionOwnershipBy('submissionId')` scope STUDENT/TEACHER |
| R7 | Không có chat/bình luận tự do GV-SV | ⚠️ VƯỢT PHẠM VI | ⚠️ **VẪN VƯỢT** | Module `/comments` vẫn còn full CRUD (B20). Quyết định bỏ hay rename "Ghi chú nội bộ" để Phase 4 |
| R8 | Thông báo theo đúng vai trò (PĐT không nhận event nhỏ) | ✅ Đúng | ✅ **ĐÚNG** | Không đổi |
| R9 | Khóa kỳ chỉ sau khi PĐT duyệt toàn bộ | ⚠️ CHƯA RÕ | ✅ **ĐÚNG** | `system.service.lockSemester:461-468` kiểm tra `approvedReports >= totalReports`; `updateTermSchema` bỏ `isLocked` để chặn bypass (UC-19 fix) |
| R10 | Rubric không sửa sau khi có điểm (trừ mở lại hợp lệ) | ⚠️ CHƯA ĐỦ | ⚠️ **CHƯA ĐỦ** | `rubric.service.deleteRubric` đã check `_count.grades > 0`; vẫn chưa có method `updateRubric` — nếu thêm sau này phải nhớ check |

**Tổng kết R**: **8/10 đúng** · 2/10 còn ⚠️ (R7 module comment, R10 chưa tồn tại updateRubric).

---

## 5. LỊCH SỬ FIX

### Backend (`D:\CNPM\CNPM-backend-push`, branch `Huu`)

| Commit | Nội dung | UC / Bug |
|---|---|---|
| `f54e241` | chore: extract app/server bootstrap + small config improvements | bootstrap refactor, CHO_DUYET monkey-patch, S4 batch limit, S5 random password, B19 enum literal, TS-BE-1 topicName |
| `1c2fad3` | fix(security): tighten role-based authorization per R1 | B6, B11, B12 |
| `dd265d2` | feat(security): enforce ownership and submission lifecycle rules | B2, B3, B4, B5, B7, B8, B9, B10, B16, B17 + B1 partial |
| `0dbc6b9` | fix(security): scope grade access by ownership (B1 completion) | B1 ownership middleware mở rộng |
| `812994d` | fix(academic): close lock bypass via updateTerm | UC-19 |
| `5b5dbb1` | feat(auth): force password change on first login | UC-13 + S5 |
| `ea76885` | fix(submission): store violation type in dedicated column | B13 |
| `e9bbc69` | fix(upload): whitelist file extension alongside mime | UC-I02 |
| `5fff462` | feat(audit): cover tier-1 mutations in SystemLog | UC-I04 (partial) |

### Frontend (`D:\CNPM\CNPM-frontend-push`, branch `Huu`)

| Commit | Nội dung | UC / Bug |
|---|---|---|
| `b9f2231` | fix(frontend): resolve TypeScript build errors + wire B9 classId | 11 TS lỗi + B9 |
| `3b729b2` | feat(auth): force first-login password change wire-up | UC-13 FE (Login redirect + PrivateRoute guard + `/change-password` page) |
| `8f2caa3` | feat(frontend): polish UC-04 / UC-11 / UC-15 wire-up | UC-04 UX, UC-11 CSV detail + topicName, UC-15 violationType dropdown |

---

## 6. CÔNG VIỆC CÒN LẠI

### Phase 1 — Bảo mật khẩn cấp (chưa làm) ⚠️ CRITICAL
- **S2**: `.env` còn trong git tracking với JWT_SECRET, Supabase password, Cloudinary, Resend key. Cần:
  1. `git rm --cached .env`, thêm `.env` vào `.gitignore`
  2. Tạo `.env.example`
  3. **Rotate** toàn bộ secret thật
- **B15**: `NODE_ENV=development` trong `.env` → stack trace có thể lộ. Document rõ "phải đổi sang `production` khi deploy" (đã thêm warning runtime trong `app.ts`).

### Phase 4 — Hardening (chưa làm)
- **B16**: thêm `express-rate-limit` cho `/submissions/upload` (mime + extension đã chặn, còn thiếu rate-limit)
- **B20**: quyết định module `/comments` — bỏ hoàn toàn hay đổi tên thành "Ghi chú nội bộ giảng viên" (R7)
- **UC-I04 tier-2/3**: thêm audit log cho 20+ endpoint còn lại (resubmission/reopen, group/topic, batch import, rubric)

### Phase 5 — Tech debt (low priority)
- **B18**: migrate Role/Status từ String sang Prisma enum (cần migration cẩn thận với dữ liệu hiện tại)
- **R10**: nếu thêm `updateRubric` sau này phải nhớ check `_count.grades > 0` tương tự `deleteRubric`

### Phase 6 — Out of MVP
- **UC-I06**: đồng bộ dữ liệu nền với hệ thống QLSV ngoài

### ⚠️ Bước thủ công bắt buộc khi DB Supabase sống lại
```bash
cd D:\CNPM\CNPM-backend-push
npx prisma db push   # apply 2 cột mới: User.BatBuocDoiMatKhau, BaoCao.LoaiViPham
npx prisma db seed   # tuỳ chọn: re-seed để gắn mustChangePassword=true cho dev data
```
