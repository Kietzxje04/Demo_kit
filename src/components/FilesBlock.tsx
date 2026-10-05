"use client";
import { useState, useEffect, useRef } from "react";
import { FileText, Image, AudioLines, Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";
import { FileDropzone, type UploadedFile } from "./FileDropzone";
import { DocumentViewer, type DocumentPage } from "./DocumentViewer";
import { AudioPlayer } from "./AudioPlayer";
import { ImagePreview } from "./ImagePreview";
import { downloadFile } from "../lib/utils";
import { toast } from "sonner";
const samplePages: DocumentPage[] = [
    { title: "Tài liệu mẫu", content: "Một không gian để khám phá, thử nghiệm và trình diễn.\nKhung xem trước này có thể hiển thị tài liệu văn bản, nội dung trích xuất hoặc kết quả xử lý của bạn.\nNội dung được chia thành các trang để dễ dàng điều hướng." },
    { title: "Lắp ghép theo nhu cầu", content: "Chọn một khối đầu vào, thêm phần xử lý và kết hợp với khối kết quả.\nCác thành phần hoạt động độc lập qua props và callback, phù hợp với nhiều loại dữ liệu." },
    { title: "Bắt đầu thử nghiệm", content: "Tải lên một tài liệu TXT, CSV, JSON hoặc PDF để xem nội dung thật.\nChuyển qua Hình ảnh hoặc Âm thanh để thử các trình xem tương ứng." },
];
const seedFiles: UploadedFile[] = [{ id: "sample-doc", name: "document_sample.txt", size: 2400, type: "text/plain" }, { id: "sample-audio", name: "audio_sample.wav", size: 384044, type: "audio/wav" }];
export function FilesBlock() {
    const [files, setFiles] = useState(seedFiles);
    const [selected, setSelected] = useState<UploadedFile | null>(null);
    const [tab, setTab] = useState("document");
    const [url, setUrl] = useState<string>();
    const [pages, setPages] = useState(samplePages);
    const imageInput = useRef<HTMLInputElement>(null);
    useEffect(() => {
        let stale = false;
        let objectUrl: string | undefined;
        setUrl(undefined);
        setPages(samplePages);
        if (selected?.file) {
            objectUrl = URL.createObjectURL(selected.file);
            setUrl(objectUrl);
            if (/\.(txt|md|csv|json)$/i.test(selected.name))
                selected.file.text().then(text => {
                    if (stale)
                        return;
                    const chunks = text.match(/[\s\S]{1,1400}/g) || [""];
                    setPages(chunks.map((content, i) => ({ title: selected.name + " · " + (i + 1), content })));
                }).catch(() => { if (!stale)
                    setPages([{ title: "Không thể đọc tập tin", content: "Vui lòng chọn một tập tin văn bản hợp lệ." }]); });
        }
        return () => { stale = true; if (objectUrl)
            URL.revokeObjectURL(objectUrl); };
    }, [selected]);
    const preview = (f: UploadedFile) => { setSelected(f); setTab(f.type.startsWith("image") || /\.(png|jpe?g|webp|gif)$/i.test(f.name) ? "image" : f.type.startsWith("audio") || /\.(mp3|wav|m4a|ogg|webm)$/i.test(f.name) ? "audio" : "document"); };
    const update = (next: UploadedFile[]) => { setFiles(next); if (selected && !next.some(f => f.id === selected.id))
        setSelected(null); };
    const isImage = !!selected && (selected.type.startsWith("image") || /\.(png|jpe?g|webp|gif)$/i.test(selected.name));
    const isAudio = !!selected && (selected.type.startsWith("audio") || /\.(mp3|wav|m4a|ogg|webm)$/i.test(selected.name));
    const isDocument = selected && !isImage && !isAudio;
    const isUnsupportedDoc = isDocument && /\.(docx?|xlsx)$/i.test(selected.name);
    return <div className="component-grid"><FileDropzone files={files} onChange={update} onPreview={preview}/><Panel title="Xem trước nội dung" description={selected?.name || "Chuyển đổi giữa tài liệu và media"}>
    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" ref={imageInput} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f && f.size <= 20 * 1024 * 1024) {
        const item = { id: crypto.randomUUID(), name: f.name, size: f.size, type: f.type, file: f };
        setFiles(a => [...a, item]);
        preview(item);
    }
    else if (f)
        toast.error("Hình ảnh vượt quá 20 MB"); e.target.value = ""; }}/>
    <Tabs value={tab} onValueChange={setTab} className="gap-0"><div className="media-tabs"><TabsList><TabsTrigger value="document"><FileText size={13}/>Tài liệu</TabsTrigger><TabsTrigger value="image"><Image size={13}/>Hình ảnh</TabsTrigger><TabsTrigger value="audio"><AudioLines size={13}/>Âm thanh</TabsTrigger></TabsList></div>
    <TabsContent value="document">{isDocument && selected.name.toLowerCase().endsWith(".pdf") && url ? <div className="p-5"><iframe title={"Xem trước " + selected.name} src={url} className="h-[340px] w-full rounded-md border"/><p className="mt-3 text-xs text-muted-foreground">Điều hướng trang qua thanh công cụ của trình xem PDF.</p></div> : isUnsupportedDoc ? <div className="empty-state"><FileText size={32}/><b>{selected?.name}</b><p className="mt-2 mb-4">Định dạng này cần ứng dụng riêng để xem trước.</p><Button variant="outline" onClick={() => selected?.file && downloadFile(selected.file, selected.name)}><Download />Tải xuống</Button></div> : <DocumentViewer key={selected?.id || "sample"} pages={isDocument ? pages : samplePages} name={isDocument ? selected.name : "document_sample.txt"}/>}</TabsContent>
    <TabsContent value="image"><ImagePreview key={selected?.id || "image"} src={isImage ? url : undefined} name={isImage ? selected?.name : undefined} onSelect={() => imageInput.current?.click()}/></TabsContent>
    <TabsContent value="audio"><AudioPlayer key={selected?.id || "audio"} src={isAudio && url ? url : "/demo-tone.wav"} name={isAudio ? selected?.name : "audio_sample.wav"}/></TabsContent></Tabs>
  </Panel></div>;
}
