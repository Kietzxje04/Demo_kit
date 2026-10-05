import { Check, LoaderCircle, AlertTriangle, X, Clock3 } from "lucide-react";
export type Status = "success" | "running" | "warning" | "error" | "pending";
const statusMap = {
    success: { text: "Thành công", icon: Check }, running: { text: "Đang chạy", icon: LoaderCircle },
    warning: { text: "Cảnh báo", icon: AlertTriangle }, error: { text: "Lỗi", icon: X }, pending: { text: "Chờ xử lý", icon: Clock3 },
};
export function StatusBadge({ status, label }: {
    status: Status;
    label?: string;
}) {
    const { text, icon: Icon } = statusMap[status];
    return <span className={"status-badge status-" + status}><Icon size={12} aria-hidden="true"/>{label || text}</span>;
}
