"use client";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import type { LogEntry } from "../components/LogConsole";
const makeLog = (message: string, level: LogEntry["level"] = "info"): LogEntry => ({ id: crypto.randomUUID(), time: new Date().toLocaleTimeString("vi-VN", { hour12: false }), level, message });
const initialLogs: LogEntry[] = [{ id: "init", time: "--:--:--", level: "info", message: "Demo workspace đã sẵn sàng." }, { id: "ready", time: "--:--:--", level: "info", message: "Bấm Chạy xử lý để bắt đầu quy trình mô phỏng." }];
export function useDemoProcess(onComplete: () => void) {
    const [running, setRunning] = useState(false);
    const [current, setCurrent] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [logs, setLogs] = useState(initialLogs);
    const [progress, setProgress] = useState(0);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);
    const active = useRef(false);
    const completeRef = useRef(onComplete);
    completeRef.current = onComplete;
    const clear = () => { if (timer.current)
        clearInterval(timer.current); timer.current = null; };
    useEffect(() => () => clear(), []);
    const stop = () => { clear(); active.current = false; setRunning(false); setLogs(l => [...l, makeLog("Đã dừng theo yêu cầu người dùng.", "warning")]); toast.info("Đã dừng quy trình"); };
    const reset = () => { clear(); active.current = false; setRunning(false); setCurrent(0); setCompleted(false); setProgress(0); setLogs(initialLogs); };
    const run = () => {
        if (active.current)
            return;
        active.current = true;
        clear();
        setRunning(true);
        setCompleted(false);
        setCurrent(0);
        setProgress(0);
        setLogs([makeLog("Khởi tạo quy trình demo…"), makeLog("Tiếp nhận đầu vào mẫu.")]);
        let tick = 0;
        timer.current = setInterval(() => {
            tick++;
            setProgress(Math.min(100, tick * 12.5));
            if (tick === 2) {
                setCurrent(1);
                setLogs(l => [...l, makeLog("Đầu vào hợp lệ.", "success"), makeLog("Đang chạy bước xử lý mô phỏng…")]);
            }
            if (tick === 5) {
                setCurrent(2);
                setLogs(l => [...l, makeLog("Hoàn tất xử lý.", "success"), makeLog("Chuẩn bị kết quả đầu ra…")]);
            }
            if (tick >= 8) {
                clear();
                active.current = false;
                setRunning(false);
                setCompleted(true);
                setLogs(l => [...l, makeLog("Quy trình hoàn tất. Kết quả demo đã được tạo.", "success")]);
                completeRef.current();
                toast.success("Xử lý thành công", { description: "Kết quả mẫu đã được thêm vào bảng dữ liệu." });
            }
        }, 450);
    };
    return { run, stop, reset, running, current, completed, logs, progress };
}
