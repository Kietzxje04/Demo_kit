import type { Status } from "../components/StatusBadge";
export type DemoRecord = {
    id: string;
    name: string;
    type: string;
    status: Status;
    size: string;
    time: string;
};
export const demoRecords: DemoRecord[] = [
    { id: "DEMO-001", name: "document_sample.pdf", type: "Tài liệu", status: "success", size: "2.4 MB", time: "2 phút trước" },
    { id: "DEMO-002", name: "image_sample.png", type: "Hình ảnh", status: "success", size: "1.8 MB", time: "5 phút trước" },
    { id: "DEMO-003", name: "audio_sample.wav", type: "Âm thanh", status: "running", size: "8.2 MB", time: "8 phút trước" },
    { id: "DEMO-004", name: "dataset_sample.csv", type: "Dữ liệu", status: "warning", size: "456 KB", time: "12 phút trước" },
    { id: "DEMO-005", name: "document_02.pdf", type: "Tài liệu", status: "success", size: "3.1 MB", time: "15 phút trước" },
    { id: "DEMO-006", name: "image_02.jpg", type: "Hình ảnh", status: "error", size: "960 KB", time: "22 phút trước" },
    { id: "DEMO-007", name: "data_02.json", type: "Dữ liệu", status: "success", size: "124 KB", time: "28 phút trước" },
    { id: "DEMO-008", name: "audio_02.mp3", type: "Âm thanh", status: "success", size: "4.6 MB", time: "35 phút trước" },
    { id: "DEMO-009", name: "notes.txt", type: "Tài liệu", status: "pending", size: "12 KB", time: "40 phút trước" },
    { id: "DEMO-010", name: "dataset_03.csv", type: "Dữ liệu", status: "success", size: "612 KB", time: "1 giờ trước" },
];
export const chartData = [
    { label: "T2", value: 108, previous: 85 }, { label: "T3", value: 151, previous: 116 },
    { label: "T4", value: 136, previous: 97 }, { label: "T5", value: 224, previous: 145 },
    { label: "T6", value: 181, previous: 122 }, { label: "T7", value: 272, previous: 170 },
    { label: "CN", value: 212, previous: 163 },
];
export const distribution = [{ name: "Tài liệu", value: 48, color: "#7960e8" }, { name: "Hình ảnh", value: 32, color: "#b7a6f3" }, { name: "Âm thanh", value: 20, color: "#e5ddfc" }];
