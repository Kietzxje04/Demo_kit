"use client";
import { useRef, useState, useEffect } from "react";
import { Paperclip, Mic, Send, Square, X, AudioLines } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
export function ChatComposer({ onSend, pending = false, onStop, placeholder = "Nhập tin nhắn hoặc đặt câu hỏi…", defaultText = "" }: {
    onSend: (text: string, files: File[]) => void;
    pending?: boolean;
    onStop?: () => void;
    placeholder?: string;
    defaultText?: string;
}) {
    const [text, setText] = useState(defaultText);
    const [files, setFiles] = useState<File[]>([]);
    const [recording, setRecording] = useState(false);
    const input = useRef<HTMLInputElement>(null);
    const recorder = useRef<MediaRecorder | null>(null);
    const stream = useRef<MediaStream | null>(null);
    const mounted = useRef(true);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (recorder.current?.state === "recording")
        recorder.current.stop(); stream.current?.getTracks().forEach(t => t.stop()); }; }, []);
    useEffect(() => { setText(defaultText); }, [defaultText]);
    const send = () => { if (pending || recording || (!text.trim() && files.length === 0))
        return; onSend(text.trim(), files); setText(""); setFiles([]); };
    const microphone = async () => {
        if (recording) {
            recorder.current?.stop();
            setRecording(false);
            return;
        }
        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
            toast.info("Trình duyệt này chưa hỗ trợ ghi âm. Bạn có thể đính kèm tập tin âm thanh.");
            return;
        }
        try {
            const media = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!mounted.current) {
                media.getTracks().forEach(t => t.stop());
                return;
            }
            stream.current = media;
            const rec = new MediaRecorder(media);
            recorder.current = rec;
            const chunks: BlobPart[] = [];
            rec.ondataavailable = e => { if (e.data.size)
                chunks.push(e.data); };
            rec.onstop = () => { const blob = new Blob(chunks, { type: rec.mimeType }); if (mounted.current)
                setFiles(f => [...f, new File([blob], "recording." + (rec.mimeType.includes("mp4") ? "m4a" : "webm"), { type: rec.mimeType })]); media.getTracks().forEach(t => t.stop()); };
            rec.start();
            setRecording(true);
            toast.info("Đang ghi âm. Bấm micro lần nữa để kết thúc.");
        }
        catch {
            toast.error("Không truy cập được micro. Hãy kiểm tra quyền ghi âm của trình duyệt.");
        }
    };
    return <div className="chat-composer"><input type="file" multiple ref={input} className="hidden" onChange={e => { const selected = Array.from(e.target.files || []); const valid = selected.filter(f => f.size <= 20 * 1024 * 1024); if (valid.length < selected.length)
        toast.error("Mỗi tập tin tối đa 20 MB"); setFiles(f => [...f, ...valid]); e.target.value = ""; }}/>{files.map((f, i) => <span className="attachment-chip" key={f.name + i}>{f.type.startsWith("audio") ? <AudioLines size={12}/> : <Paperclip size={12}/>}{f.name}<button aria-label={"Xóa " + f.name} onClick={() => setFiles(a => a.filter((_, n) => n !== i))}><X size={12}/></button></span>)}
    <Textarea aria-label="Nội dung tin nhắn" placeholder={placeholder} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        send();
    } }}/>
    <div className="composer-toolbar"><div><Button variant="ghost" size="icon" aria-label="Đính kèm tập tin" disabled={pending} onClick={() => input.current?.click()}><Paperclip size={16}/></Button><Button variant="ghost" size="icon" aria-label={recording ? "Dừng ghi âm" : "Ghi âm micro"} className={recording ? "recording" : ""} disabled={pending} onClick={microphone}><Mic size={16}/></Button>{recording && <span className="text-xs text-destructive">Đang ghi âm…</span>}</div>{pending ? <Button size="icon" variant="secondary" aria-label="Dừng phản hồi" onClick={onStop}><Square size={13}/></Button> : <Button data-send size="icon" aria-label="Gửi tin nhắn" disabled={recording || (!text.trim() && files.length === 0)} onClick={send}><Send size={14}/></Button>}</div>
  </div>;
}
