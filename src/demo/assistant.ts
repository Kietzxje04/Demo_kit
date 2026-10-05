import type { ChatMessageData } from "../components/ChatMessage";
import type { ReplyHandler } from "../components/ChatBlock";
const fence = String.fromCharCode(96).repeat(3);
export const sampleMessages: ChatMessageData[] = [
    { id: "welcome", role: "user", content: "Tôi có thể bắt đầu demo như thế nào?" },
    { id: "intro", role: "assistant", content: "### Sẵn sàng cho ý tưởng của bạn\nBạn có thể thử các khối độc lập:\n- **Tập tin & media:** tải và xem trước nội dung.\n- **Bảng dữ liệu:** tìm kiếm, sắp xếp và xuất kết quả.\n- **Quy trình:** theo dõi từng bước và nhật ký.\n\n" + fence + "json\n{\n  \"status\": \"ready\",\n  \"mode\": \"demo\"\n}\n" + fence, details: ["Tiếp nhận yêu cầu mẫu", "Chuẩn bị các khối giao diện", "Hoàn tất phản hồi minh họa"], citations: [{ title: "Hướng dẫn bắt đầu", description: "Các component nhận dữ liệu và callback qua props. Thay hàm respond bằng dịch vụ của bạn để kết nối trợ lý, hoặc truyền cấu hình cột vào DataTable để sử dụng với bất kỳ bộ dữ liệu nào." }] },
];
/** Deliberately local demo adapter. Replace with your API, respecting AbortSignal. */
export const demoReply: ReplyHandler = async (text, files, signal) => {
    await new Promise<void>((resolve, reject) => { const timer = setTimeout(resolve, 1400); signal.addEventListener("abort", () => { clearTimeout(timer); reject(new DOMException("Aborted", "AbortError")); }, { once: true }); });
    const topic = text.toLowerCase();
    const content = files.length ? "**Đã nhận " + files.length + " tập tin.**\nĐây là phản hồi mẫu để thử giao diện đính kèm. Tập tin được giữ trong phiên demo hiện tại." : topic.includes("quy trình") ? "### Quy trình mẫu\n1. Tiếp nhận đầu vào\n2. Chạy xử lý\n3. Trả kết quả\nMở **Quy trình & logs** và bấm **Chạy xử lý** để theo dõi từng bước." : topic.includes("dữ liệu") ? "**Sẵn sàng khám phá dữ liệu.**\nMở Bảng dữ liệu để thử tìm kiếm, lọc, sắp xếp và xuất CSV hoặc JSON." : topic.includes("tài liệu") ? "**Bắt đầu với một tài liệu.**\nMở Tập tin & media, tải tập tin rồi chọn Xem trước. Đây là phản hồi minh họa; chưa kết nối mô hình AI." : "**Đã nhận yêu cầu của bạn.**\nBạn có thể tiếp tục thử trò chuyện, đính kèm tập tin hoặc chạy một quy trình mẫu. Đây là phản hồi mô phỏng của bộ demo.";
    return { content, details: ["Tiếp nhận đầu vào", "Tạo phản hồi minh họa", "Hoàn tất"], citations: [{ title: "Forma · Hướng dẫn component", description: "Trợ lý hiện sử dụng demoReply trong src/demo/assistant.ts. Hãy thay adapter này bằng API của bạn; giao diện chat, dừng, file đính kèm và Markdown tiếp tục dùng chung." }] };
};
