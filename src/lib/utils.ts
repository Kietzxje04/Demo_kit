import { toast } from "sonner";
export function downloadFile(content: string | Blob, name: string, type = "text/plain") {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function copyText(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        toast.success("Đã sao chép vào clipboard");
    }
    catch {
        toast.error("Không thể sao chép. Vui lòng chọn và sao chép thủ công.");
    }
}
export const formatSize = (bytes: number) => bytes < 1024 * 1024 ? (bytes / 1024).toFixed(1) + " KB" : (bytes / (1024 * 1024)).toFixed(1) + " MB";
