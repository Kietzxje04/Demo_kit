"use client";
import { Bot, User, ChevronDown, FileText, Check, Sparkles } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Markdown } from "./Markdown";
export type ChatMessageData = {
    id: string;
    role: "user" | "assistant";
    content: string;
    details?: string[];
    citations?: {
        title: string;
        description: string;
    }[];
    files?: string[];
};
export function TypingIndicator() { return <span className="typing-dots" role="status" aria-label="Đang tạo phản hồi"><span /><span /><span /></span>; }
export function CitationCard({ title, description, index }: {
    title: string;
    description: string;
    index: number;
}) {
    return <Dialog><DialogTrigger asChild><button className="citation-card"><span>{index}</span><FileText size={13}/>{title}</button></DialogTrigger><DialogContent className="kit-dialog"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Trích dẫn mẫu</DialogDescription></DialogHeader><p className="text-sm leading-7 text-muted-foreground">{description}</p></DialogContent></Dialog>;
}
export function ProcessingDetails({ steps }: {
    steps: string[];
}) {
    return <Collapsible className="processing-details"><CollapsibleTrigger><Sparkles size={12}/>Chi tiết quá trình xử lý<ChevronDown size={13}/></CollapsibleTrigger><CollapsibleContent>{steps.map(s => <p key={s} className="flex items-center gap-2 py-1"><Check size={12}/>{s}</p>)}</CollapsibleContent></Collapsible>;
}
export function ChatMessage({ message }: {
    message: ChatMessageData;
}) {
    return <div className={"chat-message " + message.role}><span className={"message-avatar " + message.role}>{message.role === "assistant" ? <Bot size={18}/> : <User size={17}/>}</span><div className="message-body"><div className="message-role">{message.role === "assistant" ? "Trợ lý demo" : "Bạn"}{message.role === "assistant" && <small>Phản hồi mẫu</small>}</div><div className="message-bubble"><Markdown content={message.content}/>{message.files?.map((f, i) => <div key={f + i} className="flex items-center gap-2 text-xs text-muted-foreground"><FileText size={12}/>{f}</div>)}</div>{message.details && <ProcessingDetails steps={message.details}/>}{message.citations?.map((c, i) => <CitationCard key={c.title} {...c} index={i + 1}/>)}</div></div>;
}
