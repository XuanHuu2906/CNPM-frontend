**TÀI LIỆU USE CASE MODELING**

**PHẦN MỀM CHẤM ĐIỂM BÁO CÁO ĐỀ TÀI MÔN HỌC**

| **Thông tin**    | **Nội dung**                                                                                                                                                                                                                                                               |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Tên tài liệu     | Use Case Modeling - Bản chỉnh sửa hoàn chỉnh                                                                                                                                                                                                                               |
| Dự án            | Phần mềm Chấm Điểm Báo Cáo Đề Tài Môn Học                                                                                                                                                                                                                                  |
| Phiên bản        | 2.0                                                                                                                                                                                                                                                                        |
| Ngày cập nhật    | 22/05/2026                                                                                                                                                                                                                                                                 |
| Cách trình bày   | Đơn giản, rõ ràng, không sử dụng màu sắc trang trí                                                                                                                                                                                                                         |
| Phạm vi cập nhật | Cập nhật theo các quyết định nghiệp vụ đã thống nhất trong quá trình rà soát: giảng viên phụ trách lớp phân nhóm/giao đề tài/chấm điểm; Admin/PDT chỉ nhập dữ liệu nền; bổ sung yêu cầu nộp lại và yêu cầu mở lại chấm điểm; bỏ trao đổi qua bình luận khỏi phạm vi chính. |

**Mục đích tài liệu**

Tài liệu này mô tả tác nhân, danh sách Use Case, quan hệ Actor - Use Case và đặc tả chi tiết các Use Case chính của hệ thống. Bản 2.0 thay thế nội dung chưa sát thực tế trong bản ban đầu, đặc biệt là phần phân công đề tài, phân nhóm, nộp lại báo cáo, mở lại chấm điểm và thông báo theo vai trò.

# 1. Tổng quan hệ thống

Phần mềm Chấm Điểm Báo Cáo Đề Tài Môn Học hỗ trợ quản lý quy trình từ dữ liệu nền, tổ chức lớp học phần, phân nhóm, giao đề tài, nộp báo cáo, chấm điểm, phê duyệt, công bố kết quả và khóa điểm cuối kỳ. Hệ thống phân quyền theo vai trò để đảm bảo mỗi actor chỉ thực hiện đúng trách nhiệm nghiệp vụ.

Phạm vi chính của hệ thống gồm:

- Sinh viên xem thông tin đề tài/nhóm, nộp báo cáo, theo dõi trạng thái, gửi yêu cầu nộp lại khi đã nộp nhưng cần chỉnh sửa, và xem kết quả sau khi được phê duyệt.

- Giảng viên phụ trách lớp học phần quản lý lớp, phân nhóm sinh viên, giao đề tài, thiết lập phiếu chấm điểm, yêu cầu sửa, chấm điểm và gửi yêu cầu mở lại chấm điểm khi cần.

- Admin vận hành hệ thống kỹ thuật, quản trị tài khoản, cấu hình, nhập dữ liệu nền, xem log, sao lưu/phục hồi dữ liệu và hỗ trợ kỹ thuật.

- Phòng Đào tạo quản lý học thuật ở mức kiểm soát: phê duyệt kết quả cuối cùng, duyệt yêu cầu mở lại chấm điểm, điều chỉnh giảng viên phụ trách trong trường hợp đặc biệt và giám sát tiến độ toàn khoa.

- Hệ thống gửi thông báo đúng vai trò, không gửi mọi sự kiện nhỏ của lớp cho Phòng Đào tạo nếu sự kiện đó chỉ cần giảng viên xử lý.

**Nguyên tắc điều chỉnh so với bản ban đầu**

- Admin/PDT không nhập nhóm, đề tài, rubric hoặc điểm trong Batch Importer. Các dữ liệu này thuộc nghiệp vụ của giảng viên phụ trách lớp.

- Giảng viên phụ trách lớp là người phân nhóm, giao đề tài và chấm điểm chính cho lớp học phần đó.

- Sinh viên không tự nộp đè sau khi đã nộp thành công. Nếu muốn sửa, sinh viên phải gửi yêu cầu nộp lại để giảng viên duyệt.

- Giảng viên không tự sửa điểm sau khi đã xác nhận chấm xong. Nếu cần sửa, giảng viên gửi yêu cầu mở lại chấm điểm để Phòng Đào tạo duyệt.

- Chức năng chat/bình luận tự do giữa giảng viên và sinh viên không nằm trong phạm vi nghiệp vụ chính; thay bằng yêu cầu sửa, nhận xét chấm điểm và thông báo trạng thái.

# 2. Tác nhân (Actors)

| **Tên Actor**              | **Mô tả**                                                                                                                                                                       |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sinh viên                  | Người thuộc lớp học phần, xem thông tin nhóm/đề tài, nộp báo cáo, gửi yêu cầu nộp lại khi cần, theo dõi tiến độ và xem kết quả sau khi được công bố.                            |
| Giảng viên                 | Người phụ trách lớp học phần; quản lý danh sách sinh viên, phân nhóm, giao đề tài, thiết lập phiếu chấm điểm, chấm điểm, nhận xét, yêu cầu sửa và xử lý yêu cầu nộp lại.        |
| Quản trị hệ thống (Admin)  | Người vận hành kỹ thuật; quản trị tài khoản, nhập dữ liệu nền, cấu hình hệ thống, sao lưu/phục hồi, xem log và hỗ trợ sự cố. Admin không phê duyệt nội dung điểm.               |
| Phòng Đào tạo              | Đơn vị quản lý học thuật; phê duyệt kết quả cuối cùng, duyệt yêu cầu mở lại chấm điểm, điều chỉnh giảng viên phụ trách trong trường hợp đặc biệt và giám sát tiến độ toàn khoa. |
| Hệ thống quản lý sinh viên | Hệ thống ngoài hoặc nguồn dữ liệu cung cấp danh sách sinh viên, giảng viên, học kỳ, lớp học phần và đăng ký lớp học phần khi có tích hợp.                                       |
| Dịch vụ Email/Thông báo    | Module hoặc hệ thống ngoài gửi thông báo nội bộ và email theo các sự kiện nghiệp vụ đã định nghĩa.                                                                              |

# 3. Phạm vi dữ liệu và trách nhiệm nghiệp vụ

| **Nhóm dữ liệu / nghiệp vụ**                                      | **Người thực hiện chính**                    | **Ghi chú**                                                                                                        |
|-------------------------------------------------------------------|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| Sinh viên, giảng viên, học kỳ, lớp học phần, đăng ký lớp học phần | Admin hoặc Phòng Đào tạo nếu được phân quyền | Được nhập bằng Excel/CSV hoặc đồng bộ từ hệ thống ngoài. Đây là dữ liệu nền.                                       |
| Phân nhóm sinh viên                                               | Giảng viên phụ trách lớp học phần            | Không import từ Admin/PDT trong phạm vi chính. Giảng viên tạo nhóm sau khi lớp học phần đã có danh sách sinh viên. |
| Giao đề tài                                                       | Giảng viên phụ trách lớp học phần            | Giảng viên tạo đề tài và gán cho nhóm/sinh viên. Không nhập đề tài hàng loạt bởi Admin trong phạm vi chính.        |
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
| UC-12     | Nhập dữ liệu nền hệ thống       | Admin, Phòng Đào tạo                      | Chính           | Nhập Excel/CSV danh sách sinh viên, giảng viên, học kỳ, lớp học phần và đăng ký lớp học phần.               |
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
| UC-23     | Quản lý / phân nhóm sinh viên   | Giảng viên                                | Chính           | Tạo, chỉnh sửa nhóm sinh viên trong lớp học phần và chọn người đại diện nộp nếu cần.                        |
| UC-24     | Quản lý / giao đề tài           | Giảng viên                                | Chính           | Tạo đề tài và gán đề tài cho sinh viên/nhóm trong lớp học phần.                                             |
| UC-25     | Gửi yêu cầu nộp lại báo cáo     | Sinh viên                                 | Chính           | Sinh viên đã nộp báo cáo nhưng muốn chỉnh sửa thì gửi yêu cầu cho giảng viên.                               |
| UC-26     | Duyệt yêu cầu nộp lại báo cáo   | Giảng viên                                | Chính           | Giảng viên duyệt/từ chối yêu cầu nộp lại của sinh viên.                                                     |
| UC-27     | Gửi yêu cầu mở lại chấm điểm    | Giảng viên                                | Chính           | Giảng viên xin mở lại quyền chấm điểm sau khi đã xác nhận chấm xong.                                        |
| UC-28     | Duyệt yêu cầu mở lại chấm điểm  | Phòng Đào tạo                             | Chính           | Phòng Đào tạo duyệt/từ chối yêu cầu mở lại chấm điểm.                                                       |
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
| Giảng viên                 | UC-01, UC-07, UC-08, UC-09, UC-10, UC-11, UC-15, UC-22, UC-23, UC-24, UC-26, UC-27                 |
| Admin                      | UC-01, UC-12, UC-13, UC-14, UC-18, UC-19, UC-20, UC-21, UC-22; hỗ trợ kỹ thuật trong UC-15 khi cần |
| Phòng Đào tạo              | UC-01, UC-12 nếu được phân quyền, UC-16, UC-17, UC-18, UC-22, UC-28                                |
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
<td>Admin hoặc Phòng Đào tạo nếu được phân quyền nhập dữ liệu nền bằng Excel/CSV: sinh viên, giảng viên, học kỳ, lớp học phần và đăng ký lớp học phần. Không nhập nhóm, đề tài, rubric hoặc điểm trong phạm vi chính.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Admin; Phòng Đào tạo nếu được phân quyền; Hệ thống quản lý sinh viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Người dùng đã đăng nhập và có quyền nhập dữ liệu; có file Excel/CSV hợp lệ hoặc nguồn đồng bộ.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Dữ liệu nền được lưu; lỗi dữ liệu được báo rõ nếu có.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Người dùng chọn chức năng Nhập dữ liệu nền.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Người dùng chọn loại dữ liệu cần nhập: Sinh viên, Giảng viên, Học kỳ, Lớp học phần hoặc Đăng ký lớp học phần.<br />
2. Người dùng tải file Excel/CSV hoặc chọn nguồn đồng bộ.<br />
3. Hệ thống đọc dữ liệu và kiểm tra cấu trúc cột.<br />
4. Hệ thống kiểm tra trùng lặp, thiếu thông tin, sai mã, mã lớp/học kỳ/giảng viên không tồn tại.<br />
5. Người dùng xem kết quả kiểm tra.<br />
6. Người dùng xác nhận nhập dữ liệu hợp lệ.<br />
7. Hệ thống lưu dữ liệu và ghi log.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Người dùng tải file mẫu đúng cấu trúc trước khi nhập.<br />
Nếu file có dòng lỗi, hệ thống cho phép tải danh sách lỗi để sửa và nhập lại.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>File sai cấu trúc hoặc dữ liệu lỗi nghiêm trọng: hệ thống không nhập.<br />
Dữ liệu nhóm, đề tài, rubric hoặc điểm được đưa vào file import: hệ thống từ chối hoặc bỏ qua theo cấu hình.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I06; &lt;&lt;include&gt;&gt; UC-I02; &lt;&lt;include&gt;&gt; UC-I04</td>
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
<td>Tài khoản được tạo/cập nhật trạng thái/quyền; thao tác được ghi log.</td>
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
6. Hệ thống tạo/cập nhật tài khoản, gán vai trò và ghi log.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Admin khóa/mở khóa, đặt lại mật khẩu hoặc vô hiệu hóa tài khoản hiện có.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Tên đăng nhập trùng hoặc thiếu vai trò: hệ thống báo lỗi.<br />
Admin không được xóa tài khoản nếu cần bảo toàn lịch sử.</td>
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
<td>Báo cáo chuyển sang TU_CHOI hoặc được ghi nhận vi phạm; lý do được lưu; sinh viên nhận thông báo nếu có thay đổi trạng thái.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Người có thẩm quyền chọn Từ chối báo cáo hoặc ghi nhận vi phạm.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Người xử lý mở báo cáo cần kiểm tra.<br />
2. Hệ thống hiển thị thông tin báo cáo, lịch sử nộp và kết quả kiểm tra liên quan nếu có.<br />
3. Người xử lý nhập lý do vi phạm/từ chối.<br />
4. Hệ thống yêu cầu xác nhận.<br />
5. Người xử lý xác nhận.<br />
6. Hệ thống chuyển trạng thái sang TU_CHOI, ghi lịch sử và gửi thông báo.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Nếu còn thời hạn bổ sung và quy định cho phép, sinh viên có thể nộp lại sau khi báo cáo bị từ chối.<br />
Admin chỉ ghi nhận hoặc xử lý sự cố kỹ thuật, không tự quyết định nội dung điểm/vi phạm học thuật.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Không nhập lý do từ chối: hệ thống không cho xác nhận.<br />
Báo cáo đã khóa cuối kỳ: không thể từ chối.</td>
</tr>
<tr class="odd">
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
<td>Phòng Đào tạo chọn Trả về chấm lại, nhập lý do; hệ thống chuyển trạng thái về DANG_CHAM và thông báo cho giảng viên.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Thiếu điểm hoặc thiếu nhận xét bắt buộc: hệ thống không cho phê duyệt.<br />
Không có quyền phê duyệt: hệ thống từ chối truy cập.</td>
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
<td>Phòng Đào tạo đã đăng nhập; có dữ liệu lớp học phần/giảng viên trong hệ thống; kết quả chưa khóa cuối kỳ.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Phân công giảng viên phụ trách được cập nhật; lịch sử thay đổi được ghi nhận; giảng viên liên quan nhận thông báo.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Phòng Đào tạo chọn Điều chỉnh giảng viên phụ trách.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Phòng Đào tạo chọn học kỳ và lớp học phần cần điều chỉnh.<br />
2. Hệ thống hiển thị giảng viên phụ trách hiện tại.<br />
3. Phòng Đào tạo chọn giảng viên mới và nhập lý do.<br />
4. Hệ thống kiểm tra giảng viên mới tồn tại và phù hợp.<br />
5. Phòng Đào tạo xác nhận thay đổi.<br />
6. Hệ thống cập nhật phân công, ghi lịch sử và gửi thông báo.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Nếu quy trình yêu cầu, Phòng Đào tạo gửi yêu cầu để Admin cập nhật dữ liệu nền thay vì tự thay đổi.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Giảng viên mới không tồn tại hoặc không phù hợp: hệ thống báo lỗi.<br />
Báo cáo đã khóa cuối kỳ: không cho điều chỉnh.</td>
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
<td>Giảng viên phụ trách lớp học phần tạo và chỉnh sửa nhóm sinh viên trong lớp. Có thể chọn người đại diện nộp để tránh nộp trùng, nhưng người này không nhất thiết là nhóm trưởng quản lý.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; có lớp học phần phụ trách; danh sách sinh viên trong lớp đã được nhập hoặc đồng bộ.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Nhóm sinh viên được tạo/cập nhật; sinh viên xem được thông tin nhóm của mình.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên mở mục Phân nhóm trong lớp học phần.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Giảng viên chọn lớp học phần.<br />
2. Hệ thống hiển thị danh sách sinh viên chưa phân nhóm và các nhóm hiện có.<br />
3. Giảng viên tạo nhóm mới hoặc chỉnh sửa nhóm.<br />
4. Giảng viên thêm/xóa thành viên trong nhóm.<br />
5. Giảng viên chọn người đại diện nộp nếu quy định lớp yêu cầu một người nộp thay nhóm.<br />
6. Hệ thống kiểm tra một sinh viên không thuộc nhiều nhóm trong cùng lớp học phần.<br />
7. Giảng viên lưu thay đổi; hệ thống ghi lịch sử và thông báo cho sinh viên nếu cần.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Giảng viên có thể để chế độ mỗi sinh viên tự nộp nếu đề tài cá nhân.<br />
Giảng viên có thể đổi người đại diện nộp trước khi nhóm đã nộp báo cáo.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Sinh viên không thuộc lớp học phần: hệ thống không cho thêm vào nhóm.<br />
Nhóm đã có báo cáo đang chấm hoặc đã hoàn thành: hệ thống hạn chế sửa thành viên để bảo toàn lịch sử.<br />
Trùng thành viên trong nhiều nhóm: hệ thống báo lỗi.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I04; liên quan UC-07, UC-24</td>
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
<td>Giảng viên phụ trách lớp học phần tạo đề tài và gán đề tài cho sinh viên/nhóm trong lớp.</td>
</tr>
<tr class="even">
<td><strong>Tác nhân</strong></td>
<td>Giảng viên</td>
</tr>
<tr class="odd">
<td><strong>Tiền điều kiện</strong></td>
<td>Giảng viên đã đăng nhập; có lớp học phần phụ trách; nếu làm theo nhóm thì nhóm đã được tạo.</td>
</tr>
<tr class="even">
<td><strong>Hậu điều kiện</strong></td>
<td>Đề tài được tạo/cập nhật và gán cho sinh viên/nhóm; sinh viên xem được đề tài được giao.</td>
</tr>
<tr class="odd">
<td><strong>Kích hoạt</strong></td>
<td>Giảng viên mở mục Quản lý đề tài hoặc Giao đề tài.</td>
</tr>
<tr class="even">
<td><strong>Luồng chính</strong></td>
<td>1. Giảng viên chọn lớp học phần.<br />
2. Hệ thống hiển thị danh sách đề tài hiện có và danh sách sinh viên/nhóm.<br />
3. Giảng viên tạo đề tài mới với tên đề tài, mô tả, yêu cầu, deadline và ghi chú nếu có.<br />
4. Giảng viên gán đề tài cho sinh viên hoặc nhóm.<br />
5. Hệ thống kiểm tra một sinh viên/nhóm không bị gán trùng đề tài nếu quy định chỉ một đề tài.<br />
6. Giảng viên lưu thay đổi; hệ thống ghi lịch sử và gửi thông báo cho sinh viên/nhóm.</td>
</tr>
<tr class="odd">
<td><strong>Luồng thay thế</strong></td>
<td>Giảng viên chỉnh sửa thông tin đề tài trước khi sinh viên nộp báo cáo.<br />
Giảng viên thu hồi hoặc đổi đề tài khi chưa có báo cáo được nộp.</td>
</tr>
<tr class="even">
<td><strong>Ngoại lệ</strong></td>
<td>Đề tài đã có báo cáo nộp: hệ thống hạn chế đổi đề tài hoặc yêu cầu xác nhận/lý do.<br />
Thiếu tên đề tài hoặc deadline không hợp lệ: hệ thống báo lỗi.</td>
</tr>
<tr class="odd">
<td><strong>UC liên quan</strong></td>
<td>&lt;&lt;include&gt;&gt; UC-I01; &lt;&lt;include&gt;&gt; UC-I03; &lt;&lt;include&gt;&gt; UC-I04; liên quan UC-23</td>
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

# 8. Đặc tả Use Case phụ dạng \<\<include\>\>

| **Mã UC phụ** | **Tên**                         | **Mô tả**                                                                                                                                                                                                                                                                                                                |
|---------------|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| UC-I01        | Kiểm tra quyền truy cập         | Hệ thống xác định người dùng đã đăng nhập, vai trò hợp lệ và dữ liệu thuộc phạm vi được phép xem/thao tác. Nếu không hợp lệ, thao tác bị chặn và ghi log nếu cần.                                                                                                                                                        |
| UC-I02        | Kiểm tra file nộp/import        | Hệ thống kiểm tra định dạng, dung lượng, cấu trúc cột, dữ liệu bắt buộc, dữ liệu trùng lặp, hạn nộp và quyền nộp/import.                                                                                                                                                                                                 |
| UC-I03        | Gửi thông báo tự động           | Hệ thống gửi thông báo in-app/email theo vai trò. Sinh viên nhận thông báo về deadline, yêu cầu sửa, yêu cầu nộp lại và kết quả; giảng viên nhận thông báo về bài nộp, yêu cầu nộp lại, PDT trả về/mở lại; Phòng Đào tạo nhận thông báo về kết quả chờ duyệt và yêu cầu mở lại; Admin nhận cảnh báo kỹ thuật/import/log. |
| UC-I04        | Ghi lịch sử thao tác/trạng thái | Hệ thống ghi người thực hiện, thời điểm, trạng thái cũ, trạng thái mới, lý do, dữ liệu liên quan và IP/thiết bị nếu cần.                                                                                                                                                                                                 |
| UC-I05        | Tính điểm tổng                  | Hệ thống tính điểm tổng theo tiêu chí, trọng số, thang điểm và quy tắc làm tròn đã cấu hình.                                                                                                                                                                                                                             |
| UC-I06        | Đồng bộ dữ liệu nền             | Hệ thống đồng bộ sinh viên, giảng viên, học kỳ, lớp học phần và đăng ký lớp học phần từ hệ thống ngoài nếu có tích hợp.                                                                                                                                                                                                  |

# 9. Quy tắc thông báo theo vai trò

| **Vai trò**   | **Loại thông báo nên nhận**                                                                                                                                                        |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sinh viên     | Được giao đề tài/nhóm; deadline sắp tới; nộp thành công; giảng viên yêu cầu sửa; yêu cầu nộp lại được duyệt/từ chối; điểm được phê duyệt; báo cáo bị từ chối.                      |
| Giảng viên    | Sinh viên/nhóm nộp bài; sinh viên gửi yêu cầu nộp lại; báo cáo được Phòng Đào tạo trả về; yêu cầu mở lại chấm điểm được duyệt/từ chối; deadline lớp sắp tới nếu cần nhắc nộp.      |
| Phòng Đào tạo | Có kết quả chờ duyệt; có yêu cầu mở lại chấm điểm; tiến độ toàn khoa có rủi ro lớn. Không nhận mọi sự kiện nhỏ của lớp nếu giảng viên có thể xử lý.                                |
| Admin         | Lỗi import; lỗi gửi email; lỗi upload; cảnh báo bảo mật; backup thất bại; tài khoản bị khóa do đăng nhập sai nhiều lần. Admin không nhận thông báo nghiệp vụ lớp học thông thường. |

# 10. Cấu trúc dữ liệu nhập hàng loạt đề xuất

Batch Importer chỉ phục vụ dữ liệu nền. Không nhập nhóm, đề tài, rubric hoặc điểm trong phạm vi chính. Các trường dưới đây là đề xuất tối thiểu để phù hợp thực tế triển khai.

| **Loại dữ liệu**     | **Trường thông tin tối thiểu**                                                                            | **Validation chính**                                                                                                                  |
|----------------------|-----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Sinh viên            | MSSV, Họ tên, Ngày sinh, Email trường, Lớp hành chính, Khoa, Trạng thái                                   | MSSV không trùng; email đúng định dạng; ngày sinh dùng để tạo mật khẩu mặc định nếu áp dụng.                                          |
| Giảng viên           | Mã giảng viên, Họ tên, Ngày sinh, Email, Khoa/Bộ môn, Trạng thái                                          | Mã giảng viên không trùng; email đúng định dạng.                                                                                      |
| Học kỳ               | Mã học kỳ, Tên học kỳ, Năm học, Ngày bắt đầu, Ngày kết thúc, Trạng thái                                   | Ngày bắt đầu nhỏ hơn ngày kết thúc; chỉ một học kỳ đang hoạt động nếu quy định như vậy.                                               |
| Lớp học phần         | Mã lớp học phần, Mã môn học, Tên môn học, Mã học kỳ, Mã giảng viên phụ trách, Hạn nộp báo cáo, Trạng thái | Mã học kỳ và mã giảng viên phải tồn tại; giảng viên phụ trách là trường quan trọng để xác định quyền phân nhóm/giao đề tài/chấm điểm. |
| Đăng ký lớp học phần | Mã lớp học phần, MSSV                                                                                     | Mã lớp và MSSV phải tồn tại; không trùng một sinh viên trong cùng lớp học phần.                                                       |

# 11. Ghi chú thiết kế nghiệp vụ

- Admin có toàn quyền kỹ thuật nhưng không tự phê duyệt nội dung điểm cuối cùng.

- Phòng Đào tạo là tác nhân duy nhất phê duyệt kết quả chấm điểm cuối cùng và duyệt yêu cầu mở lại chấm điểm.

- Giảng viên phụ trách lớp học phần là người phân nhóm, giao đề tài, thiết lập rubric và chấm điểm cho lớp đó.

- Sinh viên chỉ xem điểm cuối cùng sau khi báo cáo đạt trạng thái HOAN_THANH.

- Điểm nháp trong quá trình DANG_CHAM chỉ hiển thị cho giảng viên.

- Sau khi điểm đã được khóa cuối kỳ, không actor nào được chỉnh sửa điểm trực tiếp.

- Mỗi lần thay đổi trạng thái báo cáo, yêu cầu nộp lại hoặc yêu cầu mở lại chấm điểm cần ghi lịch sử và gửi thông báo phù hợp.

- Chức năng chat/bình luận tự do giữa giảng viên và sinh viên không nằm trong phạm vi chính của bản Use Case này. Trao đổi nghiệp vụ được thể hiện qua yêu cầu sửa, nhận xét chấm điểm, yêu cầu nộp lại và thông báo.

- Một nhóm có thể có người đại diện nộp để tránh nộp trùng, nhưng không bắt buộc xây dựng vai trò nhóm trưởng phức tạp nếu không cần cho nghiệp vụ.
