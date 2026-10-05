"use client";
import { useState } from "react";
import { Download, FileJson, Table2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
export function ExportDialog({ open, onOpenChange, count, onExport }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    count: number;
    onExport: (format: "csv" | "json") => void;
}) {
    const [format, setFormat] = useState<"csv" | "json">("csv");
    return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="kit-dialog"><DialogHeader><DialogTitle>Xuất kết quả</DialogTitle><DialogDescription>Chọn định dạng để tải {count} dòng dữ liệu trong phiên demo.</DialogDescription></DialogHeader><RadioGroup value={format} onValueChange={v => setFormat(v as "csv" | "json")} className="my-3 gap-3">{([{ key: "csv", label: "CSV", description: "Bảng dữ liệu, tương thích Excel", icon: Table2 }, { key: "json", label: "JSON", description: "Dữ liệu cấu trúc để tích hợp", icon: FileJson }] as const).map(f => <Label key={f.key} htmlFor={"export-" + f.key} className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer"><RadioGroupItem value={f.key} id={"export-" + f.key}/><f.icon className="text-primary" size={21}/><span><b className="block text-sm font-medium">{f.label}</b><span className="text-xs text-muted-foreground">{f.description}</span></span></Label>)}</RadioGroup><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button><Button onClick={() => { onExport(format); onOpenChange(false); }}><Download size={14}/>Tải xuống {format.toUpperCase()}</Button></DialogFooter></DialogContent></Dialog>;
}
