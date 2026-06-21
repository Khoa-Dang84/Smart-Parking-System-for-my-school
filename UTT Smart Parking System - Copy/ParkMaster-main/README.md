
# Smart UTT Parking System
 Hệ thống quản lý bãi xe thông minh cho nhà trường

### 1. Giới thiệu dự án

Smart UTT Parking System là hệ thống quản lý bãi gửi xe thông minh được xây dựng nhằm hỗ trợ nhà trường trong việc quản lý phương tiện ra/vào, theo dõi số lượng chỗ trống, quản lý tài khoản sinh viên và tối ưu hoạt động vận hành bãi xe. Hệ thống hướng tới việc thay thế phương thức gửi xe truyền thống bằng một nền tảng số hóa, có khả năng tự động nhận diện biển số xe, quản lý giao dịch gửi xe, nạp tiền và cung cấp dữ liệu thống kê cho bộ phận quản trị.

Dự án ban đầu đã có một số giao diện cơ bản như trang đăng nhập quản trị viên, trang chọn khu đỗ xe và sơ đồ bãi đỗ. Tuy nhiên, để đáp ứng đầy đủ yêu cầu của một hệ thống gửi xe thông minh cho nhà trường, dự án cần được nâng cấp thêm backend, cơ sở dữ liệu, chức năng đăng nhập phân quyền, ví tài khoản sinh viên, quản lý xe, quản lý lượt gửi xe và các chức năng thống kê dành cho admin.

---

### 2. Mục tiêu của hệ thống

Mục tiêu chính của hệ thống là xây dựng một nền tảng quản lý bãi xe thông minh, giúp sinh viên có thể đăng nhập, đăng ký phương tiện, nạp tiền vào tài khoản, theo dõi thông tin gửi xe và sử dụng dịch vụ gửi xe một cách thuận tiện. Đối với admin, hệ thống cung cấp công cụ quản lý người dùng, quản lý phương tiện, giám sát lượt xe ra/vào, theo dõi doanh thu, kiểm tra tình trạng bãi xe và phát hiện các trường hợp đỗ xe sai quy định.

Hệ thống cũng hướng tới việc ứng dụng camera và AI để tự động nhận diện biển số xe khi phương tiện đi vào hoặc đi ra khỏi bãi. Sau khi nhận diện biển số, hệ thống đối chiếu với cơ sở dữ liệu để xác định chủ xe, kiểm tra số dư tài khoản, ghi nhận thời gian vào/ra và tự động tính phí gửi xe.

---

### 3. Đối tượng sử dụng

Hệ thống gồm hai nhóm người dùng chính:

**Sinh viên** là người sử dụng dịch vụ gửi xe. Sinh viên có thể đăng ký tài khoản, đăng nhập hệ thống, cập nhật thông tin cá nhân, đăng ký phương tiện, xem số dư ví, nạp tiền, xem lịch sử gửi xe và theo dõi tình trạng bãi xe.

**Admin** là người quản trị hệ thống. Admin có quyền quản lý tài khoản sinh viên, quản lý phương tiện, quản lý khu vực đỗ xe, theo dõi lượt xe ra/vào, kiểm duyệt giao dịch nạp tiền, xem thống kê doanh thu, xem mật độ xe theo thời gian và xử lý các cảnh báo vi phạm.

---

### 4. Chức năng chính của hệ thống

#### 4.1. Chức năng đăng nhập và phân quyền

Hệ thống cần có chức năng đăng nhập dành cho sinh viên và admin. Khi đăng nhập thành công, người dùng sẽ được điều hướng đến giao diện phù hợp với vai trò của mình.

Sinh viên sau khi đăng nhập sẽ truy cập vào trang cá nhân, ví tài khoản, thông tin phương tiện, lịch sử gửi xe và bản đồ chỗ trống. Admin sau khi đăng nhập sẽ truy cập vào trang quản trị, nơi có thể quản lý toàn bộ dữ liệu hệ thống.

Việc phân quyền giúp đảm bảo sinh viên chỉ có thể xem và thao tác với dữ liệu cá nhân của mình, trong khi admin có quyền quản lý tổng thể hệ thống.

---

#### 4.2. Chức năng quản lý tài khoản sinh viên

Sinh viên có thể tạo tài khoản bằng mã sinh viên, họ tên, email, số điện thoại và mật khẩu. Sau khi đăng ký, tài khoản sẽ được lưu vào cơ sở dữ liệu. Sinh viên có thể cập nhật thông tin cá nhân, đổi mật khẩu và xem trạng thái tài khoản.

Admin có thể xem danh sách sinh viên, tìm kiếm sinh viên theo mã sinh viên, khóa tài khoản vi phạm hoặc chỉnh sửa thông tin khi cần thiết.

---

#### 4.3. Chức năng quản lý phương tiện

Mỗi sinh viên có thể đăng ký một hoặc nhiều phương tiện. Thông tin phương tiện bao gồm biển số xe, loại xe, tên xe, màu xe và trạng thái hoạt động. Biển số xe là thông tin quan trọng dùng để đối chiếu khi camera AI nhận diện phương tiện tại cổng ra/vào.

Admin có thể xem danh sách phương tiện, kiểm tra phương tiện theo biển số, cập nhật trạng thái xe và xử lý các trường hợp xe chưa được đăng ký trong hệ thống.

---

#### 4.4. Chức năng nạp tiền và quản lý ví

Mỗi sinh viên có một ví tài khoản trong hệ thống. Sinh viên có thể nạp tiền vào ví để sử dụng cho việc thanh toán phí gửi xe. Trong phạm vi dự án sinh viên, chức năng nạp tiền có thể được triển khai theo dạng mô phỏng hoặc thông qua bước xác nhận của admin.

Khi sinh viên tạo yêu cầu nạp tiền, hệ thống sẽ ghi nhận giao dịch với trạng thái chờ xử lý. Admin có thể kiểm duyệt giao dịch, sau đó hệ thống cộng tiền vào ví của sinh viên. Mọi giao dịch nạp tiền, trừ tiền và hoàn tiền đều được lưu lại trong lịch sử giao dịch để đảm bảo minh bạch.

---

#### 4.5. Chức năng gửi xe và lấy xe

Khi xe đi vào bãi, camera tại cổng vào sẽ chụp biển số xe. Mô hình AI nhận diện biển số và gửi kết quả về backend. Backend kiểm tra biển số trong cơ sở dữ liệu để xác định xe thuộc sinh viên nào, sau đó tạo một bản ghi gửi xe với thời gian vào, khu vực đỗ và trạng thái đang gửi.

Khi xe đi ra khỏi bãi, camera tại cổng ra tiếp tục nhận diện biển số. Hệ thống tìm bản ghi gửi xe đang hoạt động, tính thời gian gửi, tính phí, kiểm tra số dư ví và tự động trừ tiền. Sau khi thanh toán thành công, hệ thống cập nhật thời gian ra và chuyển trạng thái lượt gửi xe sang đã hoàn thành.

Trong trường hợp xe chưa đăng ký, số dư không đủ hoặc biển số không khớp, hệ thống sẽ gửi cảnh báo cho admin để xử lý thủ công.

---

#### 4.6. Bản đồ chỗ trống thời gian thực

Hệ thống cần có bản đồ bãi xe hiển thị số lượng chỗ trống theo từng khu vực. Các ô đỗ xe được thể hiện bằng trạng thái như còn trống, đã có xe, đang bảo trì hoặc đỗ sai vị trí.

Dữ liệu chỗ trống có thể được cập nhật từ camera quan sát trên cao hoặc từ thao tác của admin trong giai đoạn mô phỏng. Khi có xe vào hoặc ra khỏi bãi, số lượng chỗ trống sẽ được cập nhật tự động để sinh viên có thể theo dõi tình trạng bãi xe trước khi vào gửi xe.

---

#### 4.7. Hệ thống quản trị admin

Trang quản trị dành cho admin cần cung cấp các chức năng chính như quản lý sinh viên, quản lý phương tiện, quản lý khu vực đỗ xe, quản lý lượt gửi xe, quản lý giao dịch nạp tiền và xem báo cáo thống kê.

Admin có thể theo dõi tổng số xe trong bãi, số chỗ còn trống, số lượt xe trong ngày, doanh thu theo ngày/tháng và danh sách cảnh báo. Dashboard cũng có thể hiển thị biểu đồ mật độ xe theo giờ để giúp nhà trường xác định thời điểm bãi xe đông nhất.

---

#### 4.8. Cảnh báo vi phạm

Hệ thống có thể phát hiện và cảnh báo một số trường hợp bất thường như xe chưa đăng ký, xe đỗ sai vị trí, xe vào bãi nhưng không có lượt gửi hợp lệ, biển số không nhận diện được hoặc tài khoản sinh viên không đủ tiền thanh toán.

Các cảnh báo này sẽ được hiển thị trên trang admin để người quản lý kịp thời kiểm tra và xử lý.

---

### 5. Đề xuất kiến trúc hệ thống

Hệ thống có thể được xây dựng theo mô hình gồm bốn thành phần chính:

**Frontend**: giao diện người dùng dành cho sinh viên và admin. Có thể phát triển từ các file HTML/CSS/JavaScript hiện có hoặc nâng cấp lên ReactJS để dễ quản lý trạng thái và mở rộng giao diện.

**Backend**: xử lý đăng nhập, phân quyền, quản lý sinh viên, phương tiện, ví tài khoản, lượt gửi xe, giao dịch và API kết nối với AI. Có thể sử dụng Node.js/Express hoặc Java Spring Boot.

**Database**: lưu trữ dữ liệu người dùng, phương tiện, khu đỗ xe, vị trí đỗ, lượt gửi xe, giao dịch nạp tiền và cảnh báo. Có thể sử dụng MySQL hoặc PostgreSQL.

**AI Service**: module nhận diện biển số xe bằng Python, OpenCV, YOLO và OCR. Module này nhận ảnh từ camera, xử lý biển số và trả kết quả về backend để thực hiện đối chiếu dữ liệu.

---

### 6. Đề xuất cơ sở dữ liệu

Cơ sở dữ liệu nên gồm các bảng chính sau:

**users**: lưu thông tin tài khoản người dùng, gồm sinh viên và admin.

**vehicles**: lưu thông tin phương tiện của sinh viên.

**wallets**: lưu số dư ví của từng sinh viên.

**transactions**: lưu lịch sử nạp tiền, trừ tiền và hoàn tiền.

**parking_areas**: lưu thông tin các khu vực đỗ xe.

**parking_slots**: lưu thông tin từng ô đỗ xe và trạng thái hiện tại.

**parking_sessions**: lưu thông tin mỗi lượt gửi xe, gồm thời gian vào, thời gian ra, phí gửi xe và trạng thái thanh toán.

**alerts**: lưu các cảnh báo như xe chưa đăng ký, đỗ sai vị trí, không đủ tiền hoặc biển số không nhận diện được.

---

### 7. Luồng hoạt động chính

#### Luồng sinh viên đăng nhập và sử dụng hệ thống

Sinh viên truy cập hệ thống, đăng nhập bằng mã sinh viên và mật khẩu. Sau khi đăng nhập thành công, sinh viên có thể xem thông tin cá nhân, đăng ký phương tiện, kiểm tra số dư ví, tạo yêu cầu nạp tiền, xem lịch sử gửi xe và theo dõi tình trạng chỗ trống trong bãi.

#### Luồng nạp tiền

Sinh viên nhập số tiền muốn nạp và gửi yêu cầu. Hệ thống tạo giao dịch với trạng thái chờ xử lý. Admin kiểm tra và xác nhận giao dịch. Sau khi được duyệt, số tiền được cộng vào ví sinh viên và giao dịch được chuyển sang trạng thái thành công.

#### Luồng xe vào bãi

Camera cổng vào chụp biển số xe. AI nhận diện biển số và gửi kết quả về backend. Backend kiểm tra biển số trong danh sách xe đã đăng ký. Nếu hợp lệ, hệ thống tạo lượt gửi xe mới, ghi nhận thời gian vào và cập nhật số lượng chỗ trống. Nếu không hợp lệ, hệ thống tạo cảnh báo để admin xử lý.

#### Luồng xe ra khỏi bãi

Camera cổng ra nhận diện biển số xe. Backend tìm lượt gửi xe đang hoạt động tương ứng với biển số. Hệ thống tính thời gian gửi xe, tính phí, kiểm tra số dư ví và trừ tiền tự động. Sau đó, hệ thống cập nhật thời gian ra, kết thúc lượt gửi xe và cập nhật lại trạng thái chỗ đỗ.

---

### 8. Kế hoạch nâng cấp từ dự án hiện tại

Giai đoạn 1: Hoàn thiện giao diện frontend.
Cần chỉnh sửa lại giao diện hiện có thành hai nhóm chính: giao diện sinh viên và giao diện admin. Giao diện sinh viên gồm trang đăng nhập, trang cá nhân, ví tài khoản, đăng ký xe, lịch sử gửi xe và bản đồ chỗ trống. Giao diện admin gồm dashboard, quản lý sinh viên, quản lý xe, quản lý giao dịch, quản lý bãi xe và cảnh báo.

Giai đoạn 2: Xây dựng backend và cơ sở dữ liệu.
Cần tạo server backend để xử lý API đăng nhập, đăng ký, quản lý người dùng, quản lý xe, nạp tiền, gửi xe, lấy xe và thống kê. Đồng thời xây dựng database để lưu trữ toàn bộ dữ liệu hệ thống.

Giai đoạn 3: Kết nối frontend với backend.
Các form đăng nhập, đăng ký, nạp tiền, thêm xe, gửi xe và lấy xe cần được kết nối với API thật thay vì chỉ hiển thị giao diện tĩnh. Dữ liệu hiển thị trên dashboard và bản đồ bãi xe cần được lấy từ cơ sở dữ liệu.

Giai đoạn 4: Tích hợp AI nhận diện biển số.
Xây dựng module AI riêng để nhận diện biển số xe từ ảnh hoặc camera. Trong giai đoạn đầu, có thể cho phép upload ảnh biển số để kiểm thử. Sau đó, hệ thống có thể mở rộng kết nối camera trực tiếp tại cổng vào và cổng ra.

Giai đoạn 5: Hoàn thiện thống kê và cảnh báo.
Admin dashboard cần có biểu đồ số lượt xe theo ngày, doanh thu theo tháng, mật độ xe theo giờ và danh sách cảnh báo. Hệ thống cũng cần phát hiện các trường hợp bất thường như xe chưa đăng ký, xe đỗ sai vị trí hoặc tài khoản không đủ tiền.

---

### 9. Kết luận

Smart UTT Parking System là một dự án có tính ứng dụng thực tế cao trong môi trường trường học. Việc nâng cấp từ giao diện tĩnh ban đầu thành một hệ thống hoàn chỉnh sẽ giúp dự án đáp ứng tốt hơn các yêu cầu quản lý bãi xe thông minh. Hệ thống không chỉ hỗ trợ sinh viên gửi xe thuận tiện hơn mà còn giúp nhà trường quản lý phương tiện, doanh thu, chỗ trống và các vi phạm một cách khoa học, minh bạch và hiệu quả.

Với các chức năng như đăng nhập phân quyền, quản lý ví, nạp tiền, nhận diện biển số bằng AI, bản đồ chỗ trống thời gian thực và dashboard quản trị, dự án có thể phát triển thành một nền tảng quản lý bãi xe thông minh phù hợp với nhu cầu thực tế của nhà trường.
