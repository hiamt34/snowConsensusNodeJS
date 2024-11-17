# Triển khai Avalanche Consensus bằng Node.js

Dự án này là một triển khai đơn giản của thuật toán đồng thuận Snow, lấy cảm hứng từ giao thức Avalanche. Nó được viết bằng Node.js và mô phỏng một mạng nhỏ gồm 200 node, chạy trên 10 tiến trình. Các node trao đổi giao dịch và đạt được đồng thuận thông qua cơ chế Snow consensus. Dự án tuân theo cấu trúc module, với sự phân tách rõ ràng giữa lớp mạng P2P và lớp ứng dụng.

## Cấu trúc Thư mục

```
snowConsensus/
  ├── src/
  │   ├── constants.js          # Các hằng số cấu hình cho dự án
  │   ├── transaction.js        # Định nghĩa lớp Transaction
  │   ├── node.js               # Định nghĩa lớp Node và logic đồng thuận
  │   ├── network.js            # Logic mạng P2P để giao tiếp giữa các node
  │   ├── node_process.js       # Tạo và quản lý các node
  │   ├── worker.js             # Quản lý các worker thread để mô phỏng tiến trình
  ├── test/
  │   ├── node.test.js          # Kiểm thử cho lớp Node
  │   ├── network.test.js       # Kiểm thử cho lớp Network
  ├── package.json              # Thông tin và phụ thuộc của dự án
  └── README.md                 # Tài liệu hướng dẫn dự án
```

## Bắt đầu  cài đặt

### Yêu cầu

- **Node.js** (khuyến nghị v18.19.0)
- **npm** (đi kèm với Node.js)

### Cài đặt

1. Clone repository:

   ```bash
   git clone https://github.com/hiamt34/snowConsensusNodeJS.git
   cd snowConsensus
   ```

2. Cài đặt các phụ thuộc:

   ```bash
   npm install
   ```

### Chạy Ứng Dụng

Để khởi chạy mạng và mô phỏng quá trình đồng thuận, chạy lệnh:

```bash
node src/worker.js
```

Lệnh này sẽ tạo ra 10 worker thread, mỗi thread chạy 20 node, tổng cộng có 200 node tham gia vào quá trình đồng thuận Snow.

### Chạy test ứng dụng

Để chạy test

```bash
npm run test
```

## Tổng Quan Dự Án

### Thuật Toán Snow Consensus

Thuật toán Snow consensus là tiền đề cho Avalanche consensus, được sử dụng để đạt được sự đồng thuận giữa các node phân tán. Triển khai đơn giản này cho thấy cách các node trao đổi và xác thực giao dịch, đạt đồng thuận bằng cơ chế xác suất.

- **Giao dịch** được phát sóng trên toàn mạng, và các node sẽ xác thực giao dịch dựa trên việc lấy mẫu ngẫu nhiên.
- **Các node** tham gia vào quá trình xác thực và ghi lại mức độ tin cậy (confidence) cho mỗi giao dịch, giúp xác định khả năng chấp nhận giao dịch dựa trên sự đồng thuận.

### Các Thành Phần Chính

- **Node**: Đại diện cho một node trong mạng, có khả năng nhận, xác thực, và phát sóng giao dịch. Mỗi node sử dụng cơ chế Snow consensus để quyết định chấp nhận hoặc từ chối giao dịch.
- **Network**: Quản lý các node và xử lý việc phát sóng giao dịch giữa chúng.
- **Worker Threads**: Mô phỏng các tiến trình để phân phối khối lượng công việc của 200 node trên 10 thread.

## Kiểm Thử

Dự án bao gồm các bài kiểm thử đơn vị để đảm bảo tính đúng đắn của các thành phần chính.

### Chạy Kiểm Thử

Để chạy các bài kiểm thử, sử dụng lệnh sau:

```bash
npm test
```

Các bài kiểm thử được thực hiện bằng framework Mocha và nằm trong thư mục `test/`:

- **`node.test.js`**: Kiểm thử chức năng của lớp `Node`.
- **`network.test.js`**: Kiểm thử chức năng của lớp `Network`.

## Ví Dụ Kết Quả

Khi bạn chạy ứng dụng, bạn sẽ thấy kết quả tương tự như sau:

```
Node 1 accepted transaction tx_abc123 with confidence 0.9
Node 2 rejected transaction tx_def456 with confidence 0.6
Node 3 accepted transaction tx_ghi789 with confidence 0.95
...
```

Kết quả này cho biết node nào đã chấp nhận hoặc từ chối giao dịch và mức độ tin cậy tương ứng của chúng, giúp hiểu rõ hơn về quá trình đồng thuận giữa các node.

### Giải  thích hằng số trong code

1. **`NUM_PROCESSES: 10`**:
   - Số lượng tiến trình worker (`Worker Threads`) sẽ được tạo.
   - Mỗi tiến trình sẽ chạy một nhóm node để phân phối công việc xử lý trong hệ thống.

2. **`NODES_PER_PROCESS: 20`**:
   - Số lượng node mà mỗi tiến trình sẽ khởi tạo.
   - Với `NUM_PROCESSES` là 10 và `NODES_PER_PROCESS` là 20, tổng số node sẽ là 10 × 20 = 200.

3. **`NUM_NODES: 200`**:
   - Tổng số lượng node trong hệ thống. Giá trị này có thể tính bằng `NUM_PROCESSES * NODES_PER_PROCESS`.

4. **`K: 4`**:
   - Số lượng node được lấy mẫu ngẫu nhiên (validators) để kiểm tra tính hợp lệ của một giao dịch.
   - Các node này sẽ bỏ phiếu cho giao dịch, và kết quả sẽ được dùng để tính mức độ tin cậy (`confidence`).

5. **`BROADCAST_COUNT: 5`**:
   - Số lượng node mà một giao dịch sẽ được phát sóng đến khi một node quyết định phát sóng.
   - Điều này giúp lan truyền giao dịch qua mạng một cách hiệu quả và giảm tải so với việc phát sóng tới tất cả các node.

6. **`CONFIDENCE_THRESHOLD: 0.7`**:
   - Ngưỡng để xác định một giao dịch có được chấp nhận hay không.
   - Nếu `confidence` (tỷ lệ số phiếu hợp lệ từ các node validator) của giao dịch đạt hoặc vượt quá `0.7`, giao dịch sẽ được node chấp nhận.

Các hằng số này giúp định nghĩa quy mô mạng lưới, tần suất phát sóng giao dịch và cách thức đạt được đồng thuận giữa các node trong hệ thống.

### Biểu Đồ Tuần Tự

```plaintext
+---------------------+            +-------------+            +----------------+
|       Worker        |            |   Network   |            |      Node      |
+---------------------+            +-------------+            +----------------+
        |                              |                           |
        | Tạo Node và Network          |                           |
        |----------------------------->|                           |
        |                              | Thêm Node vào Network     |
        |                              |-------------------------->|
        |                              |                           |
        |                              | Node nhận giao dịch       |
        |                              |<--------------------------|
        |                              |                           |
        |                              | Phát sóng giao dịch đến   |
        |                              | các Node khác             |
        |                              |-------------------------->|
        |                              |                           |
        |                              | Node khác nhận giao dịch  |
        |                              |<--------------------------|
        |                              |                           |
        |                              | Bắt đầu đồng thuận        |
        |                              |-------------------------->|
        |                              |                           |
        |                              | Node kiểm tra mức độ tin cậy|
        |                              |-------------------------->|
        |                              |                           |
        |                              | Node xác nhận hoặc từ chối |
        |                              | giao dịch dựa trên mức độ  |
        |                              | tin cậy                   |
        |                              |<--------------------------|
```

### Giải Thích Các Bước Trong Biểu Đồ Tuần Tự

1. **Worker Tạo Node và Network**:
   - Worker tạo ra các node và khởi tạo mạng (`Network`). Mỗi `Node` được kết nối với mạng (`Network`).

2. **Thêm Node vào Network**:
   - Mỗi `Node` sẽ được thêm vào danh sách quản lý của `Network`.

3. **Node Nhận và Xử Lý Giao Dịch**:
   - Sau khi tạo giao dịch (`Transaction`), `Node` sẽ tự nhận giao dịch đó và xử lý. Nếu giao dịch hợp lệ, `Node` sẽ phát sóng giao dịch đến các node khác trong `Network`.

4. **Network Phát Sóng Giao Dịch**:
   - `Network` chịu trách nhiệm phát sóng giao dịch đến một số node được chọn ngẫu nhiên, để đảm bảo sự phân phối giao dịch trong toàn bộ hệ thống.

5. **Node Khác Nhận Giao Dịch**:
   - Các node khác nhận giao dịch từ `Network` và xử lý nó.

6. **Bắt Đầu Đồng Thuận**:
   - Mỗi `Node` bắt đầu quá trình đồng thuận bằng cách lấy mẫu ngẫu nhiên `K` node để kiểm tra tính hợp lệ của giao dịch.
   - `Node` sẽ xác nhận hoặc từ chối giao dịch dựa trên mức độ tin cậy (`confidence`) được tính toán từ số lượng phiếu hợp lệ.

Biểu đồ này mô tả chi tiết các tương tác giữa các thành phần của hệ thống, từ việc khởi tạo node và mạng, đến việc xử lý giao dịch và đạt được đồng thuận.


## Đóng Góp

Hãy thoải mái gửi các issue hoặc pull request nếu bạn muốn đóng góp cho dự án. Các đóng góp luôn được hoan nghênh!

## Tài liệu tham khảo

https://docs.avax.network/protocol/avalanche-consensus