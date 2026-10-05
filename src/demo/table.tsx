import type { TableColumn, TableFilter } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { FileIcon } from "../components/FileDropzone";
import type { DemoRecord } from "./data";
const minutesAgo = (value: string) => value.includes("Vừa xong") ? 0 : parseInt(value, 10) * (value.includes("giờ") ? 60 : 1);
export const recordColumns: TableColumn<DemoRecord>[] = [
    { key: "name", label: "Tên tập tin", value: r => r.name, render: r => <span className="table-name"><FileIcon name={r.name}/>{r.name}</span> },
    { key: "type", label: "Loại", value: r => r.type, className: "table-type" },
    { key: "status", label: "Trạng thái", value: r => ({ success: "Thành công", running: "Đang chạy", warning: "Cảnh báo", error: "Lỗi", pending: "Chờ xử lý" })[r.status], render: r => <StatusBadge status={r.status}/> },
    { key: "time", label: "Thời gian", value: r => r.time, className: "table-time", compare: (a, b) => minutesAgo(a.time) - minutesAgo(b.time) },
];
export const recordFilters: TableFilter<DemoRecord>[] = [
    { key: "status", label: "Trạng thái", value: r => r.status, options: [{ value: "success", label: "Thành công" }, { value: "running", label: "Đang chạy" }, { value: "warning", label: "Cảnh báo" }, { value: "error", label: "Lỗi" }, { value: "pending", label: "Chờ xử lý" }] },
    { key: "type", label: "Loại dữ liệu", value: r => r.type, options: ["Tài liệu", "Hình ảnh", "Âm thanh", "Dữ liệu"].map(v => ({ value: v, label: v })) },
];
