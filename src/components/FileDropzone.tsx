"use client";
import { useRef, useState } from "react";
import { UploadCloud, FileText, Image, AudioLines, Table2, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Panel } from "./Panel";
import { formatSize } from "../lib/utils";
export type UploadedFile = {
    id: string;
    name: string;
    size: number;
    type: string;
    file?: File;
};
export function FileIcon({ name, type = "" }: {
    name: string;
    type?: string;
}) {
    const kind = type.startsWith("image") || /\.(png|jpg|jpeg|webp)$/i.test(name) ? "image" : type.startsWith("audio") || /\.(mp3|wav|ogg|m4a|webm)$/i.test(name) ? "audio" : /\.(csv|json|xlsx)$/i.test(name) ? "data" : "";
    const Icon = kind === "image" ? Image : kind === "audio" ? AudioLines : kind === "data" ? Table2 : FileText;
    return <span className={"file-icon " + kind}><Icon size={15}/></span>;
}
export function FileDropzone({ files, onChange, onPreview, maxSizeMB = 20 }: {
    files: UploadedFile[];
    onChange: (files: UploadedFile[]) => void;
    onPreview?: (file: UploadedFile) => void;
    maxSizeMB?: number;
}) {
    const input = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const add = (incoming: File[]) => {
        const valid: UploadedFile[] = [];
        incoming.forEach(file => {
            if (file.size > maxSizeMB * 1024 * 1024) {
                toast.error(file.name + ": vượt quá " + maxSizeMB + " MB");
                return;
            }
            if (!/\.(pdf|doc|docx|txt|md|png|jpg|jpeg|webp|gif|mp3|wav|ogg|m4a|webm|csv|json|xlsx)$/i.test(file.name)) {
                toast.error(file.name + ": định dạng chưa hỗ trợ");
                return;
            }
            if (files.some(f => f.name === file.name && f.size === file.size) || valid.some(f => f.name === file.name && f.size === file.size))
                return;
            valid.push({ id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type, file });
        });
        if (valid.length) {
            onChange([...files, ...valid]);
            toast.success("Đã thêm " + valid.length + " tập tin");
            onPreview?.(valid[0]);
        }
    };
    return <Panel title="Tải tập tin" description="Một nơi cho mọi loại dữ liệu đầu vào" action={<span className="sample-label">{files.length} tập tin</span>}>
    <input ref={input} type="file" multiple accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.webp,.gif,.mp3,.wav,.ogg,.m4a,.webm,.csv,.json,.xlsx" className="hidden" onChange={e => { add(Array.from(e.target.files || [])); e.target.value = ""; }}/>
    <div className={"dropzone " + (dragging ? "dragging" : "")} role="button" tabIndex={0} aria-label="Chọn hoặc kéo thả tập tin" onClick={() => input.current?.click()} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.current?.click();
    } }} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); add(Array.from(e.dataTransfer.files)); }}><span className="upload-icon"><UploadCloud size={23}/></span><b>Kéo thả tập tin vào đây hoặc <span>chọn tập tin</span></b><p>Tài liệu, hình ảnh, âm thanh, dữ liệu · Tối đa {maxSizeMB} MB/file</p><p>Tập tin được xem trước trong trình duyệt của bạn.</p></div>
    <div className="upload-list">{files.map(f => <div className="upload-item" key={f.id}><FileIcon name={f.name} type={f.type}/><div><b>{f.name}</b><small>{formatSize(f.size)} · {f.name.split(".").pop()?.toUpperCase()}</small></div>{onPreview && <Button size="icon" variant="ghost" aria-label={"Xem trước " + f.name} onClick={() => onPreview(f)}><Eye size={14}/></Button>}<Button size="icon" variant="ghost" aria-label={"Xóa " + f.name} onClick={() => onChange(files.filter(a => a.id !== f.id))}><X size={14}/></Button></div>)}{files.length === 0 && <p className="block-note text-center">Chưa có tập tin. Thêm một tập tin để bắt đầu.</p>}</div>
  </Panel>;
}
