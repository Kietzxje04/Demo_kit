# Forma — Universal Web Demo Framework

Bộ khung demo trung tính, giao diện Clean Enterprise Light. React 19, TypeScript, Tailwind CSS 4, Lucide, Shadcn/UI (Radix), Recharts. Vinext/Vite cung cấp lớp chạy và đóng gói.

## Chạy trên máy của bạn

Yêu cầu Node.js >= 22.13.0 và pnpm.

~~~bash
pnpm install --frozen-lockfile
pnpm dev
~~~

Lệnh kiểm tra và dựng:

~~~bash
pnpm exec tsc --noEmit
pnpm build
~~~

Các lệnh chuẩn hoạt động độc lập với phiên tạo demo này. Mã nguồn có sẵn package lock và các script cấu hình runtime.

## Cấu trúc

| Đường dẫn | Vai trò |
| --- | --- |
| src/App.tsx | Dashboard, các màn hình demo và phần ghép component |
| src/components/ | Các module kit độc lập, export qua index.ts |
| src/components/ui/ | Primitive Shadcn/UI có sẵn |
| src/config.ts | Tên ứng dụng, phiên bản và cấu hình chung |
| src/demo/ | Dữ liệu và adapter phản hồi mẫu |
| src/hooks/ | Điều phối quy trình mẫu và tích hợp WebMCP tùy chọn |
| src/lib/utils.ts | Sao chép, tải xuống và định dạng dung lượng |
| app/globals.css | Tailwind, token sáng/tối và bố cục responsive |
| app/page.tsx | Điểm vào ứng dụng |

## Bảy nhóm linh kiện

1. App shell: sidebar thu gọn, điều hướng, theme, thao tác chạy/làm mới/xuất.
2. Chat: vai trò, Markdown an toàn, code copy, typing, details, citations, file, micro, send/stop và prompt chips.
3. Tập tin: kéo thả, danh sách và xóa; văn bản phân trang, PDF qua trình xem của browser; hình ảnh có zoom; audio phát/tạm dừng/tua.
4. Dữ liệu: DataTable generic, tìm kiếm, lọc theo cột, sắp xếp, phân trang, xuất CSV/JSON; ListItems với callback thao tác.
5. Chỉ số: MetricCard, biểu đồ area/line, bar và donut tương tác qua Recharts.
6. Quy trình: Stepper, progress, console copy, năm trạng thái; chạy, dừng và đặt lại.
7. Điều khiển: Input, Select, Slider, Switch, bốn toast, Dialog và Sheet.

## Dùng component cho dữ liệu của bạn

~~~tsx
import { DataTable, type TableColumn } from "./components";

type Row = { id: string; title: string; count: number };
const columns: TableColumn<Row>[] = [
  { key: "title", label: "Tiêu đề", value: row => row.title },
  {
    key: "count",
    label: "Số lượng",
    value: row => String(row.count),
    compare: (a, b) => a.count - b.count,
  },
];

<DataTable
  data={rows}
  columns={columns}
  rowKey={row => row.id}
  onDetails={row => setSelectedRow(row)}
/>;
~~~

Component nhận props và callback; không chứa một mô hình nghiệp vụ cụ thể. Bạn có thể thay dữ liệu mẫu bằng dữ liệu thật mà không đổi giao diện bảng.

## Kết nối trợ lý

~~~tsx
import { ChatBlock, type ReplyHandler } from "./components";

const respond: ReplyHandler = async (text, files, signal) => {
  const body = new FormData();
  body.append("message", text);
  files.forEach(file => body.append("files", file));
  const response = await fetch("/api/assistant", {
    method: "POST",
    body,
    signal,
  });
  if (!response.ok) throw new Error("Không thể tạo phản hồi");
  return response.json();
};

<ChatBlock initialMessages={[]} respond={respond} />;
~~~

Đây là ví dụ tích hợp; demo không triển khai endpoint AI. Adapter trong src/demo/assistant.ts chỉ mô phỏng phản hồi và hỗ trợ hủy qua AbortSignal.

## Tùy biến thương hiệu và theme

- Đổi appConfig.name trong src/config.ts. Cài đặt trong UI thay tên trên thiết bị hiện tại.
- Đổi token trong :root và .dark ở app/globals.css.
- Theme mặc định là light, lựa chọn theme và tên được lưu cục bộ.
- Sidebar có phím tắt Ctrl/Cmd+B. Ctrl/Cmd+K mở thư viện component.
- Các dialog và drawer hỗ trợ Escape, focus trap và trả focus về trigger.
- Chuyển động tôn trọng prefers-reduced-motion.

## Phạm vi mô phỏng

Dữ liệu biểu đồ và bảng là dữ liệu mẫu. Quy trình xử lý cập nhật trạng thái, log và thêm một dòng kết quả mẫu; không xử lý nghiệp vụ thật.

Tập tin được giữ trong bộ nhớ component trên browser; không tải lên máy chủ và không lưu bền vững. Định dạng PDF dùng khả năng xem PDF của trình duyệt. DOC/DOCX/XLSX được quản lý và tải xuống nhưng cần viewer riêng để xem trước. Micro cần quyền người dùng và browser hỗ trợ MediaRecorder.

Markdown hỗ trợ tiêu đề, đoạn văn, danh sách, in đậm, inline code, liên kết HTTP(S) và code fence; không đánh giá HTML thô.

WebMCP là tích hợp tùy chọn, feature-detect qua document.modelContext. Hai tool read_demo_state và navigate_demo dùng chung trạng thái giao diện, có validation input và hủy đăng ký khi unmount.

## Kiểm tra bàn giao

Kiểm tra TypeScript và bản dựng production phải thành công trước khi bàn giao. Preview browser của môi trường tạo demo không khả dụng; kiểm thử trực quan và WebMCP trong browser được ghi nhận là chưa thực hiện. Khi chạy tại máy, kiểm tra thêm ở 1440px, 768px, 390px và mức zoom 200%.
