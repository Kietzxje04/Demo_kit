"use client";
import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";
export type DemoConfiguration = {
    name: string;
    mode: string;
    detail: number;
    showDetails: boolean;
    notify: boolean;
};
const defaults: DemoConfiguration = { name: "Demo configuration", mode: "standard", detail: 75, showDetails: true, notify: true };
export function FormControls({ onApply }: {
    onApply?: (config: DemoConfiguration) => void;
}) {
    const [value, setValue] = useState(defaults);
    const [saved, setSaved] = useState<DemoConfiguration | null>(null);
    const [error, setError] = useState("");
    const patch = (v: Partial<DemoConfiguration>) => setValue(a => ({ ...a, ...v }));
    return <Panel title="Bộ điều khiển form" description="Input, select, slider và switch"><form className="content-pad" onSubmit={e => { e.preventDefault(); if (!value.name.trim()) {
        setError("Vui lòng nhập tên cấu hình.");
        return;
    } setError(""); const next = { ...value, name: value.name.trim() }; setSaved(next); onApply?.(next); if (value.notify)
        toast.success("Đã áp dụng cấu hình"); }}>
    <div className="field-group"><Label className="field-label" htmlFor="config-name">Tên cấu hình</Label><Input id="config-name" value={value.name} onChange={e => { patch({ name: e.target.value }); setError(""); }} maxLength={60} aria-invalid={!!error} aria-describedby={error ? "config-error" : undefined}/>{error && <p id="config-error" className="!text-destructive">{error}</p>}</div>
    <div className="field-group"><Label className="field-label" htmlFor="config-mode">Chế độ hiển thị</Label><Select value={value.mode} onValueChange={mode => patch({ mode })}><SelectTrigger id="config-mode" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="standard">Tiêu chuẩn</SelectItem><SelectItem value="detailed">Chi tiết</SelectItem><SelectItem value="minimal">Tối giản</SelectItem></SelectContent></Select></div>
    <div className="field-group"><Label className="field-label" htmlFor="config-detail">Mức độ chi tiết<span className="text-primary">{value.detail}%</span></Label><Slider id="config-detail" value={[value.detail]} min={0} max={100} step={5} onValueChange={v => patch({ detail: v[0] })} aria-label="Mức độ chi tiết"/><p>Điều chỉnh phạm vi từ 0 đến 100.</p></div>
    <div className="field-group flex items-center justify-between"><div><Label htmlFor="config-show" className="text-sm">Hiển thị thông tin bổ sung</Label><p className="text-xs text-muted-foreground mt-1">Thêm phần chi tiết trong bản xem trước.</p></div><Switch id="config-show" checked={value.showDetails} onCheckedChange={showDetails => patch({ showDetails })}/></div>
    <div className="field-group flex items-center justify-between"><Label htmlFor="config-notify" className="text-sm">Thông báo khi áp dụng</Label><Switch id="config-notify" checked={value.notify} onCheckedChange={notify => patch({ notify })}/></div>
    <div className="flex items-center gap-2"><Button type="submit"><Save size={14}/>Áp dụng</Button><Button type="button" variant="outline" onClick={() => { setValue(defaults); setSaved(null); setError(""); }}><RotateCcw size={14}/>Đặt lại</Button></div>
    {saved && <div className="mt-5 rounded-lg border bg-muted p-4" aria-live="polite"><b className="text-sm">{saved.name}</b><p className="text-xs text-muted-foreground mt-2">Chế độ: {saved.mode === "standard" ? "Tiêu chuẩn" : saved.mode === "detailed" ? "Chi tiết" : "Tối giản"} · Chi tiết {saved.detail}%</p>{saved.showDetails && <pre className="mt-3 overflow-auto text-xs leading-6">{JSON.stringify(saved, null, 2)}</pre>}</div>}
  </form></Panel>;
}
