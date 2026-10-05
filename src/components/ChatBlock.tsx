"use client";
import { useRef, useState, useEffect } from "react";
import { Sparkles, FileText, ChartNoAxesCombined, Workflow, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";
import { ChatComposer } from "./ChatComposer";
import { ChatMessage, TypingIndicator, type ChatMessageData } from "./ChatMessage";
import { Markdown } from "./Markdown";
export type ReplyHandler = (text: string, files: File[], signal: AbortSignal) => Promise<Omit<ChatMessageData, "id" | "role">>;
const prompts = [{ text: "Tóm tắt tài liệu", icon: FileText }, { text: "Phân tích dữ liệu", icon: ChartNoAxesCombined }, { text: "Tạo quy trình", icon: Workflow }];
export function PromptChips({ onSelect }: {
    onSelect: (text: string) => void;
}) {
    return <div className="prompt-chips">{prompts.map(p => <button key={p.text} className="prompt-chip" onClick={() => onSelect(p.text)}><p.icon size={12}/>{p.text}</button>)}</div>;
}
export function ChatBlock({ compact = false, initialMessages = [], respond }: {
    compact?: boolean;
    initialMessages?: ChatMessageData[];
    respond: ReplyHandler;
}) {
    const [messages, setMessages] = useState(initialMessages);
    const [pending, setPending] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const controller = useRef<AbortController | null>(null);
    const feed = useRef<HTMLDivElement>(null);
    useEffect(() => () => controller.current?.abort(), []);
    useEffect(() => { if (feed.current)
        feed.current.scrollTop = feed.current.scrollHeight; }, [messages, pending]);
    const stop = () => { controller.current?.abort(); setPending(false); };
    const send = async (text: string, files: File[]) => {
        if (pending)
            return;
        setSuggestion("");
        const ctl = new AbortController();
        controller.current = ctl;
        setMessages(m => [...m, { id: crypto.randomUUID(), role: "user", content: text || "Tập tin đính kèm", files: files.map(f => f.name) }]);
        setPending(true);
        try {
            const result = await respond(text, files, ctl.signal);
            if (!ctl.signal.aborted)
                setMessages(m => [...m, { ...result, id: crypto.randomUUID(), role: "assistant" }]);
        }
        catch (e) {
            if (!ctl.signal.aborted)
                setMessages(m => [...m, { id: crypto.randomUUID(), role: "assistant", content: "Không thể tạo phản hồi. Vui lòng thử lại." }]);
        }
        finally {
            if (controller.current === ctl)
                setPending(false);
        }
    };
    return <Panel title={compact ? "Trợ lý demo" : "Trò chuyện với trợ lý"} description={compact ? "Thử một tương tác, khám phá khả năng" : "Markdown, nguồn trích dẫn và phản hồi tương tác"} icon={<Sparkles size={16} className="text-primary"/>} className={compact ? "dashboard-assistant" : "chat-full"} action={!compact ? <Button variant="ghost" size="icon" aria-label="Xóa cuộc trò chuyện" onClick={() => { stop(); setMessages([]); }}><Trash2 size={15}/></Button> : <span className="sample-label">AI</span>}>
    {compact && <div className="assistant-intro"><span className="ai-avatar"><Sparkles size={16}/></span><div><b>Xin chào, tôi có thể giúp gì?</b><p>Chọn một gợi ý bên dưới hoặc nhập yêu cầu để bắt đầu trải nghiệm.</p></div></div>}
    {!compact && <div className="chat-feed" ref={feed}>{messages.length === 0 && <div className="empty-state"><Sparkles size={28}/>Bắt đầu bằng một câu hỏi hoặc đính kèm tập tin.</div>}{messages.map(m => <ChatMessage key={m.id} message={m}/>)}{pending && <div className="chat-message"><span className="message-avatar"><Sparkles size={16}/></span><TypingIndicator /></div>}</div>}
    <PromptChips onSelect={text => { setSuggestion(""); setTimeout(() => setSuggestion(text), 0); }}/>
    <div className={compact ? "mini-chat" : ""}>{compact && messages.length > 0 && <div className="assistant-reply">{pending ? <TypingIndicator /> : <Markdown content={messages[messages.length - 1].content}/>}</div>}<ChatComposer onSend={send} pending={pending} onStop={stop} defaultText={suggestion}/>{compact && <div className="mini-chat-note">Phản hồi mô phỏng · Enter để gửi</div>}</div>
  </Panel>;
}
