import { Fragment } from "react";
import { Check, LoaderCircle } from "lucide-react";
export function Stepper({ steps = ["Tiếp nhận", "Xử lý", "Kết quả"], current = 0, running = false, completed = false }: {
    steps?: string[];
    current?: number;
    running?: boolean;
    completed?: boolean;
}) {
    return <div className="stepper" aria-label="Tiến trình xử lý">{steps.map((label, i) => {
            const done = completed || i < current;
            const active = !completed && running && i === current;
            return <Fragment key={label}>{i > 0 && <span className={"step-connector " + (completed || i <= current ? "done" : "")}/>}<div className={"step " + (done ? "done" : active ? "active" : "")} aria-current={active ? "step" : undefined}><span className="step-number">{done ? <Check size={13}/> : active ? <LoaderCircle size={13} className="animate-spin"/> : i + 1}</span><span>{label}<span className="sr-only">{done ? " — Đã xong" : active ? " — Đang xử lý" : " — Chờ"}</span></span></div></Fragment>;
        })}</div>;
}
