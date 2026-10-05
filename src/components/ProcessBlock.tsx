"use client";
import { Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Panel } from "./Panel";
import { Stepper } from "./Stepper";
import { LogConsole, type LogEntry } from "./LogConsole";
import { StatusBadge, type Status } from "./StatusBadge";
export type ProcessController = {
    run: () => void;
    stop: () => void;
    reset: () => void;
    running: boolean;
    current: number;
    completed: boolean;
    logs: LogEntry[];
    progress: number;
};
export function ProcessBlock({ process }: {
    process: ProcessController;
}) {
    const status: Status = process.running ? "running" : process.completed ? "success" : "pending";
    return <><div className="component-grid"><Panel title="Quy trình từng bước" description="Mô phỏng một luồng xử lý trung tính" action={<StatusBadge status={status}/>}><Stepper current={process.current} running={process.running} completed={process.completed}/><div className="process-body"><div className="process-progress"><span>{process.running ? "Đang xử lý…" : process.completed ? "Đã hoàn tất" : "Sẵn sàng bắt đầu"}</span><b>{process.progress}%</b></div><Progress value={process.progress} aria-label="Phần trăm hoàn tất"/><div className="process-toolbar">{process.running ? <Button onClick={process.stop} variant="outline"><Square size={14}/>Dừng xử lý</Button> : <Button onClick={process.run}><Play size={14}/>Chạy xử lý</Button>}<Button variant="outline" onClick={process.reset}><RotateCcw size={14}/>Đặt lại</Button></div><p className="mt-4 text-xs text-muted-foreground">Mỗi bước cập nhật tiến trình và nhật ký theo thời gian.</p></div></Panel><LogConsole logs={process.logs} running={process.running}/></div><div className="mt-6"><Panel title="Nhãn trạng thái" description="Một ngôn ngữ trạng thái thống nhất"><div className="badge-group">{(["success", "running", "warning", "error", "pending"] as Status[]).map(s => <StatusBadge key={s} status={s}/>)}</div></Panel></div></>;
}
