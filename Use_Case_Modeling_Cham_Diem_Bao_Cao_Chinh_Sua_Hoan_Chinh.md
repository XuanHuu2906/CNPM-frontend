**TÀI LIỆU USE CASE MODELING**

**PHẦN MỀM CHẤM ĐIỂM BÁO CÁO ĐỀ TÀI MÔN HỌC**

| **Thông tin**    | **Nội dung**                                                                                                                                                                                                                                                               |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Tên tài liệu     | Use Case Modeling - Bản chỉnh sửa hoàn chỉnh                                                                                                                                                                                                                               |
| Dự án            | Phần mềm Chấm Điểm Báo Cáo Đề Tài Môn Học                                                                                                                                                                                                                                  |
| Phiên bản        | 2.4                                                                                                                                                                                                                                                                        |
| Ngày cập nhật    | 26/06/2026                                                                                                                                                                                                                                                                 |
| Cách trình bày   | Đơn giản, rõ ràng, không sử dụng màu sắc trang trí                                                                                                                                                                                                                         |
| Phạm vi cập nhật | Cập nhật theo các quyết định nghiệp vụ đã thống nhất trong quá trình rà soát: giảng viên phụ trách lớp phân nhóm/giao đề tài/chấm điểm; Admin/PDT chỉ nhập dữ liệu nền; bổ sung yêu cầu nộp lại và yêu cầu mở lại chấm điểm; bỏ trao đổi tự do GV-SV khỏi phạm vi chính, thay bằng ghi chú nội bộ chỉ GV/PĐT/Admin xem được. Bản 2.1 bổ sung: bắt buộc đổi mật khẩu khi đăng nhập lần đầu (UC-13), phân loại vi phạm (UC-15), Ghi chú nội bộ giảng viên (UC-29), yêu cầu phi chức năng về rate-limit và audit log mở rộng. Bản 2.2 chốt quy ước nhập liệu lớp học phần: **tạo lớp học phần chỉ thực hiện qua Batch Importer** (bắt buộc kèm `teacherCode`); không còn endpoint tạo lớp đơn lẻ. Sau khi lớp đã tồn tại, thêm/xóa sinh viên dùng thao tác thủ công trên UI, đổi giảng viên phụ trách dùng UC-17. Đồng thời gỡ chức năng "Đề xuất phân công giảng viên tự động" khỏi UI Phòng Đào tạo vì batch import đã đảm bảo lớp có giảng viên ngay từ đầu kỳ. **Bản 2.3** tách rạch ròi nghiệp vụ vs kỹ thuật: (1) **Phòng Đào tạo là chủ sở hữu duy nhất** của nghiệp vụ nhập dữ liệu nền — Admin không còn nhập liệu (UC-12); (2) thêm flow **"1 file Excel = 1 lớp học phần"** cho PĐT: 1 file chứa metadata lớp + GV phụ trách + danh sách SV, hệ thống tự tạo Class + Assignment + ClassEnrollment, tự sinh tài khoản SV chưa có (mật khẩu mặc định + buộc đổi); (3) **GV có thể import Excel danh sách nhóm** trên UC-23 — phát hiện nhóm trưởng qua **chữ in đỏ** ở cột Họ-Tên, lưu cờ `isLeader` ở `GroupMember`; (4) gỡ trang "Nhập liệu hàng loạt" khỏi UI Admin, route batch backend siết về `ACADEMIC_DEPT`. **Bản 2.4** bổ sung cấu hình **Loại phân công đề tài** ở cấp Lớp học phần (`Class.assignmentType ∈ {CA_NHAN, NHOM}`, mặc định `NHOM`): (1) PĐT đặt giá trị qua dropdown ở UI Điều phối Phân công (`PATCH /academic/classes/:id/assignment-type`), bị từ chối nếu lớp đã có nhóm/đề tài; (2) khi `CA_NHAN` — GV gán đề tài trực tiếp cho từng SV qua `POST /teacher/class-sections/:classId/individual-assignments`, BE tự tạo `Group` size=1 với SV làm leader để pipeline submission/grading/evaluation dùng chung schema; (3) khi `NHOM` — flow UC-23 (tạo nhóm + giao đề tài) giữ nguyên; (4) các endpoint `createGroup`/`autoGenerateGroups` bị guard khi class ở `CA_NHAN`, ngược lại endpoint individual-assignment bị guard khi class ở `NHOM`. |

**Mục đích tài liệu**

Tài liệu này mô tả tác nhân, danh sách Use Case, quan hệ Actor - Use Case và đặc tả chi tiết các Use Case chính của hệ thống. Bản 2.0 thay thế nội dung chưa sát thực tế trong bản ban đầu, đặc biệt là phần phân công đề tài, phân nhóm, nộp lại báo cáo, mở lại chấm điểm và thông báo theo vai trò.

# 1. Tổng quan hệ thống

Phần mềm Chấm Điểm Báo Cáo Đề Tài Môn Học hỗ trợ quản lý quy trình từ dữ liệu nền, tổ chức lớp học phần, phân nhóm, giao đề tài, nộp báo cáo, chấm điểm, phê duyệt, công bố kết quả và khóa điểm cuối kỳ. Hệ thống phân quyền theo vai trò để đảm bảo mỗi actor chỉ thực hiện đúng trách nhiệm nghiệp vụ.

Phạm vi chính của hệ thống gồm:

- Sinh viên xem thông tin đề tài/nhóm, nộp báo cáo, theo dõi trạng thái, gửi yêu cầu nộp lại khi đã nộp nhưng cần chỉnh sửa, và xem kết quả sau khi được phê duyệt.

- Giảng viên phụ trách lớp học phần quản lý lớp, phân nhóm sinh viên (lớp loại `NHOM`) hoặc gán đề tài trực tiếp cho từng sinh viên (lớp loại `CA_NHAN`), thiết lập phiếu chấm điểm, yêu cầu sửa, chấm điểm và gửi yêu cầu mở lại chấm điểm khi cần.

- Admin vận hành hệ thống kỹ thuật: quản trị tài khoản, cấu hình, xem log, sao lưu/phục hồi dữ liệu, giám sát vi phạm và hỗ trợ kỹ thuật. **Admin không nhập dữ liệu nghiệp vụ** (học kỳ, lớp học phần, sinh viên, đăng ký lớp).

- Phòng Đào tạo quản lý học thuật ở mức kiểm soát và là **chủ sở hữu duy nhất** của nghiệp vụ nhập dữ liệu nền (UC-12): tạo học kỳ, nhập lớp học phần (1 file Excel = 1 lớp, tự gán GV phụ trách + tự sinh tài khoản SV), **cấu hình loại phân công đề tài của lớp** (`CA_NHAN` / `NHOM`, mặc định `NHOM`), gán/đổi giảng viên phụ trách, phê duyệt kết quả cuối cùng, duyệt yêu cầu mở lại chấm điểm và giám sát tiến độ toàn khoa.

- Hệ thống gửi thông báo đúng vai trò, không gửi mọi sự kiện nhỏ của lớp cho Phòng Đào tạo nếu sự kiện đó chỉ cần giảng viên xử lý.

**Nguyên tắc điều chỉnh so với bản ban đầu**

- Phòng Đào tạo là người duy nhất nhập dữ liệu nền (học kỳ, lớp học phần, GV phụ trách, sinh viên, đăng ký lớp). Admin chỉ vận hành kỹ thuật, không nhập dữ liệu nghiệp vụ.

- Phòng Đào tạo / Admin không nhập nhóm, đề tài, rubric hoặc điểm. Các dữ liệu này thuộc nghiệp vụ của giảng viên phụ trách lớp; nhóm có thể được giảng viên import bằng Excel danh sách (UC-23), trong đó hệ thống tự nhận diện **nhóm trưởng** qua chữ in đỏ ở cột Họ-Tên.

- Giảng viên phụ trách lớp là người phân nhóm (lớp `NHOM`) hoặc gán đề tài cá nhân (lớp `CA_NHAN`), giao đề tài và chấm điểm chính cho lớp học phần đó. Loại phân công ở cấp lớp do PĐT cấu hình; sau khi lớp đã có nhóm hoặc đề tài, không thể đổi loại.

- Sinh viên không tự nộp đè sau khi đã nộp thành công. Nếu muốn sửa, sinh viên phải gửi yêu cầu nộp lại để giảng viên duyệt.

- Giảng viên không tự sửa điểm sau khi đã xác nhận chấm xong. Nếu cần sửa, giảng viên gửi yêu cầu mở lại chấm điểm để Phòng Đào tạo duyệt.

- Chức năng chat/bình luận tự do giữa giảng viên và sinh viên không nằm trong phạm vi nghiệp vụ chính; thay bằng yêu cầu sửa, nhận xét chấm điểm và thông báo trạng thái.

- Hệ thống có chức năng "Ghi chú nội bộ giảng viên" (UC-29) chỉ dành cho Giảng viên, Phòng Đào tạo và Admin để ghi note hỗ trợ quy trình chấm. Sinh viên không truy cập được nội dung này nên không vi phạm nguyên tắc không có chat tự do GV-SV.

# 2. Tác nhân (Actors)

| **Tên Actor**              | **Mô tả**                                                                                                                                                                       |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sinh viên                  | Người thuộc lớp học phần, xem thông tin nhóm/đề tài, nộp báo cáo, gửi yêu cầu nộp lại khi cần, theo dõi tiến độ và xem kết quả sau khi được công bố.                            |
| Giảng viên                 | Người phụ trách lớp học phần; quản lý danh sách sinh viên, phân nhóm, giao đề tài, thiết lập phiếu chấm điểm, chấm điểm, nhận xét, yêu cầu sửa và xử lý yêu cầu nộp lại.        |
| Quản trị hệ thống (Admin)  | Người vận hành kỹ thuật; quản trị tài khoản, cấu hình hệ thống, sao lưu/phục hồi, xem log, khoá điểm cuối kỳ và hỗ trợ sự cố. Admin **không nhập dữ liệu nghiệp vụ** và không phê duyệt nội dung điểm. |
| Phòng Đào tạo              | Đơn vị quản lý học thuật; nhập dữ liệu nền (học kỳ, lớp học phần qua flow "1 file = 1 lớp", GV phụ trách, đăng ký lớp), phê duyệt kết quả cuối cùng, duyệt yêu cầu mở lại chấm điểm, điều chỉnh giảng viên phụ trách trong trường hợp đặc biệt và giám sát tiến độ toàn khoa. |
| Hệ thống quản lý sinh viên | Hệ thống ngoài hoặc nguồn dữ liệu cung cấp danh sách sinh viên, giảng viên, học kỳ, lớp học phần và đăng ký lớp học phần khi có tích hợp.                                       |
| Dịch vụ Email/Thông báo    | Module hoặc hệ thống ngoài gửi thông báo nội bộ và email theo các sự kiện nghiệp vụ đã định nghĩa.                                                                              |

# 3. Phạm vi dữ liệu và trách nhiệm nghiệp vụ

| **Nhóm dữ liệu / nghiệp vụ**                                      | **Người thực hiện chính**                    | **Ghi chú**                                                                                                        |
|-------------------------------------------------------------------|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| Sinh viên, giảng viên, học kỳ, lớp học phần, đăng ký lớp học phần | Phòng Đào tạo (duy nhất)                     | Học kỳ + GV nhập theo lô (batch). Mỗi lớp học phần nhập qua flow **"1 file Excel = 1 lớp"**: file chứa metadata lớp + GV phụ trách + danh sách SV; hệ thống tự tạo Class + Assignment + ClassEnrollment, tự sinh tài khoản SV chưa có (mật khẩu mặc định 123456, buộc đổi). Admin không tham gia khâu nhập liệu này. |
| Loại phân công đề tài của lớp (`Class.assignmentType`)            | Phòng Đào tạo (duy nhất)                     | Mặc định `NHOM` khi tạo lớp. PĐT chỉnh giá trị `CA_NHAN`/`NHOM` qua dropdown ở UI Điều phối Phân công (`PATCH /academic/classes/:id/assignment-type`). Thay đổi bị từ chối khi lớp đã có nhóm hoặc đề tài (`prisma.group.count > 0`). GV không tự đổi được; Admin không can thiệp. |
| Phân nhóm sinh viên                                               | Giảng viên phụ trách lớp học phần            | **Chỉ áp dụng khi `Class.assignmentType = NHOM`.** Giảng viên tạo nhóm sau khi lớp đã có danh sách sinh viên. Có thể nhập tay từng nhóm hoặc **import Excel danh sách**: hệ thống nhận diện **nhóm trưởng** qua chữ in đỏ ở cột Họ-Tên (lưu `isLeader` ở `GroupMember`). Với lớp `CA_NHAN`, các endpoint `createGroup`/`autoGenerateGroups` trả 400; nhóm được BE auto-tạo size=1 khi GV gán đề tài cá nhân. PĐT/Admin không can thiệp khâu này. |
| Giao đề tài                                                       | Giảng viên phụ trách lớp học phần            | Rẽ nhánh theo `Class.assignmentType`: **`NHOM`** — GV gán đề tài cho từng nhóm (`PATCH /teacher/groups/:id/topic` hoặc lúc tạo nhóm); **`CA_NHAN`** — GV gán đề tài trực tiếp cho từng SV (`POST /teacher/class-sections/:classId/individual-assignments`), BE tự tạo `Group` size=1 + `GroupMember.isLeader=true` để pipeline submission/grading/evaluation dùng chung. Không nhập đề tài hàng loạt bởi Admin trong phạm vi chính. |
| Rubric / phiếu chấm điểm                                          | Giảng viên phụ trách lớp học phần            | Tạo trước khi chấm điểm. Không chỉnh sửa sau khi đã có điểm, trừ quy trình được mở lại hợp lệ.                     |
| Chấm điểm và nhận xét                                             | Giảng viên phụ trách lớp học phần            | Điểm nháp chỉ hiển thị cho giảng viên. Sinh viên chỉ thấy kết quả sau khi Phòng Đào tạo phê duyệt.                 |
| Phê duyệt kết quả                                                 | Phòng Đào tạo                                | Là bước kiểm soát cuối cùng trước khi công bố điểm cho sinh viên.                                                  |
| Khóa kết quả cuối kỳ                                              | Admin                                        | Chỉ thực hiện sau khi Phòng Đào tạo xác nhận toàn bộ kết quả đã được phê duyệt.                                    |

# 4. Trạng thái báo cáo và yêu cầu

**4.1. Trạng thái báo cáo**

| **Mã trạng thái** | **Tên trạng thái** | **Ý nghĩa**                                                                                                                            |
|-------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| CHUA_NOP          | Chưa nộp           | Sinh viên/nhóm chưa nộp báo cáo.                                                                                                       |
| DA_NOP            | Đã nộp             | Báo cáo đã được nộp hợp lệ và chờ giảng viên xử lý.                                                                                    |
| DANG_CHAM         | Đang chấm          | Giảng viên đang xem báo cáo, nhập điểm nháp hoặc nhận xét.                                                                             |
| YEU_CAU_SUA       | Yêu cầu sửa        | Giảng viên yêu cầu sinh viên/nhóm chỉnh sửa và nộp lại.                                                                                |
| DA_CHAM           | Đã chấm            | Giảng viên đã hoàn tất chấm điểm và xác nhận. Trạng thái này có thể được hệ thống dùng như mốc nội bộ trước khi chuyển sang chờ duyệt. |
| CHO_DUYET         | Chờ duyệt          | Kết quả đã được giảng viên xác nhận, đang chờ Phòng Đào tạo phê duyệt.                                                                 |
| HOAN_THANH        | Hoàn thành         | Kết quả đã được Phòng Đào tạo phê duyệt và công bố cho sinh viên.                                                                      |
| TU_CHOI           | Từ chối            | Báo cáo bị từ chối do vi phạm hoặc không đạt điều kiện nộp.                                                                            |

**4.2. Trạng thái yêu cầu nghiệp vụ**

| **Mã trạng thái** | **Tên trạng thái** | **Ý nghĩa**                                                        |
|-------------------|--------------------|--------------------------------------------------------------------|
| CHO_DUYET         | Chờ duyệt          | Yêu cầu đang chờ người có quyền xử lý.                             |
| DA_DUYET          | Đã duyệt           | Yêu cầu được chấp nhận; hệ thống mở quyền tương ứng.               |
| TU_CHOI           | Từ chối            | Yêu cầu không được chấp nhận; hệ thống lưu lý do từ chối.          |
| HUY               | Đã hủy             | Người gửi hủy yêu cầu trước khi được xử lý, nếu hệ thống cho phép. |

**4.3. Luồng chuyển trạng thái báo cáo chính**

| **Từ trạng thái**     | **Sang trạng thái** | **Điều kiện / hành động kích hoạt**                                                                                             |
|-----------------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------|
| CHUA_NOP              | DA_NOP              | Sinh viên/đại diện nhóm nộp báo cáo hợp lệ trước hạn.                                                                           |
| DA_NOP                | DANG_CHAM           | Giảng viên mở báo cáo và bắt đầu chấm.                                                                                          |
| DA_NOP hoặc DANG_CHAM | YEU_CAU_SUA         | Giảng viên gửi yêu cầu sửa báo cáo kèm nội dung cụ thể.                                                                         |
| YEU_CAU_SUA           | DA_NOP              | Sinh viên/đại diện nhóm nộp lại báo cáo theo yêu cầu sửa.                                                                       |
| DANG_CHAM             | DA_CHAM             | Giảng viên hoàn tất nhập điểm/nhận xét và xác nhận chấm xong.                                                                   |
| DA_CHAM               | CHO_DUYET           | Hệ thống tự động tổng hợp điểm và chuyển sang chờ Phòng Đào tạo phê duyệt.                                                      |
| CHO_DUYET             | HOAN_THANH          | Phòng Đào tạo phê duyệt kết quả.                                                                                                |
| CHO_DUYET             | DANG_CHAM           | Phòng Đào tạo trả về chấm lại hoặc duyệt yêu cầu mở lại chấm điểm.                                                              |
| HOAN_THANH            | DANG_CHAM           | Chỉ áp dụng khi chưa khóa cuối kỳ và Phòng Đào tạo duyệt yêu cầu mở lại chấm điểm.                                              |
| DA_NOP hoặc DANG_CHAM | TU_CHOI             | Giảng viên hoặc người có quyền xử lý từ chối khi có vi phạm. Admin chỉ hỗ trợ kỹ thuật, không tự quyết định nội dung học thuật. |

# 5. Danh sách Use Case

| **Mã UC** | **Tên Use Case**                | **Actor chính**                           | **Loại**        | **Mô tả ngắn**                                                                                              |
|-----------|---------------------------------|-------------------------------------------|-----------------|-------------------------------------------------------------------------------------------------------------|
| UC-01     | Đăng nhập hệ thống              | Tất cả người dùng                         | Chính           | Xác thực tài khoản và chuyển đến giao diện theo vai trò.                                                    |
| UC-02     | Quản lý thông tin cá nhân       | Sinh viên                                 | Chính           | Xem/cập nhật thông tin liên hệ, đổi mật khẩu, xem thông tin nhóm.                                           |
| UC-03     | Nộp báo cáo                     | Sinh viên                                 | Chính           | Upload báo cáo chính và file đính kèm lần đầu.                                                              |
| UC-04     | Nộp lại báo cáo                 | Sinh viên                                 | Chính           | Nộp phiên bản chỉnh sửa khi trạng thái cho phép hoặc khi yêu cầu nộp lại đã được duyệt.                     |
| UC-05     | Theo dõi tiến độ                | Sinh viên                                 | Chính           | Xem trạng thái báo cáo, lịch sử nộp và lịch sử chuyển trạng thái.                                           |
| UC-06     | Xem điểm và phản hồi            | Sinh viên                                 | Chính           | Xem điểm/nhận xét sau khi kết quả được phê duyệt; xem nội dung yêu cầu sửa khi có.                          |
| UC-07     | Quản lý lớp học phần            | Giảng viên                                | Chính           | Xem lớp phụ trách, danh sách sinh viên/nhóm, tiến độ nộp và trạng thái xử lý.                               |
| UC-08     | Thiết lập phiếu chấm điểm       | Giảng viên                                | Chính           | Tạo/chỉnh sửa tiêu chí, thang điểm, trọng số trước khi chấm.                                                |
| UC-09     | Chấm điểm báo cáo               | Giảng viên                                | Chính           | Xem file, nhập điểm nháp/chính thức, nhận xét và xác nhận chấm xong.                                        |
| UC-10     | Gửi yêu cầu sửa báo cáo         | Giảng viên                                | Chính           | Yêu cầu sinh viên chỉnh sửa báo cáo kèm ghi chú cụ thể.                                                     |
| UC-11     | Xuất báo cáo lớp                | Giảng viên                                | Chính           | Xuất bảng điểm/thống kê lớp hoặc môn học phụ trách.                                                         |
| UC-12     | Nhập dữ liệu nền hệ thống       | Phòng Đào tạo                             | Chính           | Nhập học kỳ, GV (batch) và **lớp học phần theo flow "1 file = 1 lớp"** (kèm GV phụ trách + danh sách SV + auto-tạo tài khoản SV chưa có); cấu hình **loại phân công đề tài** (`CA_NHAN`/`NHOM`, mặc định `NHOM`) cho từng lớp. Admin không tham gia. |
| UC-13     | Cấp phân quyền tài khoản        | Admin                                     | Chính           | Tạo, khóa/mở, đặt lại mật khẩu, gán vai trò tài khoản.                                                      |
| UC-14     | Cấu hình hệ thống               | Admin                                     | Chính           | Cấu hình thang điểm, định dạng file, dung lượng, thông báo, kiểm tra đạo văn.                               |
| UC-15     | Xử lý vi phạm báo cáo           | Giảng viên, Phòng Đào tạo, Admin kỹ thuật | Chính           | Từ chối hoặc ghi nhận báo cáo vi phạm theo đúng thẩm quyền.                                                 |
| UC-16     | Phê duyệt kết quả               | Phòng Đào tạo                             | Chính           | Duyệt kết quả cuối cùng hoặc trả về chấm lại.                                                               |
| UC-17     | Điều chỉnh giảng viên phụ trách | Phòng Đào tạo                             | Chính           | Điều chỉnh giảng viên phụ trách lớp học phần trong trường hợp đặc biệt.                                     |
| UC-18     | Giám sát tiến độ                | Phòng Đào tạo, Admin                      | Chính           | Theo dõi tiến độ toàn khoa/toàn hệ thống theo lớp, môn, giảng viên, kỳ học.                                 |
| UC-19     | Khóa kết quả cuối kỳ            | Admin                                     | Chính           | Khóa điểm sau khi Phòng Đào tạo phê duyệt toàn bộ.                                                          |
| UC-20     | Sao lưu phục hồi dữ liệu        | Admin                                     | Chính           | Sao lưu định kỳ/thủ công và phục hồi khi có sự cố.                                                          |
| UC-21     | Xem nhật ký hệ thống            | Admin                                     | Chính           | Xem lịch sử đăng nhập, thao tác quan trọng và hoạt động bất thường.                                         |
| UC-22     | Xem và quản lý thông báo        | Tất cả người dùng                         | Chính           | Xem thông báo mới trên chuông thông báo và trang thông báo đầy đủ.                                          |
| UC-23     | Quản lý / phân nhóm sinh viên   | Giảng viên                                | Chính           | **Chỉ áp dụng cho lớp `NHOM`.** Tạo/chỉnh sửa nhóm thủ công hoặc **import Excel danh sách nhóm** (nhận diện nhóm trưởng qua chữ in đỏ); chọn người đại diện nộp nếu cần. Với lớp `CA_NHAN` flow này bị guard, dùng UC-24 nhánh cá nhân. |
| UC-24     | Quản lý / giao đề tài           | Giảng viên                                | Chính           | Rẽ nhánh theo `Class.assignmentType`: **`NHOM`** — gán đề tài cho nhóm; **`CA_NHAN`** — gán đề tài trực tiếp cho từng SV (BE auto-tạo `Group` size=1 để dùng chung pipeline submission). |
| UC-25     | Gửi yêu cầu nộp lại báo cáo     | Sinh viên                                 | Chính           | Sinh viên đã nộp báo cáo nhưng muốn chỉnh sửa thì gửi yêu cầu cho giảng viên.                               |
| UC-26     | Duyệt yêu cầu nộp lại báo cáo   | Giảng viên                                | Chính           | Giảng viên duyệt/từ chối yêu cầu nộp lại của sinh viên.                                                     |
| UC-27     | Gửi yêu cầu mở lại chấm điểm    | Giảng viên                                | Chính           | Giảng viên xin mở lại quyền chấm điểm sau khi đã xác nhận chấm xong.                                        |
| UC-28     | Duyệt yêu cầu mở lại chấm điểm  | Phòng Đào tạo                             | Chính           | Phòng Đào tạo duyệt/từ chối yêu cầu mở lại chấm điểm.                                                       |
| UC-29     | Ghi chú nội bộ giảng viên       | Giảng viên, Phòng Đào tạo, Admin          | Chính           | GV/PĐT/Admin tạo, xem và xoá ghi chú nội bộ trên báo cáo để hỗ trợ quy trình chấm. Sinh viên không truy cập được. |
| UC-30     | Nhập danh sách SV & Gửi tài khoản | Phòng Đào tạo                           | Chính           | Phòng Đào tạo upload Excel danh sách SV (MSSV, Họ tên, Email); hệ thống tự tạo tài khoản với mật khẩu ngẫu nhiên (bắt buộc đổi sau lần đầu) và gửi email kèm thông tin đăng nhập cho từng SV. |
| UC-I01    | Kiểm tra quyền truy cập         | Hệ thống                                  | \<\<include\>\> | Được gọi trước các thao tác cần phân quyền.                                                                 |
| UC-I02    | Kiểm tra file nộp/import        | Hệ thống                                  | \<\<include\>\> | Kiểm tra định dạng, dung lượng, cấu trúc file và hạn nộp.                                                   |
| UC-I03    | Gửi thông báo tự động           | Dịch vụ Email/Thông báo                   | \<\<include\>\> | Gửi thông báo khi có deadline, yêu cầu sửa, yêu cầu nộp lại, chờ duyệt hoặc thay đổi trạng thái quan trọng. |
| UC-I04    | Ghi lịch sử thao tác/trạng thái | Hệ thống                                  | \<\<include\>\> | Ghi thời điểm, người thực hiện, dữ liệu trước/sau và trạng thái mới.                                        |
| UC-I05    | Tính điểm tổng                  | Hệ thống                                  | \<\<include\>\> | Tự tính điểm tổng theo phiếu chấm điểm/trọng số.                                                            |
| UC-I06    | Đồng bộ dữ liệu nền             | Hệ thống quản lý sinh viên                | \<\<include\>\> | Đồng bộ danh sách sinh viên, giảng viên, học kỳ, lớp học phần và đăng ký lớp.                               |

# 6. Quan hệ Actor - Use Case

| **Actor**                  | **Use Case liên quan**                                                                             |
|----------------------------|----------------------------------------------------------------------------------------------------|
| Sinh viên                  | UC-01, UC-02, UC-03, UC-04, UC-05, UC-06, UC-22, UC-25                                             |
| Giảng viên                 | UC-01, UC-07, UC-08, UC-09, UC-10, UC-11, UC-15, UC-22, UC-23, UC-24, UC-26, UC-27, UC-29          |
| Admin                      | UC-01, UC-13, UC-14, UC-18, UC-19, UC-20, UC-21, UC-22, UC-29 (xem/xoá); hỗ trợ kỹ thuật trong UC-15 khi cần. **Không còn UC-12** (Admin không nhập dữ liệu nghiệp vụ). |
| Phòng Đào tạo              | UC-01, **UC-12 (chủ sở hữu duy nhất)**, UC-16, UC-17, UC-18, UC-22, UC-28, UC-29 (xem), **UC-30 (chủ sở hữu duy nhất)** |
| Hệ thống quản lý sinh viên | UC-I06                                                                                             |
| Dịch vụ Email/Thông báo    | UC-I03                                                                                             |

# 7. Đặc tả chi tiết Use Case

Mỗi Use Case được mô tả theo các mục: tên, mô tả, tác nhân, tiền điều kiện, hậu điều kiện, kích hoạt, luồng chính, luồng thay thế, ngoại lệ và UC liên quan.

## UC-01: Đăng nhập hệ thống

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Đăng nhập hệ thống</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Người dùng xác thực tài khoản để truy cập hệ thống đúng theo vai trò được phân quyền.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Sinh viên, Giảng viên, Admin, Phòng Đào tạo</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Người dùng đã được cấp tài khoản và tài khoản đang hoạt động.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Người dùng vào dashboard tương ứng với vai trò; phiên đăng nhập được tạo.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Người dùng nhập tên đăng nhập, mật khẩu và nhấn Đăng nhập.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Người dùng mở trang đăng nhập.<br />
2. Hệ thống hiển thị form đăng nhập.<br />
3. Người dùng nhập tên đăng nhập và mật khẩu.<br />
4. Hệ thống kiểm tra thông tin tài khoản và trạng thái tài khoản.<br />
5. Nếu hợp lệ, hệ thống chuyển người dùng đến dashboard theo vai trò.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Lần đăng nhập đầu tiên: hệ thống yêu cầu đổi mật khẩu mặc định trước khi vào dashboard.<br />
Người dùng quên mật khẩu: thực hiện quy trình đặt lại mật khẩu nếu được cấu hình.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Sai thông tin đăng nhập: hiển thị lỗi.<br />
Sai 5 lần liên tiếp: tài khoản bị khóa tạm thời và cần Admin mở khóa.<br />
Không hoạt động 30 phút: hệ thống tự đăng xuất.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01 Kiểm tra quyền truy cập</td>
</tr>
</tbody>
</table>

## UC-02: Quản lý thông tin cá nhân

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Quản lý thông tin cá nhân</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Sinh viên xem và cập nhật thông tin liên hệ, đổi mật khẩu và xem thông tin nhóm/đề tài của mình.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Sinh viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Sinh viên đã đăng nhập.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Thông tin liên hệ hoặc mật khẩu được cập nhật; lịch sử thay đổi được ghi nhận nếu cần.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên mở mục Thông tin cá nhân.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Sinh viên chọn mục Thông tin cá nhân.<br />
2. Hệ thống hiển thị họ tên, MSSV, lớp, khoa, email trường, thông tin lớp học phần, nhóm và đề tài nếu đã được phân.<br />
3. Sinh viên cập nhật email cá nhân, số điện thoại hoặc đổi mật khẩu.<br />
4. Hệ thống kiểm tra dữ liệu hợp lệ.<br />
5. Hệ thống lưu thay đổi và hiển thị thông báo thành công.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Sinh viên chỉ xem thông tin mà không cập nhật.<br />
Nếu đề tài làm theo nhóm, hệ thống hiển thị danh sách thành viên và người đại diện nộp nếu có.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Email hoặc số điện thoại sai định dạng: hệ thống hiển thị lỗi.<br />
Mật khẩu mới không đạt yêu cầu: hệ thống yêu cầu nhập lại.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01 Kiểm tra quyền truy cập</td>
</tr>
</tbody>
</table>

## UC-03: Nộp báo cáo

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Nộp báo cáo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Sinh viên hoặc người đại diện nhóm tải lên báo cáo chính và file đính kèm để nộp đề tài môn học lần đầu.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Sinh viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Sinh viên đã đăng nhập; đề tài đã được giao; trạng thái báo cáo là CHUA_NOP; còn hạn nộp; nếu làm theo nhóm thì người thao tác có quyền nộp cho nhóm.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>File được lưu, thời gian nộp được ghi nhận, trạng thái chuyển sang DA_NOP.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên nhấn Nộp báo cáo.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Sinh viên mở đề tài cần nộp.<br />
2. Hệ thống hiển thị hạn nộp, yêu cầu file và form upload.<br />
3. Sinh viên chọn báo cáo chính và upload file đính kèm nếu cần.<br />
4. Hệ thống kiểm tra định dạng, dung lượng, hạn nộp và quyền nộp.<br />
5. Sinh viên xác nhận nộp.<br />
6. Hệ thống lưu file, ghi lịch sử nộp và chuyển trạng thái sang DA_NOP.<br />
7. Hệ thống gửi thông báo xác nhận nộp thành công.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Nếu hệ thống hỗ trợ lưu nháp, file nháp chưa được tính là đã nộp cho đến khi sinh viên xác nhận.<br />
Với bài nhóm, hệ thống ghi nhận người nộp thay nhóm nhưng kết quả gắn với toàn nhóm.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>File sai định dạng, vượt dung lượng hoặc quá hạn nộp: hệ thống từ chối và hiển thị lý do.<br />
Người không có quyền nộp thay nhóm: hệ thống từ chối.<br />
Lỗi upload: sinh viên có thể thử lại.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I02 Kiểm tra file nộp/import; &lt;&lt;include&gt;&gt; UC-I03 Gửi thông báo tự động; &lt;&lt;include&gt;&gt; UC-I04 Ghi lịch sử thao tác/trạng thái</td>
</tr>
</tbody>
</table>

## UC-04: Nộp lại báo cáo

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Nộp lại báo cáo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Sinh viên nộp phiên bản báo cáo đã chỉnh sửa khi được giảng viên yêu cầu sửa hoặc khi yêu cầu nộp lại đã được duyệt.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Sinh viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Sinh viên đã đăng nhập; báo cáo thuộc quyền của sinh viên/nhóm; trạng thái là YEU_CAU_SUA hoặc yêu cầu nộp lại đã được giảng viên duyệt; còn thời hạn nộp lại/gia hạn.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Phiên bản mới được lưu; lịch sử nộp được cập nhật; trạng thái chuyển về DA_NOP.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên chọn Nộp lại báo cáo.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Sinh viên mở báo cáo được phép nộp lại.<br />
2. Hệ thống hiển thị lý do được nộp lại, yêu cầu sửa hoặc quyết định duyệt yêu cầu nộp lại.<br />
3. Sinh viên upload file đã chỉnh sửa.<br />
4. Hệ thống kiểm tra file và quyền nộp lại.<br />
5. Sinh viên xác nhận nộp lại.<br />
6. Hệ thống lưu phiên bản mới, ghi lịch sử và chuyển trạng thái sang DA_NOP.<br />
7. Hệ thống thông báo cho giảng viên phụ trách.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Sinh viên xem lại yêu cầu sửa hoặc phản hồi duyệt trước khi chọn file nộp lại.<br />
Nếu còn bản nộp cũ, hệ thống lưu phiên bản cũ để đối chiếu.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Trạng thái không cho phép nộp lại hoặc quá hạn bổ sung: hệ thống khóa chức năng.<br />
File không hợp lệ: hệ thống yêu cầu upload lại.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I02; &lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04; liên quan UC-25, UC-26</td>
</tr>
</tbody>
</table>

## UC-05: Theo dõi tiến độ

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Theo dõi tiến độ</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Sinh viên xem trạng thái hiện tại, lịch sử nộp, lịch sử chuyển trạng thái và thông báo liên quan đến báo cáo.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Sinh viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Sinh viên đã đăng nhập và có đề tài/báo cáo trong hệ thống.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Sinh viên nắm được trạng thái và các mốc xử lý của báo cáo.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên mở màn hình Theo dõi tiến độ.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Sinh viên chọn đề tài cần theo dõi.<br />
2. Hệ thống hiển thị trạng thái hiện tại.<br />
3. Hệ thống hiển thị lịch sử nộp bài, thời điểm nộp, người nộp và tên file.<br />
4. Hệ thống hiển thị lịch sử thay đổi trạng thái và người thực hiện.<br />
5. Sinh viên xem thông báo deadline, yêu cầu sửa hoặc phản hồi yêu cầu nộp lại nếu có.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Sinh viên lọc lịch sử theo loại: lịch sử nộp, lịch sử trạng thái, thông báo.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không có báo cáo hoặc không có quyền xem: hệ thống hiển thị thông báo phù hợp.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01 Kiểm tra quyền truy cập</td>
</tr>
</tbody>
</table>

## UC-06: Xem điểm và phản hồi

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Xem điểm và phản hồi</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Sinh viên xem điểm và nhận xét của giảng viên sau khi báo cáo được Phòng Đào tạo phê duyệt; xem nội dung cần chỉnh sửa khi báo cáo ở trạng thái YEU_CAU_SUA.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Sinh viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Sinh viên đã đăng nhập; báo cáo có nhận xét hoặc kết quả đã được phê duyệt.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Sinh viên xem được điểm, nhận xét hoặc nội dung cần chỉnh sửa.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên mở mục Kết quả hoặc Phản hồi.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Sinh viên chọn báo cáo cần xem.<br />
2. Hệ thống kiểm tra trạng thái báo cáo.<br />
3. Nếu trạng thái HOAN_THANH, hệ thống hiển thị điểm tổng, điểm từng tiêu chí và nhận xét.<br />
4. Nếu trạng thái YEU_CAU_SUA, hệ thống hiển thị nội dung cần chỉnh sửa.<br />
5. Sinh viên xem và thực hiện bước tiếp theo nếu cần.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Sinh viên tải bản nhận xét/bảng điểm nếu hệ thống hỗ trợ.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Kết quả chưa được phê duyệt: hệ thống chưa hiển thị điểm cuối cùng.<br />
Không có quyền xem: hệ thống từ chối truy cập.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; liên quan UC-16</td>
</tr>
</tbody>
</table>

## UC-07: Quản lý lớp học phần

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Quản lý lớp học phần</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên xem các lớp học phần mình phụ trách, danh sách sinh viên/nhóm, tiến độ nộp và trạng thái xử lý. Đây là trang quản lý lớp, không phải trang chấm điểm chi tiết.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập và được phân công phụ trách ít nhất một lớp học phần trong kỳ hiện tại.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Giảng viên xem được danh sách và trạng thái xử lý của từng sinh viên/nhóm.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên mở màn hình Quản lý lớp học phần.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Giảng viên chọn kỳ học và lớp học phần.<br />
2. Hệ thống hiển thị danh sách sinh viên/nhóm trong lớp.<br />
3. Giảng viên lọc theo trạng thái báo cáo hoặc tìm kiếm theo MSSV, tên sinh viên, tên nhóm, tên đề tài.<br />
4. Hệ thống cập nhật danh sách theo điều kiện lọc.<br />
5. Giảng viên chọn một sinh viên/nhóm để xem chi tiết, phân nhóm, giao đề tài hoặc chuyển sang chức năng liên quan.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Giảng viên xem danh sách sinh viên chưa nộp để nhắc nộp nếu chức năng thông báo đã được cấu hình.<br />
Giảng viên xuất danh sách lớp nếu có dữ liệu.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không có lớp được phân công: hệ thống hiển thị trạng thái rỗng và ẩn/khóa các chức năng phụ thuộc lớp.<br />
Không đủ quyền: hệ thống từ chối truy cập.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; liên quan UC-23, UC-24</td>
</tr>
</tbody>
</table>

## UC-08: Thiết lập phiếu chấm điểm

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Thiết lập phiếu chấm điểm</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên tạo hoặc chỉnh sửa phiếu chấm điểm/rubric cho lớp học phần, nhóm đề tài hoặc đề tài trước khi chấm.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; có lớp học phần phụ trách; phiếu chấm điểm chưa có điểm được nhập.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Phiếu chấm điểm được lưu và có thể dùng để chấm điểm.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên chọn Tạo hoặc Chỉnh sửa phiếu chấm điểm.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Giảng viên mở mục Phiếu chấm điểm.<br />
2. Hệ thống hiển thị danh sách tiêu chí hiện có hoặc form tạo mới.<br />
3. Giảng viên nhập tên tiêu chí, mô tả, thang điểm và trọng số.<br />
4. Hệ thống kiểm tra tổng trọng số/thang điểm.<br />
5. Giảng viên lưu phiếu chấm điểm.<br />
6. Hệ thống lưu phiếu chấm điểm theo phạm vi lớp học phần/đề tài.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Giảng viên sao chép phiếu chấm điểm từ lớp học phần hoặc đề tài khác rồi chỉnh sửa lại.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Phiếu chấm điểm đã có điểm được nhập: hệ thống không cho chỉnh sửa, trừ khi có quy trình mở lại hợp lệ.<br />
Tổng trọng số không hợp lệ: hệ thống yêu cầu điều chỉnh.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I05</td>
</tr>
</tbody>
</table>

## UC-09: Chấm điểm báo cáo

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Chấm điểm báo cáo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên xem báo cáo, nhập điểm theo từng tiêu chí, ghi nhận xét và xác nhận hoàn tất chấm điểm. Điểm nháp chỉ hiển thị cho giảng viên.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; báo cáo thuộc lớp học phần do giảng viên phụ trách; báo cáo ở trạng thái DA_NOP hoặc DANG_CHAM; phiếu chấm điểm đã được thiết lập.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Điểm và nhận xét được lưu; khi xác nhận chấm xong, trạng thái chuyển sang DA_CHAM/CHO_DUYET theo quy trình.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên chọn Chấm điểm báo cáo.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Giảng viên mở danh sách bài cần chấm.<br />
2. Hệ thống hiển thị các báo cáo ở trạng thái DA_NOP hoặc DANG_CHAM; bài chưa nộp không hiện mặc định trong hàng đợi chấm.<br />
3. Giảng viên mở báo cáo cần chấm và xem file trực tiếp hoặc tải về.<br />
4. Giảng viên nhập điểm từng tiêu chí và nhận xét.<br />
5. Hệ thống tính điểm tổng theo phiếu chấm điểm.<br />
6. Giảng viên lưu nháp hoặc xác nhận chấm xong.<br />
6.5. <strong>(Bài nhóm)</strong> Trước khi chuyển sang CHO_DUYET, giảng viên có thể điều chỉnh <strong>hệ số đóng góp</strong> (0–1.5, mặc định 1.0) cho từng thành viên trong nhóm. Hệ thống tính điểm cá nhân theo công thức ở UC-I05; bị khóa sau khi gửi duyệt. Áp dụng theo Quy tắc R11.<br />
7. Khi xác nhận chấm xong, hệ thống khóa chỉnh sửa tạm thời, chuyển trạng thái sang DA_CHAM/CHO_DUYET và thông báo cho Phòng Đào tạo.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Giảng viên lưu tạm điểm trong khi chưa xác nhận chấm xong.<br />
Bài đã chấm hoặc hoàn thành chỉ hiển thị ở chế độ xem lại/read-only, trừ khi được mở lại hợp lệ.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Thiếu phiếu chấm điểm: hệ thống yêu cầu thiết lập phiếu chấm điểm trước.<br />
Điểm vượt thang: hệ thống báo lỗi.<br />
Sau khi xác nhận, giảng viên không thể sửa trừ khi Phòng Đào tạo trả về hoặc duyệt yêu cầu mở lại chấm điểm.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I05; &lt;&lt;include&gt;&gt; UC-I04; &lt;&lt;include&gt;&gt; UC-I03; liên quan UC-27, UC-28</td>
</tr>
</tbody>
</table>

## UC-10: Gửi yêu cầu sửa báo cáo

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Gửi yêu cầu sửa báo cáo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên chủ động yêu cầu sinh viên/nhóm chỉnh sửa báo cáo trước khi chấm chính thức hoặc trước khi xác nhận chấm xong. Use Case này khác với việc sinh viên tự xin nộp lại.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; báo cáo thuộc lớp mình phụ trách; báo cáo đang ở trạng thái DA_NOP hoặc DANG_CHAM.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Yêu cầu sửa được lưu; trạng thái báo cáo chuyển sang YEU_CAU_SUA; sinh viên nhận thông báo.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên chọn Yêu cầu sửa.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Giảng viên mở báo cáo cần yêu cầu sửa.<br />
2. Giảng viên nhập nội dung yêu cầu chỉnh sửa cụ thể.<br />
3. Hệ thống yêu cầu xác nhận thao tác.<br />
4. Giảng viên xác nhận gửi yêu cầu.<br />
5. Hệ thống lưu ghi chú, chuyển trạng thái sang YEU_CAU_SUA và gửi thông báo cho sinh viên/nhóm.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Giảng viên hủy thao tác trước khi xác nhận.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Nội dung yêu cầu sửa để trống: hệ thống yêu cầu nhập.<br />
Báo cáo đã hoàn thành hoặc đã khóa: không cho gửi yêu cầu sửa.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04</td>
</tr>
</tbody>
</table>

## UC-11: Xuất báo cáo lớp

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Xuất báo cáo lớp</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên xuất bảng điểm hoặc thống kê lớp/môn học mình phụ trách ra Excel hoặc PDF.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; có lớp học phần được phân công; dữ liệu lớp đã tồn tại.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>File báo cáo được tạo để tải về.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên nhấn Xuất báo cáo.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Giảng viên chọn lớp, môn học và kỳ học.<br />
2. Hệ thống hiển thị dữ liệu tổng hợp.<br />
3. Giảng viên chọn định dạng Excel hoặc PDF.<br />
4. Hệ thống tạo file báo cáo.<br />
5. Giảng viên tải file về.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Giảng viên lọc theo trạng thái, đạt/không đạt hoặc khoảng điểm trước khi xuất.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không có dữ liệu phù hợp: hệ thống thông báo không thể xuất.<br />
Giảng viên chưa được phân công lớp: hệ thống ẩn/khóa chức năng xuất.<br />
Lỗi tạo file: hệ thống báo lỗi và cho thử lại.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01</td>
</tr>
</tbody>
</table>

## UC-12: Nhập dữ liệu nền hệ thống

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Nhập dữ liệu nền hệ thống</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Phòng Đào tạo nhập dữ liệu nền: học kỳ và giảng viên qua batch JSON; <strong>lớp học phần qua flow "1 file Excel = 1 lớp"</strong> — mỗi file chứa metadata lớp (mã lớp, mã môn, tên môn, học kỳ, mã GV phụ trách) cùng danh sách MSSV. Hệ thống tự tạo Class (với <code>assignmentType</code> mặc định <code>NHOM</code>) + Assignment + ClassEnrollment và auto-sinh tài khoản User+Student cho MSSV chưa có (mật khẩu mặc định 123456, bật <code>mustChangePassword</code>). Sau khi lớp đã tồn tại, PĐT có thể chỉnh <code>assignmentType</code> sang <code>CA_NHAN</code> nếu lớp dành cho đồ án cá nhân (qua <code>PATCH /academic/classes/:id/assignment-type</code>), miễn là lớp chưa có nhóm/đề tài nào. Không nhập nhóm, đề tài, rubric hoặc điểm. Admin không tham gia khâu này.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Phòng Đào tạo (chủ sở hữu duy nhất); Hệ thống quản lý sinh viên (tuỳ chọn, cho đồng bộ một chiều)</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Người dùng đã đăng nhập với vai trò <code>ACADEMIC_DEPT</code>; có file Excel <code>.xlsx</code> đúng template (sheet <em>Điểm Danh</em>; D2=tên kỳ, C4=tên môn, E4=mã môn, B6=mã lớp, D6=mã GV; row 7 header; row 8+ data MSSV/Họ lót/Tên); mã GV trong ô D6 phải khớp <code>Teacher.teacherCode</code> đã tồn tại.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Lớp mới + Assignment được tạo trong 1 transaction; <code>Class.assignmentType</code> = <code>NHOM</code> mặc định; SV chưa có được auto-sinh tài khoản; tất cả SV trong file được enroll vào lớp; audit log <code>IMPORT_LOP_EXCEL</code> được ghi.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>PĐT mở menu "Nhập lớp từ Excel" và upload 1 file <code>.xlsx</code>.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính (1 file = 1 lớp)</strong></td>
<td>1. PĐT chọn file <code>.xlsx</code> ở dropzone (giới hạn 5MB).<br />
2. PĐT nhấn "Xác nhận tạo lớp"; FE upload multipart tới <code>POST /academic/classes/import-excel</code>.<br />
3. BE parse metadata + danh sách SV bằng <code>exceljs</code>; validate các ô bắt buộc.<br />
4. BE kiểm tra: classCode chưa tồn tại; teacherCode tồn tại; học kỳ không bị khoá; MSSV không trùng trong file.<br />
5. BE find-or-create Subject (theo mã) và Term (theo tên, default 5 tháng nếu mới).<br />
6. Trong transaction: tạo Class → tạo Assignment GV→Class → với mỗi MSSV chưa có: tạo User (role STUDENT, mustChangePassword=true) + Student → tạo ClassEnrollment cho toàn bộ SV.<br />
7. BE trả về tóm tắt (mã lớp, GV, môn, kỳ, số SV, số tài khoản mới sinh, số enrollment); FE hiển thị panel kết quả.</td>
</tr>
<tr class="odd">
<td><strong>Luồng phụ — batch JSON</strong></td>
<td>Học kỳ và giảng viên vẫn dùng endpoint batch JSON <code>POST /academic/terms/batch</code>, <code>/academic/enrollments/batch</code> (đã siết quyền về <code>ACADEMIC_DEPT</code>). Endpoint <code>/academic/classes/batch</code> giữ lại cho trường hợp import nhiều lớp cùng lúc khi không cần danh sách SV; payload có thể kèm trường <code>assignmentType</code> (chấp nhận <code>CA_NHAN</code>/<code>NHOM</code>, default <code>NHOM</code>).</td>
</tr>
<tr class="even">
<td><strong>Luồng phụ — đổi loại phân công lớp</strong></td>
<td>Sau khi lớp đã tồn tại, PĐT mở UI Điều phối Phân công (`AcademicAssignment`), chọn dropdown "Loại phân công" ở hàng lớp tương ứng và đổi giá trị; FE gọi <code>PATCH /academic/classes/:id/assignment-type</code> body <code>{ value: 'CA_NHAN' | 'NHOM' }</code>. BE từ chối (400) nếu lớp đã có nhóm hoặc đề tài (<code>group.count(classId) > 0</code>). Audit log <code>UPDATE_LOAI_PHAN_CONG</code> được ghi với giá trị trước/sau.</td>
</tr>
<tr class="odd">
<td><strong>Ngoại lệ</strong></td>
<td>Thiếu bất kỳ ô metadata bắt buộc (D2, C4, E4, B6, D6): trả 400 với chỉ rõ ô thiếu.<br />
classCode đã tồn tại: trả 400 "1 file = 1 lớp mới".<br />
teacherCode không tồn tại: trả 400.<br />
Học kỳ đã <code>isLocked</code>: chặn không cho tạo lớp.<br />
File không phải <code>.xlsx</code> hoặc &gt;5MB: multer reject.<br />
MSSV trùng trong file: trả 400 kèm số dòng.</td>
</tr>
<tr class="even">
<td><strong>Phạm vi không bao gồm</strong></td>
<td>Không nhập nhóm/đề tài/rubric/điểm (thuộc UC-23, UC-24, UC-08, UC-09). Không cập nhật class đã tồn tại ngoài <code>assignmentType</code> (dùng UC-17 đổi GV, UI thủ công để sửa SV).</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I02 Kiểm tra file; &lt;&lt;include&gt;&gt; UC-I04 Ghi lịch sử; tiền điều kiện cho UC-07, UC-23, UC-24. Bổ trợ bởi <strong>UC-30</strong> (Nhập SV độc lập + gửi email tài khoản với mật khẩu ngẫu nhiên — dùng khi cần bootstrap tài khoản SV trước khi gán lớp, hoặc khi SV cần email thông báo thay vì mật khẩu mặc định <code>123456</code>).</td>
</tr>
</tbody>
</table>

## UC-13: Cấp phân quyền tài khoản

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Cấp phân quyền tài khoản</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Admin tạo tài khoản, gán vai trò, khóa/mở tài khoản, đặt lại mật khẩu hoặc vô hiệu hóa tài khoản.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Admin</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Admin đã đăng nhập và có quyền quản trị tài khoản.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Tài khoản được tạo/cập nhật trạng thái/quyền; thao tác được ghi log. Tài khoản mới tạo hoặc bị reset mật khẩu có cờ <code>BatBuocDoiMatKhau = true</code> để buộc đổi mật khẩu khi đăng nhập lần đầu.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Admin mở chức năng Quản lý tài khoản.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Admin chọn tạo thủ công hoặc nhập hàng loạt từ dữ liệu nền.<br />
2. Hệ thống hiển thị form hoặc mẫu import tài khoản.<br />
3. Admin nhập thông tin tài khoản và vai trò.<br />
4. Hệ thống kiểm tra trùng tên đăng nhập và ràng buộc vai trò.<br />
5. Admin xác nhận thao tác.<br />
6. Hệ thống tạo/cập nhật tài khoản, gán vai trò, đặt cờ <code>BatBuocDoiMatKhau = true</code> và ghi log.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Admin khóa/mở khóa, đặt lại mật khẩu hoặc vô hiệu hóa tài khoản hiện có. Khi đặt lại mật khẩu, hệ thống bật lại cờ <code>BatBuocDoiMatKhau = true</code>.<br />
<strong>Đăng nhập lần đầu (S5):</strong> Sau khi tài khoản mới hoặc tài khoản vừa reset mật khẩu đăng nhập thành công, hệ thống kiểm tra cờ <code>BatBuocDoiMatKhau</code>; nếu true, FE PrivateRoute chuyển hướng người dùng đến trang <code>/change-password</code> và chặn truy cập các trang khác cho đến khi mật khẩu mới được lưu (BE đồng thời clear cờ này sau khi đổi).</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Tên đăng nhập trùng hoặc thiếu vai trò: hệ thống báo lỗi.<br />
Admin không được xóa tài khoản nếu cần bảo toàn lịch sử.<br />
Người dùng cố truy cập trang khác khi <code>BatBuocDoiMatKhau = true</code>: bị redirect về <code>/change-password</code>.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04</td>
</tr>
</tbody>
</table>

## UC-14: Cấu hình hệ thống

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Cấu hình hệ thống</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Admin cấu hình các tham số vận hành như thang điểm, định dạng file, dung lượng, thông báo, kiểm tra đạo văn và số lần nộp lại.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Admin</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Admin đã đăng nhập và có quyền cấu hình hệ thống.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Cấu hình được lưu và áp dụng theo phạm vi/kỳ học phù hợp.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Admin mở mục Cấu hình hệ thống.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Admin chọn nhóm cấu hình cần thay đổi.<br />
2. Hệ thống hiển thị cấu hình hiện tại.<br />
3. Admin nhập giá trị mới.<br />
4. Hệ thống kiểm tra tính hợp lệ.<br />
5. Admin xác nhận lưu.<br />
6. Hệ thống cập nhật cấu hình và ghi log.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Admin bật/tắt kiểm tra đạo văn hoặc cấu hình nội dung thông báo.<br />
Admin cấu hình chính sách file, thời hạn, số lần nộp lại hoặc kích thước tối đa.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Giá trị cấu hình không hợp lệ: hệ thống từ chối lưu.<br />
Cấu hình ảnh hưởng điểm đã khóa: hệ thống chỉ cho áp dụng từ kỳ sau.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I04</td>
</tr>
</tbody>
</table>

## UC-15: Xử lý vi phạm báo cáo

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Xử lý vi phạm báo cáo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên hoặc Phòng Đào tạo xử lý báo cáo vi phạm nội dung học thuật; Admin chỉ hỗ trợ kỹ thuật hoặc vận hành nếu có lỗi hệ thống.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên, Phòng Đào tạo, Admin kỹ thuật</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Người xử lý đã đăng nhập; báo cáo có dấu hiệu vi phạm và chưa khóa cuối kỳ.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Báo cáo chuyển sang TU_CHOI hoặc được ghi nhận vi phạm; lý do và <code>LoaiViPham</code> được lưu; sinh viên nhận thông báo nếu có thay đổi trạng thái.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Người có thẩm quyền chọn Từ chối báo cáo hoặc ghi nhận vi phạm.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Người xử lý mở báo cáo cần kiểm tra.<br />
2. Hệ thống hiển thị thông tin báo cáo, lịch sử nộp và kết quả kiểm tra liên quan nếu có.<br />
3. Người xử lý chọn <code>LoaiViPham</code> từ danh sách (DAO_VAN / NOP_RAC / TRE_HAN / KHONG_DUNG_DE_TAI / CHO_KIEM_TRA / KHAC) và nhập lý do chi tiết.<br />
4. Hệ thống yêu cầu xác nhận.<br />
5. Người xử lý xác nhận.<br />
6. Hệ thống chuyển trạng thái sang TU_CHOI, lưu <code>LoaiViPham</code> + lý do vào cột riêng, ghi lịch sử và gửi thông báo.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Nếu còn thời hạn bổ sung và quy định cho phép, sinh viên có thể nộp lại sau khi báo cáo bị từ chối.<br />
Admin chỉ ghi nhận hoặc xử lý sự cố kỹ thuật, không tự quyết định nội dung điểm/vi phạm học thuật.<br />
<code>LoaiViPham = CHO_KIEM_TRA</code> được dùng cho trường hợp cảnh báo, hệ thống có thể không chuyển trạng thái sang TU_CHOI ngay mà chờ điều tra thêm.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không nhập lý do từ chối hoặc không chọn <code>LoaiViPham</code>: hệ thống không cho xác nhận.<br />
Báo cáo đã khóa cuối kỳ: không thể từ chối.</td>
</tr>
<tr class="odd">
<td><strong>Phân loại vi phạm (LoaiViPham)</strong></td>
<td>
<ul>
<li><code>DAO_VAN</code> — Đạo văn / sao chép.</li>
<li><code>NOP_RAC</code> — Nộp rác / không nghiêm túc.</li>
<li><code>TRE_HAN</code> — Trễ hạn vượt quy định.</li>
<li><code>KHONG_DUNG_DE_TAI</code> — Nội dung không đúng đề tài được giao.</li>
<li><code>CHO_KIEM_TRA</code> — Đang cảnh báo / chờ kiểm tra, chưa quyết định cuối cùng.</li>
<li><code>KHAC</code> — Vi phạm khác, ghi rõ trong lý do.</li>
</ul>
</td>
</tr>
<tr class="even">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04</td>
</tr>
</tbody>
</table>

## UC-16: Phê duyệt kết quả

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Phê duyệt kết quả</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Phòng Đào tạo kiểm tra và phê duyệt kết quả chấm điểm cuối cùng hoặc trả về cho giảng viên chấm lại.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Phòng Đào tạo</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Phòng Đào tạo đã đăng nhập; có báo cáo ở trạng thái CHO_DUYET.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Nếu duyệt, trạng thái chuyển sang HOAN_THANH và điểm được công bố; nếu trả về, trạng thái chuyển về DANG_CHAM kèm lý do.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Phòng Đào tạo mở danh sách kết quả chờ duyệt.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Phòng Đào tạo xem danh sách báo cáo chờ duyệt.<br />
2. Hệ thống hiển thị điểm chi tiết, điểm tổng và nhận xét.<br />
3. Phòng Đào tạo kiểm tra thông tin.<br />
4. Phòng Đào tạo chọn Phê duyệt.<br />
5. Hệ thống chuyển trạng thái sang HOAN_THANH, công bố điểm và gửi thông báo cho sinh viên/giảng viên.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Phòng Đào tạo chọn Trả về chấm lại, nhập lý do; hệ thống chuyển trạng thái về DANG_CHAM và thông báo cho giảng viên.<br />
<strong>Luồng thay thế A — Phê duyệt / Trả về theo lô:</strong> Phòng Đào tạo tích chọn nhiều báo cáo ở trạng thái CHO_DUYET (tối đa 100/lần), chọn Phê duyệt hàng loạt hoặc Trả về hàng loạt kèm lý do chung. Hệ thống xử lý từng bài trong giao dịch riêng (Grade.isApproved + submission.status đồng bộ), trả về kết quả per-item; bài lỗi không ảnh hưởng phần còn lại. Audit: <code>PHE_DUYET_DIEM_LO</code>.<br />
<strong>Luồng thay thế B — GV gửi duyệt cả lớp:</strong> Trước bước duyệt của PĐT, giảng viên phụ trách có thể chọn "Gửi duyệt cả lớp" → mọi báo cáo DA_CHAM của lớp chuyển sang CHO_DUYET trong 1 thao tác kèm 1 thông báo gộp đến PĐT. Audit: <code>GV_GUI_DUYET_CA_LOP</code>.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Thiếu điểm hoặc thiếu nhận xét bắt buộc: hệ thống không cho phê duyệt.<br />
Không có quyền phê duyệt: hệ thống từ chối truy cập.<br />
Lô có bài không ở CHO_DUYET / chưa có Grade / học kỳ đã khóa: BE bỏ qua bài đó, báo lỗi per-item, các bài còn lại vẫn xử lý.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04</td>
</tr>
</tbody>
</table>

## UC-17: Điều chỉnh giảng viên phụ trách

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Điều chỉnh giảng viên phụ trách</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Phòng Đào tạo điều chỉnh giảng viên phụ trách lớp học phần trong trường hợp đặc biệt như giảng viên nghỉ đột xuất hoặc thay đổi phân công.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Phòng Đào tạo</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Phòng Đào tạo đã đăng nhập; có dữ liệu lớp học phần/giảng viên trong hệ thống (lớp đã được tạo qua Batch Importer); kết quả chưa khóa cuối kỳ.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Phân công giảng viên phụ trách được cập nhật; lịch sử thay đổi được ghi nhận; giảng viên liên quan nhận thông báo.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Phòng Đào tạo chọn Điều chỉnh giảng viên phụ trách. Đây là <strong>cách duy nhất</strong> để đổi giảng viên chấm chính sau khi lớp đã được tạo qua batch import (bản 2.2 đã gỡ chức năng "Đề xuất phân công tự động").</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Phòng Đào tạo chọn học kỳ và lớp học phần cần điều chỉnh.<br />
2. Hệ thống hiển thị giảng viên phụ trách hiện tại.<br />
3. Phòng Đào tạo chọn giảng viên mới và nhập lý do bắt buộc.<br />
4. Hệ thống kiểm tra giảng viên mới tồn tại và phù hợp.<br />
5. Phòng Đào tạo xác nhận thay đổi.<br />
6. Hệ thống <strong>trong 1 giao dịch</strong>: ghi <code>AssignmentHistory</code> (oldTeacherId, newTeacherId, reason, changedById, classId, assignmentId cũ), xoá Assignment cũ, tạo Assignment mới. Gửi thông báo cho GV cũ + GV mới kèm số bài đang chấm dở. Audit <code>THAY_DOI_GV_PHU_TRACH</code>.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Nếu cần đổi giảng viên hàng loạt (ví dụ đầu kỳ phân lại nhiều lớp), Phòng Đào tạo có thể yêu cầu Admin chạy lại Batch Importer (POST <code>/classes/batch</code>) — hệ thống sẽ re-assign theo <code>teacherCode</code> mới trong file. Riêng nhu cầu lẻ tẻ vẫn dùng luồng chính ở trên.</td>
</tr>
<tr class="even">
<td><strong>Quy tắc xử lý điểm khi đổi GV (R12)</strong></td>
<td><strong>(a)</strong> Điểm nháp + DA_CHAM của GV cũ <strong>vẫn còn</strong>: <code>Grade.teacherId</code> giữ nguyên để truy nguyên ai đã chấm; GV mới có thể tiếp tục sửa/xác nhận chấm vì kiểm tra quyền dựa trên Assignment hiện tại (<code>verifyTeacherClassOwnership</code>), không dựa vào <code>Grade.teacherId</code>. UI hiển thị badge "Chấm nháp bởi GV cũ" để minh bạch.<br />
<strong>(b)</strong> Điểm đã CHO_DUYET / HOAN_THANH <strong>không tự đổi quyền</strong>: theo R4, mọi thao tác sửa điểm đã chấm xong phải đi qua UC-27 (yêu cầu mở lại chấm điểm), kể cả GV mới.<br />
<strong>(c)</strong> Bản ghi <code>AssignmentHistory</code> được tạo trước khi xoá Assignment cũ → lịch sử không bao giờ mất; FE có endpoint <code>GET /academic/classes/:classId/assignment-history</code> để liệt kê.</td>
</tr>
<tr class="odd">
<td><strong>Ngoại lệ</strong></td>
<td>Giảng viên mới không tồn tại hoặc trùng GV cũ: hệ thống báo lỗi.<br />
Lớp chưa có GV phụ trách (chưa từng được phân công): bắt buộc dùng "Phân công" (POST /academic/assignments) thay vì "Đổi GV".<br />
Báo cáo đã khóa cuối kỳ: không cho điều chỉnh.<br />
Lý do đổi rỗng hoặc dưới 5 ký tự: validator chặn.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I04; &lt;&lt;include&gt;&gt; UC-I03</td>
</tr>
</tbody>
</table>

## UC-18: Giám sát tiến độ

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Giám sát tiến độ</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Phòng Đào tạo hoặc Admin theo dõi tiến độ nộp, chấm và phê duyệt theo lớp, môn học, giảng viên và kỳ học. Phòng Đào tạo tập trung vào học thuật; Admin tập trung vào vận hành hệ thống.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Phòng Đào tạo, Admin</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Người dùng đã đăng nhập và có quyền xem thống kê.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Tiến độ được hiển thị để phục vụ quản lý và nhắc nhở.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Người dùng mở dashboard giám sát tiến độ.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Người dùng chọn kỳ học, lớp, môn học hoặc giảng viên.<br />
2. Hệ thống tổng hợp số lượng báo cáo theo trạng thái.<br />
3. Hệ thống hiển thị danh sách sinh viên chưa nộp, đang chấm, chờ duyệt, hoàn thành.<br />
4. Người dùng lọc hoặc xuất dữ liệu nếu cần.<br />
5. Hệ thống hiển thị kết quả theo bộ lọc.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Người dùng xem biểu đồ/thống kê phân bố điểm nếu có dữ liệu điểm.<br />
Admin xem thêm cảnh báo vận hành như lỗi import, lỗi gửi email hoặc lỗi upload nếu hệ thống có ghi nhận.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không có dữ liệu trong kỳ học đã chọn: hệ thống hiển thị dữ liệu rỗng.<br />
Không đủ quyền: hệ thống từ chối truy cập.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01</td>
</tr>
</tbody>
</table>

## UC-19: Khóa kết quả cuối kỳ

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Khóa kết quả cuối kỳ</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Admin khóa toàn bộ kết quả cuối kỳ sau khi Phòng Đào tạo xác nhận đã phê duyệt đầy đủ.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Admin; Phòng Đào tạo xác nhận điều kiện</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Admin đã đăng nhập; toàn bộ kết quả cần khóa đã được Phòng Đào tạo phê duyệt.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Điểm số được khóa, không ai có thể chỉnh sửa trực tiếp; file dữ liệu điểm cuối kỳ có thể được xuất.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Admin chọn Khóa kết quả cuối kỳ.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Admin chọn kỳ học và phạm vi cần khóa.<br />
2. Hệ thống kiểm tra trạng thái phê duyệt của toàn bộ kết quả.<br />
3. Hệ thống hiển thị cảnh báo trước khi khóa.<br />
4. Admin xác nhận khóa.<br />
5. Hệ thống khóa điểm, ghi log và cho phép xuất dữ liệu lưu trữ.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Admin hủy thao tác nếu phát hiện còn kết quả chưa được duyệt.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Còn báo cáo chưa HOAN_THANH: hệ thống không cho khóa.<br />
Admin không có xác nhận từ Phòng Đào tạo: không thực hiện khóa.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I04</td>
</tr>
</tbody>
</table>

## UC-20: Sao lưu phục hồi dữ liệu

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Sao lưu phục hồi dữ liệu</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Admin sao lưu dữ liệu định kỳ/thủ công và phục hồi dữ liệu khi xảy ra sự cố.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Admin</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Admin đã đăng nhập và có quyền vận hành dữ liệu.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Bản sao lưu được tạo hoặc dữ liệu được phục hồi từ bản sao lưu hợp lệ.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Admin chọn Sao lưu hoặc Phục hồi dữ liệu.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Admin mở mục Sao lưu/Phục hồi.<br />
2. Hệ thống hiển thị danh sách bản sao lưu hiện có.<br />
3. Admin chọn tạo bản sao lưu mới hoặc chọn bản sao lưu để phục hồi.<br />
4. Hệ thống yêu cầu xác nhận thao tác.<br />
5. Admin xác nhận.<br />
6. Hệ thống thực hiện sao lưu/phục hồi và ghi log.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Hệ thống tự động sao lưu định kỳ theo cấu hình mà không cần Admin khởi tạo thủ công.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Bản sao lưu lỗi hoặc không tương thích: hệ thống từ chối phục hồi.<br />
Thiếu dung lượng lưu trữ: hệ thống cảnh báo.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I04</td>
</tr>
</tbody>
</table>

## UC-21: Xem nhật ký hệ thống

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Xem nhật ký hệ thống</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Admin xem lịch sử đăng nhập/đăng xuất, thao tác quan trọng và hoạt động bất thường để hỗ trợ vận hành.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Admin</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Admin đã đăng nhập và có quyền xem log.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Admin tra cứu được log theo thời gian, người dùng, loại thao tác hoặc mức độ bất thường.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Admin mở mục Nhật ký hệ thống.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Admin mở màn hình Nhật ký hệ thống.<br />
2. Hệ thống hiển thị bộ lọc theo thời gian, người dùng và loại thao tác.<br />
3. Admin nhập điều kiện lọc.<br />
4. Hệ thống trả về danh sách log phù hợp.<br />
5. Admin xem chi tiết log hoặc xuất log nếu cần.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Admin lọc riêng các hoạt động bất thường để kiểm tra bảo mật.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không có log phù hợp: hệ thống hiển thị danh sách rỗng.<br />
Không đủ quyền: hệ thống từ chối truy cập.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01</td>
</tr>
</tbody>
</table>

## UC-22: Xem và quản lý thông báo

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Xem và quản lý thông báo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Người dùng xem thông báo mới qua biểu tượng chuông và xem toàn bộ lịch sử thông báo tại trang thông báo. Use Case này thay thế nhu cầu chat/bình luận tự do trong phạm vi chính.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Sinh viên, Giảng viên, Admin, Phòng Đào tạo</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Người dùng đã đăng nhập.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Người dùng xem được thông báo phù hợp với vai trò; thông báo có thể được đánh dấu đã đọc.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Người dùng bấm biểu tượng chuông hoặc mở trang Thông báo.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Hệ thống hiển thị số lượng thông báo chưa đọc trên biểu tượng chuông.<br />
2. Người dùng bấm chuông để xem một số thông báo mới nhất.<br />
3. Người dùng chọn Xem tất cả để mở trang thông báo đầy đủ.<br />
4. Hệ thống hiển thị danh sách thông báo theo thời gian, loại thông báo và trạng thái đã đọc/chưa đọc.<br />
5. Người dùng mở thông báo để xem chi tiết hoặc điều hướng đến chức năng liên quan.<br />
6. Hệ thống đánh dấu thông báo đã đọc nếu người dùng mở thông báo.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Người dùng lọc thông báo theo loại: deadline, yêu cầu sửa, yêu cầu nộp lại, chờ duyệt, kết quả, lỗi hệ thống.<br />
Người dùng đánh dấu tất cả là đã đọc.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không có thông báo: hệ thống hiển thị trạng thái rỗng.<br />
Thông báo trỏ đến dữ liệu người dùng không còn quyền truy cập: hệ thống chặn truy cập và hiển thị thông báo phù hợp.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I03</td>
</tr>
</tbody>
</table>

## UC-23: Quản lý / phân nhóm sinh viên

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Quản lý / phân nhóm sinh viên</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td><strong>Chỉ áp dụng cho lớp có <code>Class.assignmentType = NHOM</code>.</strong> Giảng viên phụ trách lớp học phần tạo và chỉnh sửa nhóm sinh viên trong lớp bằng 3 cách: <strong>(a) tạo thủ công</strong> từng nhóm trên UI, <strong>(b) auto-chia theo target size</strong>, hoặc <strong>(c) import Excel danh sách nhóm</strong> với phát hiện nhóm trưởng tự động qua chữ in đỏ. Mỗi nhóm có tối đa 1 nhóm trưởng (cờ <code>isLeader</code> trên <code>GroupMember</code>); ngoài ra có thể chọn người đại diện nộp để tránh nộp trùng (không nhất thiết là nhóm trưởng). Với lớp <code>CA_NHAN</code>, UI tự rẽ nhánh sang flow gán đề tài cá nhân (UC-24, nhánh cá nhân) — các endpoint phân nhóm trong UC này bị BE guard trả 400.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; có lớp học phần được phân công (xác thực qua <code>Assignment</code>); <strong><code>Class.assignmentType = NHOM</code></strong>; danh sách sinh viên trong lớp đã được PĐT nhập (UC-12) hoặc lấy từ flow "1 file = 1 lớp"; học kỳ chưa bị khóa.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Nhóm + thành viên được tạo/cập nhật; nhóm trưởng được đánh dấu (nếu có); sinh viên xem được thông tin nhóm; audit log <code>TAO_NHOM</code>/<code>IMPORT_NHOM_EXCEL</code>/<code>TU_DONG_CHIA_NHOM</code> được ghi.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên mở "Quản lý nhóm" → chọn lớp → chọn 1 trong 3 chế độ tạo.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính (a) — Tạo thủ công</strong></td>
<td>1. GV bấm "Tạo nhóm mới", nhập tên + đề tài, tick các SV chưa có nhóm.<br />
2. Hệ thống kiểm tra SV không thuộc nhóm khác trong lớp.<br />
3. GV lưu; hệ thống tạo Group + GroupMember (isLeader=false mặc định).</td>
</tr>
<tr class="odd">
<td><strong>Luồng chính (b) — Auto chia</strong></td>
<td>GV nhập kích cỡ nhóm; hệ thống chia SV chưa có nhóm thành nhóm tên "Nhóm N+1, N+2,…".</td>
</tr>
<tr class="even">
<td><strong>Luồng chính (c) — Import Excel</strong></td>
<td>1. GV bấm "Nhập từ Excel", chọn file <code>.xlsx</code> (template như file giảng viên phát: sheet "Điểm Danh", header row 7, cột B=MSSV, C=Họ lót, D=Tên, E=số nhóm, F=tên nhóm, G=đề tài).<br />
2. FE upload multipart tới <code>POST /teacher/class-sections/:id/groups/import-excel</code>.<br />
3. BE parse bằng <code>exceljs</code>: forward-fill cột nhóm/tên nhóm/đề tài, detect <strong>font đỏ ARGB <code>FFFF0000</code></strong> ở cột C hoặc D để xác định nhóm trưởng.<br />
4. BE validate: mỗi nhóm ≤ 1 leader, không trùng MSSV trong file, không trùng tên nhóm với DB, SV chưa thuộc nhóm khác trong lớp.<br />
5. BE auto-tạo User+Student+ClassEnrollment cho MSSV chưa có (giống UC-12).<br />
6. Trong transaction: tạo Group + GroupMember (kèm <code>isLeader</code>) cho từng nhóm.<br />
7. BE trả về tóm tắt (số nhóm, số SV, số leader, số SV mới tạo, bảng nhóm + leader); FE hiển thị KPI + bảng có badge "👑".</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>GV có thể chỉnh sửa nhóm sau khi tạo (đổi tên, đổi đề tài, thêm/gỡ thành viên) qua các endpoint <code>PATCH /teacher/groups/:id</code>, <code>POST/DELETE /teacher/groups/:id/members</code>.<br />
GV có thể đổi người đại diện nộp trước khi nhóm đã nộp báo cáo.<br />
Đề tài cá nhân: xem UC-24 nhánh cá nhân — không thực hiện qua UC này, vì lớp phải được PĐT chuyển sang <code>CA_NHAN</code> trước (UC-12 luồng phụ).</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ (import Excel)</strong></td>
<td>Một nhóm có ≥2 dòng chữ đỏ: BE trả 400 "có X nhóm trưởng, chỉ được 1".<br />
SV đã thuộc nhóm khác trong lớp: BE trả 400 kèm danh sách MSSV.<br />
Tên nhóm trùng với nhóm đã có trong lớp: BE trả 400 kèm danh sách tên.<br />
File không phải <code>.xlsx</code> hoặc &gt;5MB: multer reject.<br />
Sheet không có dòng SV hợp lệ: BE trả 400.</td>
</tr>
<tr class="odd">
<td><strong>Ngoại lệ chung</strong></td>
<td>Lớp đang ở <code>assignmentType = CA_NHAN</code>: <code>createGroup</code>/<code>autoGenerateGroups</code>/<code>importGroupsFromExcel</code> trả 400 "Lớp loại Cá nhân — vui lòng dùng chức năng gán đề tài cho từng SV".<br />
Sinh viên không thuộc lớp học phần và không bật auto-create: hệ thống không cho thêm vào nhóm.<br />
Nhóm đã có báo cáo đang chấm/đã hoàn thành: hệ thống hạn chế sửa thành viên để bảo toàn lịch sử.<br />
Trùng thành viên trong nhiều nhóm cùng lớp: hệ thống báo lỗi.</td>
</tr>
<tr class="even">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I02 (file Excel); &lt;&lt;include&gt;&gt; UC-I04; liên quan UC-07, UC-12 (dữ liệu nền), UC-24.</td>
</tr>
</tbody>
</table>

## UC-24: Quản lý / giao đề tài

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Quản lý / giao đề tài</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên phụ trách lớp học phần tạo đề tài và gán đề tài cho sinh viên/nhóm trong lớp. Luồng rẽ nhánh theo <code>Class.assignmentType</code>:<br />
• <strong>Nhánh `NHOM`</strong>: gán đề tài cho từng <code>Group</code> đã tạo ở UC-23 (PATCH <code>/teacher/groups/:id/topic</code>, hoặc đặt <code>topicName</code> lúc tạo nhóm/import Excel).<br />
• <strong>Nhánh `CA_NHAN`</strong>: gán đề tài trực tiếp cho từng SV (POST <code>/teacher/class-sections/:classId/individual-assignments</code>). BE tự tạo <code>Group</code> size=1 + <code>GroupMember.isLeader=true</code> trong 1 transaction để pipeline submission/grading/evaluation dùng chung schema mà không cần nhánh đặc biệt.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; có lớp học phần phụ trách (xác thực qua <code>Assignment</code>); học kỳ chưa khóa; <code>Class.assignmentType</code> đã được PĐT cấu hình (UC-12). Với nhánh <code>NHOM</code>: nhóm đã được tạo (UC-23). Với nhánh <code>CA_NHAN</code>: SV đã enroll lớp và chưa được gán đề tài cá nhân trước đó.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Đề tài được tạo/cập nhật và gán cho sinh viên/nhóm. Với nhánh <code>CA_NHAN</code>: 1 <code>Group</code> size=1 mới được tạo với SV làm <code>isLeader</code>. Sinh viên xem được đề tài được giao. Audit log <code>GIAO_DE_TAI</code> (nhóm) hoặc <code>GAN_DE_TAI_CA_NHAN</code> (cá nhân) được ghi.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên mở "Quản lý nhóm / Phân công đề tài" → chọn lớp; UI hiển thị badge loại phân công và rẽ nhánh layout tương ứng.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính — nhánh `NHOM`</strong></td>
<td>1. GV chọn nhóm cần gán đề tài (đã tồn tại từ UC-23).<br />
2. GV nhập tên đề tài, mô tả (tùy chọn).<br />
3. FE gọi <code>PATCH /teacher/groups/:id/topic</code>.<br />
4. BE verify GV phụ trách lớp + học kỳ active + class.assignmentType=NHOM; cập nhật <code>Group.topicName</code>.<br />
5. Audit log <code>GIAO_DE_TAI</code>; FE refresh danh sách nhóm.</td>
</tr>
<tr class="odd">
<td><strong>Luồng chính — nhánh `CA_NHAN`</strong></td>
<td>1. GV thấy bảng SV trong lớp; mỗi SV chưa có đề tài có nút "Gán đề tài".<br />
2. GV bấm "Gán đề tài" → modal nhập <code>topicName</code> (bắt buộc) + <code>description</code> (tùy chọn).<br />
3. FE gọi <code>POST /teacher/class-sections/:classId/individual-assignments</code> với <code>{studentId, topicName, description}</code>.<br />
4. BE verify GV phụ trách + học kỳ active + class.assignmentType=CA_NHAN + SV đã enroll + SV chưa thuộc nhóm nào trong lớp.<br />
5. Trong 1 transaction: tạo <code>Group { name: studentCode, topicName, classId }</code> + <code>GroupMember { studentId, isLeader: true }</code>.<br />
6. Audit log <code>GAN_DE_TAI_CA_NHAN</code>; FE refresh bảng SV để hiển thị đề tài vừa gán.</td>
</tr>
<tr class="even">
<td><strong>Luồng thay thế</strong></td>
<td>GV chỉnh sửa <code>topicName</code> sau khi gán (qua <code>PATCH /teacher/groups/:id/topic</code> hoặc <code>PATCH /teacher/groups/:id</code>) áp dụng cho cả 2 nhánh trước khi SV đã nộp báo cáo.<br />
Nhánh <code>CA_NHAN</code>: gỡ đề tài đã gán = xoá Group size=1 tương ứng (qua <code>DELETE /teacher/groups/:id</code>), miễn là SV chưa nộp báo cáo.</td>
</tr>
<tr class="odd">
<td><strong>Ngoại lệ</strong></td>
<td>Gọi endpoint cá nhân khi lớp đang <code>NHOM</code>, hoặc gọi endpoint nhóm khi lớp đang <code>CA_NHAN</code>: BE trả 400 với gợi ý dùng endpoint kia.<br />
Nhánh <code>CA_NHAN</code>: SV đã có đề tài cá nhân trong lớp ⇒ 400 "Sinh viên đã được gán đề tài".<br />
SV không enroll lớp ⇒ 400.<br />
Đề tài đã có báo cáo nộp: hệ thống hạn chế đổi đề tài hoặc yêu cầu xác nhận/lý do.<br />
Thiếu <code>topicName</code> hoặc <code>topicName</code> rỗng: trả 400.</td>
</tr>
<tr class="even">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04; tiền điều kiện UC-12 (cấu hình <code>assignmentType</code>); liên quan UC-23 (nhánh NHOM dùng nhóm đã tạo).</td>
</tr>
</tbody>
</table>

## UC-25: Gửi yêu cầu nộp lại báo cáo

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Gửi yêu cầu nộp lại báo cáo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Sinh viên đã nộp báo cáo nhưng muốn chỉnh sửa thì gửi yêu cầu nộp lại cho giảng viên phụ trách, thay vì tự ý nộp đè.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Sinh viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Sinh viên đã đăng nhập; báo cáo đã ở trạng thái DA_NOP, DANG_CHAM hoặc trạng thái cho phép xin nộp lại theo cấu hình; kết quả chưa khóa cuối kỳ.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Yêu cầu nộp lại được tạo ở trạng thái CHO_DUYET; giảng viên phụ trách nhận thông báo.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên chọn Gửi yêu cầu nộp lại.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Sinh viên mở báo cáo đã nộp.<br />
2. Sinh viên chọn Gửi yêu cầu nộp lại.<br />
3. Hệ thống hiển thị form nhập lý do và mô tả nội dung muốn sửa.<br />
4. Sinh viên nhập lý do và xác nhận gửi.<br />
5. Hệ thống kiểm tra điều kiện gửi yêu cầu.<br />
6. Hệ thống lưu yêu cầu ở trạng thái CHO_DUYET, ghi lịch sử và thông báo cho giảng viên.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Sinh viên hủy yêu cầu trước khi giảng viên xử lý nếu hệ thống cho phép.<br />
Nếu đang ở trạng thái YEU_CAU_SUA, sinh viên không cần gửi yêu cầu này mà nộp lại theo UC-04.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Lý do để trống: hệ thống yêu cầu nhập.<br />
Báo cáo đã hoàn thành/đã khóa hoặc quá hạn không cho xin nộp lại: hệ thống từ chối.<br />
Đang có yêu cầu nộp lại chưa xử lý: hệ thống không cho tạo yêu cầu trùng.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04; liên quan UC-04, UC-26</td>
</tr>
</tbody>
</table>

## UC-26: Duyệt yêu cầu nộp lại báo cáo

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Duyệt yêu cầu nộp lại báo cáo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên phụ trách xem, duyệt hoặc từ chối yêu cầu nộp lại của sinh viên. Nếu duyệt, hệ thống mở quyền nộp lại trong thời hạn được xác định.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; có yêu cầu nộp lại thuộc lớp học phần mình phụ trách ở trạng thái CHO_DUYET.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Yêu cầu được chuyển sang DA_DUYET hoặc TU_CHOI; nếu duyệt, sinh viên được mở quyền nộp lại.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên mở danh sách yêu cầu nộp lại.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Giảng viên xem danh sách yêu cầu nộp lại đang chờ xử lý.<br />
2. Giảng viên mở chi tiết yêu cầu, xem lý do và thông tin báo cáo hiện tại.<br />
3. Giảng viên chọn Duyệt hoặc Từ chối.<br />
4. Nếu duyệt, giảng viên có thể nhập hạn nộp lại hoặc số lần nộp lại được phép.<br />
5. Nếu từ chối, giảng viên nhập lý do từ chối.<br />
6. Hệ thống lưu quyết định, ghi lịch sử và thông báo cho sinh viên.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Giảng viên yêu cầu sinh viên bổ sung lý do trước khi quyết định nếu hệ thống hỗ trợ.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không nhập lý do khi từ chối: hệ thống yêu cầu nhập.<br />
Báo cáo đã khóa hoặc không còn thuộc lớp phụ trách: hệ thống không cho xử lý.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04; liên quan UC-04, UC-25</td>
</tr>
</tbody>
</table>

## UC-27: Gửi yêu cầu mở lại chấm điểm

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Gửi yêu cầu mở lại chấm điểm</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên đã xác nhận chấm xong nhưng phát hiện bấm nhầm hoặc cần sửa điểm/nhận xét thì gửi yêu cầu mở lại chấm điểm cho Phòng Đào tạo.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; báo cáo thuộc lớp mình phụ trách; báo cáo ở trạng thái DA_CHAM, CHO_DUYET hoặc HOAN_THANH nhưng chưa khóa cuối kỳ; giảng viên không còn quyền sửa trực tiếp.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Yêu cầu mở lại chấm điểm được tạo ở trạng thái CHO_DUYET; Phòng Đào tạo nhận thông báo.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên chọn Gửi yêu cầu mở lại chấm điểm.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Giảng viên mở báo cáo đã xác nhận chấm xong.<br />
2. Giảng viên chọn Gửi yêu cầu mở lại chấm điểm.<br />
3. Hệ thống hiển thị form nhập lý do và nội dung dự kiến cần sửa.<br />
4. Giảng viên nhập lý do và xác nhận gửi.<br />
5. Hệ thống kiểm tra điều kiện gửi yêu cầu.<br />
6. Hệ thống lưu yêu cầu ở trạng thái CHO_DUYET, ghi lịch sử và thông báo cho Phòng Đào tạo.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Giảng viên hủy yêu cầu trước khi Phòng Đào tạo xử lý nếu hệ thống cho phép.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Lý do để trống: hệ thống yêu cầu nhập.<br />
Kết quả đã khóa cuối kỳ: hệ thống không cho gửi yêu cầu.<br />
Đang có yêu cầu mở lại chưa xử lý: hệ thống không cho tạo yêu cầu trùng.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04; liên quan UC-09, UC-28</td>
</tr>
</tbody>
</table>

## UC-28: Duyệt yêu cầu mở lại chấm điểm

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Duyệt yêu cầu mở lại chấm điểm</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Phòng Đào tạo xem, duyệt hoặc từ chối yêu cầu mở lại chấm điểm của giảng viên. Nếu duyệt, hệ thống trả báo cáo về trạng thái DANG_CHAM và mở quyền sửa cho giảng viên.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Phòng Đào tạo</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Phòng Đào tạo đã đăng nhập; có yêu cầu mở lại chấm điểm ở trạng thái CHO_DUYET; kết quả chưa khóa cuối kỳ.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Yêu cầu được chuyển sang DA_DUYET hoặc TU_CHOI; nếu duyệt, báo cáo chuyển về DANG_CHAM và giảng viên được mở quyền chấm lại.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Phòng Đào tạo mở danh sách yêu cầu mở lại chấm điểm.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Phòng Đào tạo xem danh sách yêu cầu đang chờ xử lý.<br />
2. Phòng Đào tạo mở chi tiết yêu cầu, xem lý do, điểm hiện tại, nhận xét hiện tại và lịch sử xử lý.<br />
3. Phòng Đào tạo chọn Duyệt hoặc Từ chối.<br />
4. Nếu duyệt, hệ thống chuyển báo cáo về DANG_CHAM và mở quyền sửa cho giảng viên.<br />
5. Nếu từ chối, Phòng Đào tạo nhập lý do từ chối.<br />
6. Hệ thống lưu quyết định, ghi lịch sử và gửi thông báo cho giảng viên.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Phòng Đào tạo có thể yêu cầu giảng viên bổ sung lý do hoặc trao đổi ngoài hệ thống theo quy trình nội bộ trước khi xử lý.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không nhập lý do khi từ chối: hệ thống yêu cầu nhập.<br />
Kết quả đã khóa cuối kỳ: hệ thống không cho duyệt mở lại.<br />
Yêu cầu không thuộc phạm vi quyền của người xử lý: hệ thống từ chối truy cập.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04; liên quan UC-09, UC-16, UC-27</td>
</tr>
</tbody>
</table>

## UC-29: Ghi chú nội bộ giảng viên

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Ghi chú nội bộ giảng viên</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Giảng viên (và Phòng Đào tạo, Admin với quyền xem) thêm, xem, xoá các ghi chú nội bộ trên một bài báo cáo để hỗ trợ quy trình chấm: ghi nhận quan sát, lưu trữ trao đổi với đồng nghiệp, nhắc nhở bản thân khi cần chấm lại. Sinh viên không truy cập được nội dung này.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên (tạo/xem/xoá note của mình), Phòng Đào tạo (xem), Admin (xem/xoá bất kỳ note nào)</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Người dùng đã đăng nhập, có vai trò TEACHER/ACADEMIC_DEPT/ADMIN; bài báo cáo tồn tại; nếu là Giảng viên thì phải được phân công phụ trách lớp học phần chứa bài báo cáo (verifySubmissionOwnership).</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Ghi chú nội bộ được lưu/ẩn (soft-delete bằng cờ <code>isHidden</code>); SystemLog ghi nhận hành động <code>TAO_GHI_CHU_NOI_BO</code> hoặc <code>XOA_GHI_CHU_NOI_BO</code>; sinh viên không thấy ghi chú trong bất kỳ giao diện nào.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên mở phòng chấm điểm (GradingWorkshop) cho một báo cáo và mở rộng panel "Ghi chú nội bộ giảng viên".</td>
</tr>
<tr class="even">
<td><strong>Luồng chính (tạo)</strong></td>
<td>1. Giảng viên mở panel "Ghi chú nội bộ giảng viên" trong phòng chấm.<br />
2. Hệ thống tải danh sách ghi chú hiện có cho bài báo cáo (GET /internal-notes/submission/:id) qua FE component và hiển thị theo thứ tự tạo.<br />
3. Giảng viên nhập nội dung ghi chú và nhấn nút gửi.<br />
4. Hệ thống xác thực vai trò TEACHER và verifySubmissionOwnership (phụ trách lớp).<br />
5. Hệ thống lưu ghi chú vào bảng <code>BinhLuan</code> với <code>NguoiGuiID</code> = userId, <code>IsAn = false</code>.<br />
6. Hệ thống ghi audit <code>TAO_GHI_CHU_NOI_BO</code> vào SystemLog.<br />
7. Hệ thống trả về ghi chú vừa tạo; FE refresh danh sách.</td>
</tr>
<tr class="odd">
<td><strong>Luồng phụ (xem)</strong></td>
<td>Giảng viên phụ trách, PĐT hoặc Admin gọi GET <code>/internal-notes/submission/:id</code>. Hệ thống kiểm tra quyền (authorize TEACHER/ACADEMIC_DEPT/ADMIN) và ownership với GV, trả về danh sách ghi chú chưa bị ẩn cùng thông tin người tạo (họ tên, vai trò) và thời gian.</td>
</tr>
<tr class="even">
<td><strong>Luồng phụ (xoá)</strong></td>
<td>Người dùng nhấn nút xoá trên một ghi chú. Hệ thống xác thực vai trò TEACHER/ADMIN. Nếu là TEACHER, kiểm tra <code>note.userId === userId</code>. Nếu là ADMIN, được override. Hệ thống soft-delete (<code>IsAn = true</code>) và ghi audit <code>XOA_GHI_CHU_NOI_BO</code>.</td>
</tr>
<tr class="odd">
<td><strong>Ngoại lệ</strong></td>
<td>Sinh viên gọi bất kỳ endpoint <code>/internal-notes/*</code>: bị authorize chặn (403).<br />
Giảng viên không phụ trách lớp chứa báo cáo: bị verifySubmissionOwnership chặn (403).<br />
Nội dung ghi chú rỗng hoặc &lt; 2 ký tự: FE chặn submit; nếu vẫn gọi BE, BE validate qua <code>createCommentSchema</code> và từ chối.<br />
Giảng viên cố xoá ghi chú của Giảng viên khác (mà không phải Admin): bị 403.</td>
</tr>
<tr class="even">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01 Kiểm tra quyền truy cập; &lt;&lt;include&gt;&gt; UC-I04 Ghi lịch sử thao tác; liên quan UC-09 (Chấm điểm báo cáo).</td>
</tr>
<tr class="odd">
<td><strong>Ghi chú thiết kế</strong></td>
<td>Module hiện thực dưới tên model <code>Comment</code> trong Prisma (bảng <code>BinhLuan</code>) để tránh migration. Route mount tại <code>/api/v1/internal-notes</code>. Phía FE chỉ <code>teacherService</code> có helper <code>addInternalNote / getInternalNotes / deleteInternalNote</code>; <code>studentService</code> không có và không bao giờ được thêm để bảo vệ R7.</td>
</tr>
</tbody>
</table>

## UC-30: Nhập danh sách Sinh viên & Gửi tài khoản qua Email

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Tên Use Case</strong></th>
<th>Nhập danh sách Sinh viên & Gửi tài khoản qua Email</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Mô tả</strong></td>
<td>Phòng Đào tạo upload 1 file Excel danh sách sinh viên (MSSV, Họ tên, Email). Hệ thống tự tạo tài khoản User + Student với <strong>mật khẩu ngẫu nhiên 10 ký tự</strong> (loại bỏ ký tự dễ nhầm: 0/O/1/l/I), bật cờ <code>mustChangePassword=true</code>, sau đó <strong>gửi email</strong> cho từng SV mới tạo kèm MSSV và mật khẩu tạm thời. Khác với UC-12, UC-30 không gắn SV vào lớp và không dùng mật khẩu mặc định <code>123456</code>; mục đích là bootstrap tài khoản SV độc lập với việc tạo lớp học phần và đảm bảo SV nhận credentials qua kênh email cá nhân.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Phòng Đào tạo (chủ sở hữu duy nhất); Dịch vụ Email (Resend) — qua UC-I03</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Người dùng đã đăng nhập với vai trò <code>ACADEMIC_DEPT</code>; có file Excel <code>.xlsx</code> đúng template (sheet đầu tiên hoặc tên <em>"Sinh Vien"</em>/<em>"DanhSachSV"</em>; Row 1 header; Row 2+ data với Cột A=MSSV, Cột B=Họ tên, Cột C=Email).</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Mỗi MSSV mới: User + Student được tạo trong DB; password bcrypt-hashed, <code>mustChangePassword=true</code>; email tài khoản được gửi best-effort (có ghi <code>EmailLog</code> với <code>dedupeKey=student-account-&lt;MSSV&gt;</code> chống gửi trùng); audit log <code>IMPORT_SV_BATCH</code> được ghi vào SystemLog kèm thống kê (tổng dòng / mới / bỏ qua / lỗi / mail đã gửi). Mật khẩu plaintext chỉ tồn tại trong RAM khi gửi mail, không bao giờ log/persist.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>PĐT mở menu "Nhập SV & Gửi tài khoản" (route <code>/academic/student-import</code>) và upload 1 file <code>.xlsx</code>.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. PĐT chọn file <code>.xlsx</code> ở dropzone (giới hạn 5MB, &le; 1000 SV / lần).<br />
2. PĐT nhấn "Xác nhận & Gửi mail"; FE upload multipart tới <code>POST /api/v1/academic/students/bulk-import</code>.<br />
3. BE parse Excel bằng <code>exceljs</code>; validate format từng dòng (MSSV không rỗng, Họ tên không rỗng, Email đúng regex <code>^[^\s@]+@[^\s@]+\.[^\s@]+$</code>); throw 400 nếu sai.<br />
4. BE check duplicates trong file (MSSV trùng → throw 400 kèm số dòng).<br />
5. BE pre-load các MSSV/email đã tồn tại trong DB để phân loại <strong>SKIPPED</strong>.<br />
6. Với mỗi MSSV mới: sinh password bằng <code>crypto.randomBytes</code> → bcrypt hash → tạo User (role STUDENT, mustChangePassword=true) + Student trong cùng câu <code>prisma.user.create({ student: { create } })</code>. Lưu plaintext password tạm vào mảng <code>toEmail</code> để gửi mail sau.<br />
7. Sau khi đã tạo xong toàn bộ, BE lần lượt gọi <code>emailService.sendEmail()</code> với HTML template chứa <em>Họ tên / MSSV / Mật khẩu tạm thời</em> và lưu ý "bắt buộc đổi mật khẩu lần đầu". <code>dedupeKey</code> đảm bảo không gửi trùng nếu import lại cùng MSSV.<br />
8. BE trả về JSON: <code>{ totalRows, createdCount, skippedCount, failedCount, emailSentCount, results[] }</code>.<br />
9. FE hiển thị 5 thống kê + bảng kết quả có filter theo trạng thái (CREATED/SKIPPED/FAILED) kèm cột Ghi chú lý do.</td>
</tr>
<tr class="odd">
<td><strong>Luồng phụ — MSSV đã tồn tại</strong></td>
<td>Hệ thống <strong>skip</strong> hoàn toàn: không reset password, không gửi mail, không thay đổi dữ liệu cũ. Trả về dòng tương ứng với <code>status=SKIPPED, reason="MSSV đã tồn tại"</code> hoặc <code>"Email đã được dùng"</code>. Quyết định thiết kế này nhằm bảo vệ SV đang dùng tài khoản — tránh vô tình reset password của hàng trăm SV.</td>
</tr>
<tr class="even">
<td><strong>Luồng phụ — gửi mail thất bại</strong></td>
<td>Nếu Resend trả về lỗi, <code>emailService</code> ghi <code>EmailLog.status=FAILED</code> và trả về <code>null</code> (không throw). User vẫn được tạo thành công nhưng <code>emailSentCount</code> sẽ thấp hơn <code>createdCount</code>. PĐT cần dùng UC-13 để admin reset thủ công cho các SV bị mất mail.</td>
</tr>
<tr class="odd">
<td><strong>Ngoại lệ</strong></td>
<td>File không phải <code>.xlsx</code> hoặc &gt; 5MB: multer reject.<br />
Sheet rỗng hoặc không có dòng data: trả 400 "Không có sinh viên nào trong file".<br />
Quá 1000 SV / file: trả 400 (chống DoS).<br />
Thiếu Họ tên (cột B) hoặc Email (cột C): trả 400 kèm số dòng.<br />
Email sai định dạng: trả 400 kèm số dòng.<br />
MSSV trùng trong cùng file: trả 400 kèm số dòng đầu tiên trùng.<br />
Lỗi DB khi tạo User (vd unique constraint chưa được pre-check kịp): dòng đó status=FAILED kèm lý do, không chặn các dòng còn lại.</td>
</tr>
<tr class="even">
<td><strong>Phạm vi không bao gồm</strong></td>
<td>Không gán SV vào lớp học phần (dùng UC-12 hoặc UI thủ công sau đó). Không cập nhật thông tin SV đã tồn tại. Không hỗ trợ nhập tay từng SV (luôn qua Excel). Không gán Faculty/Khoa (cột tùy chọn không có trong template hiện tại).</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01 Kiểm tra quyền (authorize <code>ACADEMIC_DEPT</code>); &lt;&lt;include&gt;&gt; UC-I02 Kiểm tra file (định dạng/dung lượng/cấu trúc); &lt;&lt;include&gt;&gt; UC-I03 Gửi thông báo tự động (email tài khoản); &lt;&lt;include&gt;&gt; UC-I04 Ghi lịch sử (audit code <code>IMPORT_SV_BATCH</code>). Bổ trợ UC-12 (nhập lớp): có thể chạy UC-30 trước để bootstrap tài khoản, sau đó dùng UC-12 chỉ enroll vào lớp. Bổ trợ UC-13: khi mail gửi fail, Admin dùng UC-13 reset password thủ công.</td>
</tr>
<tr class="even">
<td><strong>Ghi chú thiết kế</strong></td>
<td>Endpoint: <code>POST /api/v1/academic/students/bulk-import</code> (authenticate + authorize ACADEMIC_DEPT + multer 5MB). Service: <code>academicService.bulkImportStudents(buffer)</code> trong <code>src/services/academic.service.ts</code>. Helper: <code>generateRandomPassword(length)</code> dùng <code>crypto.randomBytes</code> với charset 56 ký tự (loại bỏ <code>0OoIl1</code>). Template email: <code>renderCredentialEmail({ fullName, mssv, password })</code> — HTML inline-style, không link/CTA động để tránh phishing-look. <strong>Quan trọng:</strong> <code>emailService</code> hiện đang override toàn bộ recipient về <code>huukongu@gmail.com</code> cho dev (xem <code>email.service.ts</code> dòng 46); production phải bỏ override này. FE: <code>src/pages/academic/AcademicStudentImport.tsx</code> dùng <code>react-dropzone</code>, hiển thị 5 metric cards và bảng kết quả filter được theo CREATED/SKIPPED/FAILED.</td>
</tr>
</tbody>
</table>

# 8. Đặc tả Use Case phụ dạng \<\<include\>\>

| **Mã UC phụ** | **Tên**                         | **Mô tả**                                                                                                                                                                                                                                                                                                                |
|---------------|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| UC-I01        | Kiểm tra quyền truy cập         | Hệ thống xác định người dùng đã đăng nhập, vai trò hợp lệ và dữ liệu thuộc phạm vi được phép xem/thao tác. Nếu không hợp lệ, thao tác bị chặn và ghi log nếu cần.                                                                                                                                                        |
| UC-I02        | Kiểm tra file nộp/import        | Hệ thống kiểm tra định dạng, dung lượng, cấu trúc cột, dữ liệu bắt buộc, dữ liệu trùng lặp, hạn nộp và quyền nộp/import.                                                                                                                                                                                                 |
| UC-I03        | Gửi thông báo tự động           | Hệ thống gửi thông báo in-app/email theo vai trò. Sinh viên nhận thông báo về deadline, yêu cầu sửa, yêu cầu nộp lại và kết quả; giảng viên nhận thông báo về bài nộp, yêu cầu nộp lại, PDT trả về/mở lại; Phòng Đào tạo nhận thông báo về kết quả chờ duyệt và yêu cầu mở lại; Admin nhận cảnh báo kỹ thuật/import/log. |
| UC-I04        | Ghi lịch sử thao tác/trạng thái | Hệ thống ghi người thực hiện, thời điểm, trạng thái cũ, trạng thái mới, lý do, dữ liệu liên quan và IP/thiết bị nếu cần. Các action codes hiện được ghi vào SystemLog gồm: <code>DANG_NHAP</code>, <code>DOI_MAT_KHAU</code>, <code>DAT_LAI_MAT_KHAU</code>, <code>TAO_TAI_KHOAN</code>, <code>IMPORT_TAI_KHOAN_BATCH</code>, <code>CAP_NHAT_VAI_TRO</code>, <code>RESET_MAT_KHAU_ADMIN</code>, <code>CHAM_DIEM_NHAP</code>, <code>CHAM_DIEM_CHINH_THUC</code>, <code>CAP_NHAT_TRANG_THAI_BAI</code>, <code>TAO_YEU_CAU_NOP_LAI</code>, <code>DUYET_YEU_CAU_NOP_LAI</code>, <code>TU_CHOI_YEU_CAU_NOP_LAI</code>, <code>TAO_YEU_CAU_MO_LAI_CHAM</code>, <code>DUYET_YEU_CAU_MO_LAI_CHAM</code>, <code>TU_CHOI_YEU_CAU_MO_LAI_CHAM</code>, <code>TAO_NHOM</code>, <code>CAP_NHAT_NHOM</code>, <code>XOA_NHOM</code>, <code>THEM_THANH_VIEN_NHOM</code>, <code>GO_THANH_VIEN_NHOM</code>, <code>GIAO_DE_TAI</code>, <code>TU_DONG_CHIA_NHOM</code>, <code>IMPORT_NHOM_BATCH</code>, <code>TAO_HOC_KY</code>, <code>CAP_NHAT_HOC_KY</code>, <code>TAO_MON_HOC</code>, <code>TAO_LOP_HOC_PHAN</code>, <code>PHAN_CONG_GV</code>, <code>HUY_PHAN_CONG_GV</code>, <code>IMPORT_HOC_KY_BATCH</code>, <code>IMPORT_LOP_HOC_PHAN_BATCH</code>, <code>IMPORT_DANG_KY_LOP_BATCH</code>, <code>IMPORT_SV_BATCH</code>, <code>TAO_RUBRIC</code>, <code>XOA_RUBRIC</code>, <code>TAO_GHI_CHU_NOI_BO</code>, <code>XOA_GHI_CHU_NOI_BO</code>, plus các action lock/backup/restore ở cấp hệ thống. |
| UC-I05        | Tính điểm tổng                  | Hệ thống tính điểm tổng theo tiêu chí, trọng số, thang điểm và quy tắc làm tròn đã cấu hình. <strong>Bài nhóm</strong>: điểm cá nhân của mỗi thành viên = <code>điểm tổng × hệ số đóng góp</code> (mặc định 1.0; GV được điều chỉnh trong khoảng [0, 1.5]; clamp kết quả về [0, 10] và làm tròn 2 chữ số). Áp dụng theo Quy tắc R11. |
| UC-I06        | Đồng bộ dữ liệu nền             | Hệ thống đồng bộ sinh viên, giảng viên, học kỳ, lớp học phần và đăng ký lớp học phần từ hệ thống ngoài nếu có tích hợp.                                                                                                                                                                                                  |

# 9. Quy tắc thông báo theo vai trò

| **Vai trò**   | **Loại thông báo nên nhận**                                                                                                                                                        |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sinh viên     | **Email khởi tạo tài khoản (MSSV + mật khẩu tạm thời) khi PĐT chạy UC-30**; được giao đề tài/nhóm; deadline sắp tới; nộp thành công; giảng viên yêu cầu sửa; yêu cầu nộp lại được duyệt/từ chối; điểm được phê duyệt; báo cáo bị từ chối. |
| Giảng viên    | Sinh viên/nhóm nộp bài; sinh viên gửi yêu cầu nộp lại; báo cáo được Phòng Đào tạo trả về; yêu cầu mở lại chấm điểm được duyệt/từ chối; deadline lớp sắp tới nếu cần nhắc nộp.      |
| Phòng Đào tạo | Có kết quả chờ duyệt; có yêu cầu mở lại chấm điểm; tiến độ toàn khoa có rủi ro lớn. Không nhận mọi sự kiện nhỏ của lớp nếu giảng viên có thể xử lý.                                |
| Admin         | Lỗi import; lỗi gửi email; lỗi upload; cảnh báo bảo mật; backup thất bại; tài khoản bị khóa do đăng nhập sai nhiều lần. Admin không nhận thông báo nghiệp vụ lớp học thông thường. |

# 10. Cấu trúc dữ liệu nhập hàng loạt đề xuất

Batch Importer chỉ phục vụ dữ liệu nền. Không nhập nhóm, đề tài, rubric hoặc điểm trong phạm vi chính. Các trường dưới đây là đề xuất tối thiểu để phù hợp thực tế triển khai.

**Quy ước nhập liệu lớp học phần (bản 2.2):** Việc khởi tạo lớp học phần **chỉ thực hiện qua endpoint batch** `POST /api/v1/academic/classes/batch` — không còn route tạo lớp đơn lẻ. Mỗi dòng trong batch bắt buộc có `teacherCode` để hệ thống tự gắn giảng viên phụ trách ngay khi tạo lớp; nếu thiếu `teacherCode` hoặc mã không tồn tại trong bảng `GiangVien`, bản ghi tương ứng bị từ chối và đưa vào danh sách lỗi của batch result. Hệ quả: sau khi import xong, mọi lớp đều đã có giảng viên phụ trách, không còn trường hợp "lớp trống giảng viên" cần đề xuất phân công tự động.

**Phân tách giữa batch và thao tác thủ công sau đó:**

- Tạo lớp học phần mới → **Batch import** (POST `/classes/batch`).
- Đăng ký sinh viên vào lớp lần đầu → **Batch import** (POST `/enrollments/batch`).
- Thêm/xóa lẻ tẻ một vài sinh viên trong lớp đã có → **Thao tác thủ công** trên UI (không dùng batch).
- Đổi giảng viên phụ trách lớp (giảng viên nghỉ, hoán đổi giữa kỳ…) → **Thủ công** qua UC-17 với lý do bắt buộc và ghi nhật ký phân công.

| **Loại dữ liệu**     | **Trường thông tin tối thiểu**                                                                            | **Validation chính**                                                                                                                  |
|----------------------|-----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Sinh viên            | MSSV, Họ tên, Ngày sinh, Email trường, Lớp hành chính, Khoa, Trạng thái                                   | MSSV không trùng; email đúng định dạng; ngày sinh dùng để tạo mật khẩu mặc định nếu áp dụng.                                          |
| Giảng viên           | Mã giảng viên, Họ tên, Ngày sinh, Email, Khoa/Bộ môn, Trạng thái                                          | Mã giảng viên không trùng; email đúng định dạng.                                                                                      |
| Học kỳ               | Mã học kỳ, Tên học kỳ, Năm học, Ngày bắt đầu, Ngày kết thúc, Trạng thái                                   | Ngày bắt đầu nhỏ hơn ngày kết thúc; chỉ một học kỳ đang hoạt động nếu quy định như vậy.                                               |
| Lớp học phần         | Mã lớp học phần, Mã môn học, Tên môn học, Mã học kỳ, Mã giảng viên phụ trách, Hạn nộp báo cáo, Trạng thái | Mã học kỳ và mã giảng viên phải tồn tại; giảng viên phụ trách là trường quan trọng để xác định quyền phân nhóm/giao đề tài/chấm điểm. |
| Đăng ký lớp học phần | Mã lớp học phần, MSSV                                                                                     | Mã lớp và MSSV phải tồn tại; không trùng một sinh viên trong cùng lớp học phần.                                                       |

# 11. Yêu cầu phi chức năng (Non-Functional Requirements)

## 11.1. Bảo mật & chống lạm dụng

| **Mã NFR** | **Yêu cầu**                                                                                                                                                                                                                       |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NFR-S01    | **Bắt buộc đổi mật khẩu khi đăng nhập lần đầu** — tài khoản mới tạo và tài khoản vừa bị Admin reset mật khẩu phải đổi mật khẩu trước khi truy cập bất kỳ chức năng nghiệp vụ nào (xem UC-13).                                       |
| NFR-S02    | **Rate-limit upload báo cáo** — endpoint `POST /api/v1/submissions/upload` giới hạn 10 lần / 5 phút / người dùng (key theo userId, fallback IP). Vượt giới hạn: HTTP 429 với thông báo tiếng Việt.                                  |
| NFR-S03    | **Rate-limit nộp/nộp lại báo cáo** — endpoint `POST /api/v1/submissions/submit` giới hạn 20 lần / 5 phút / sinh viên để chặn spam gây xung đột OCC liên tục.                                                                        |
| NFR-S04    | **Whitelist file upload** — chỉ chấp nhận MIME `application/pdf`, `image/png`, `image/jpeg`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` và đồng thời extension `.pdf .png .jpg .jpeg .doc .docx`. Dung lượng tối đa 20MB. |
| NFR-S05    | **Chỉ Sinh viên/Giảng viên được upload file** — Admin/PĐT không được dùng endpoint upload Cloudinary để tránh lạm dụng quota.                                                                                                       |
| NFR-S06    | **Quyền truy cập theo phạm vi (ownership)** — mọi truy cập đến chi tiết báo cáo, điểm, ghi chú nội bộ đều phải qua middleware `verifySubmissionOwnership` (Sinh viên chỉ thấy bài của mình/nhóm mình; Giảng viên chỉ thấy bài thuộc lớp mình phụ trách). |
| NFR-S07    | **Ẩn điểm nháp khỏi sinh viên** — sinh viên chỉ được xem điểm khi báo cáo ở trạng thái `HOAN_THANH`. Trạng thái `DA_CHAM`/`CHO_DUYET` không return điểm cho vai trò STUDENT.                                                        |
| NFR-S08    | **Không lưu mật khẩu ở plain text** — mọi mật khẩu lưu bằng bcrypt. Audit log không bao giờ chứa nội dung mật khẩu.                                                                                                                 |
| NFR-S09    | **CORS whitelist** — chỉ chấp nhận origin trong biến môi trường `ALLOWED_ORIGINS`. Production không được dùng wildcard `*`.                                                                                                         |

## 11.2. Audit & truy vết

| **Mã NFR** | **Yêu cầu**                                                                                                                                                                                                                       |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NFR-A01    | **Audit toàn diện hành động state-changing** — mọi action thay đổi dữ liệu nghiệp vụ phải gọi `auditLog(actorId, actionCode, description, ip)` vào bảng `SystemLog`. Danh sách action codes hiện hành nằm trong UC-I04.            |
| NFR-A02    | **Không chặn nghiệp vụ vì lỗi log** — `auditLog` được bọc try/catch và chỉ ghi warning vào logger nếu DB SystemLog fail; không bao giờ throw ra controller.                                                                          |
| NFR-A03    | **Lịch sử trạng thái bài nộp** — mọi chuyển trạng thái `Submission.status` phải lưu `SubmissionLog` (oldStatus, newStatus, actorId, note) song song với SystemLog ở cấp hệ thống.                                                   |

## 11.3. Toàn vẹn dữ liệu

| **Mã NFR** | **Yêu cầu**                                                                                                                                                                                                                       |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NFR-D01    | **Optimistic Concurrency Control khi chấm điểm** — `Grade.version` được tăng atomically. Nếu version client gửi không khớp version DB, hệ thống reject và yêu cầu reload (chống ghi đè điểm đồng thời).                            |
| NFR-D02    | **Khóa kỳ chỉ sau khi PĐT duyệt toàn bộ** — endpoint `lockSemester` kiểm tra `approvedReports >= totalReports`; field `isLocked` bị loại khỏi `updateTermSchema` để chặn bypass.                                                    |
| NFR-D03    | **Rubric không sửa sau khi có điểm** — `deleteRubric` chặn nếu `_count.grades > 0`. Nếu thêm `updateRubric` sau này phải áp dụng quy tắc tương tự.                                                                                  |
| NFR-D04    | **Batch import giới hạn 500 records/lần** — chống DoS và cạn bộ nhớ.                                                                                                                                                                |
| NFR-D05    | **Phân loại vi phạm bắt buộc khi TU_CHOI** — khi chuyển trạng thái sang `TU_CHOI`, hệ thống yêu cầu nhập <code>LoaiViPham</code> và lưu vào cột riêng (`BaoCao.LoaiViPham`), không gộp lẫn vào `rejectReason`.                       |

# 12. Ghi chú thiết kế nghiệp vụ

- Admin có toàn quyền kỹ thuật nhưng không tự phê duyệt nội dung điểm cuối cùng.

- Phòng Đào tạo là tác nhân duy nhất phê duyệt kết quả chấm điểm cuối cùng và duyệt yêu cầu mở lại chấm điểm.

- Giảng viên phụ trách lớp học phần là người phân nhóm, giao đề tài, thiết lập rubric và chấm điểm cho lớp đó.

- Sinh viên chỉ xem điểm cuối cùng sau khi báo cáo đạt trạng thái HOAN_THANH.

- Điểm nháp trong quá trình DANG_CHAM chỉ hiển thị cho giảng viên.

- Sau khi điểm đã được khóa cuối kỳ, không actor nào được chỉnh sửa điểm trực tiếp.

- Mỗi lần thay đổi trạng thái báo cáo, yêu cầu nộp lại hoặc yêu cầu mở lại chấm điểm cần ghi lịch sử và gửi thông báo phù hợp.

- **Khởi tạo lớp học phần là batch-only.** Không tồn tại endpoint/form tạo lớp đơn lẻ; mọi lớp đều phải đi qua Batch Importer kèm `teacherCode` bắt buộc. Quy ước này đảm bảo dữ liệu lớp luôn nhất quán có giảng viên phụ trách và là lý do bản 2.2 gỡ chức năng "Đề xuất phân công tự động" — không còn lớp trống giảng viên để đề xuất.

- **Loại phân công đề tài là thuộc tính cấp lớp HP, không cấp đề tài.** `Class.assignmentType ∈ {CA_NHAN, NHOM}`, mặc định `NHOM`. Trộn cá nhân + nhóm trong cùng một lớp không được hỗ trợ — nếu cần, tách thành 2 lớp riêng. Lý do chọn cấp lớp: (1) giảm phân nhánh trong UI giáo viên (1 lớp → 1 layout); (2) đơn giản hoá audit và báo cáo; (3) PĐT đã có context lớp khi cấu hình, không cần biết chi tiết từng đề tài.

- **Schema đồng nhất cho cả 2 nhánh.** Để pipeline submission/grading/evaluation không phải rẽ nhánh theo `assignmentType`, BE quy ước: lớp `CA_NHAN` cũng dùng entity `Group` + `GroupMember` (size=1, SV duy nhất là leader). Submission luôn tham chiếu `groupId`; với CA_NHAN, contribution factor mặc định = 1 nên block "Điểm cá nhân theo hệ số đóng góp" (UC-09 EXT) tự ẩn. Quyết định này đánh đổi: model thêm dữ liệu hơi dư (Group cho 1 SV) nhưng tiết kiệm rất nhiều code rẽ nhánh ở layer service/UI.

- **Đổi `assignmentType` bị khoá sau khi lớp đã có nhóm/đề tài.** PĐT phải quyết định loại trước khi GV bắt đầu phân nhóm hoặc gán đề tài. Việc này được enforce ở BE bằng check `prisma.group.count({ where: { classId } }) > 0` trong `setClassAssignmentType`.

- **Phân biệt batch và thủ công sau import:** batch chỉ dùng để bootstrap dữ liệu nền đầu kỳ (lớp, đăng ký sinh viên); các điều chỉnh lẻ tẻ phát sinh sau đó (thêm/xóa 1-2 sinh viên, đổi giảng viên 1 lớp) thực hiện qua UI thủ công với lý do bắt buộc và ghi nhật ký.

- Chức năng chat/bình luận tự do giữa giảng viên và sinh viên không nằm trong phạm vi chính của bản Use Case này. Trao đổi nghiệp vụ giữa GV và SV được thể hiện qua yêu cầu sửa, nhận xét chấm điểm, yêu cầu nộp lại và thông báo. Riêng giảng viên/PĐT/Admin có thể dùng "Ghi chú nội bộ giảng viên" (UC-29) để ghi note nội bộ, sinh viên không truy cập được.

- Một nhóm có thể có người đại diện nộp để tránh nộp trùng, nhưng không bắt buộc xây dựng vai trò nhóm trưởng phức tạp nếu không cần cho nghiệp vụ.
