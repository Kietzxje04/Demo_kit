"use client";
import { useRef, useEffect } from "react";
import { Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";
import { copyText } from "../lib/utils";
export type LogEntry = {
    id: string;
    time: string;
    level: "info" | "success" | "warning" | "error";
    message: string;
};
export function LogConsole({ logs, running = false }: {
    logs: LogEntry[];
    running?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => { if (ref.current)
        ref.current.scrollTop = ref.current.scrollHeight; }, [logs]);
    return <Panel title="Nhật ký xử lý" icon={<Terminal size={16}/>} className="console-panel" action={<Button variant="ghost" size="sm" onClick={() => copyText(logs.map(l => "[" + l.time + "] [" + l.level.toUpperCase() + "] " + l.message).join("\n"))}><Copy size={12}/>Sao chép</Button>}><div className="console" ref={ref} role="log" aria-live="polite">{logs.map(l => <div key={l.id} className={"console-line " + l.level}><span className="console-time">{l.time}</span><span className="console-level">{l.level === "success" ? "DONE" : l.level === "warning" ? "WARN" : l.level.toUpperCase()}</span><span className="console-message">{l.message}</span></div>)}{running && <span className="console-cursor"/>}</div></Panel>;
}
