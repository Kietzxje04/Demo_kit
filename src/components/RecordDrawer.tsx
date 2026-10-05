"use client";
import { Download, Copy } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { FileIcon } from "./FileDropzone";
import type { DemoRecord } from "../demo/data";
import { copyText, downloadFile } from "../lib/utils";
export function RecordDrawer({ record, onClose }: {
    record: DemoRecord | null;
    onClose: () => void;
}) {
    return <Sheet open={!!record} onOpenChange={open => { if (!open)
        onClose(); }}><SheetContent className="sm:max-w-md bg-card"><SheetHeader className="p-6 border-b"><SheetTitle>Chi tiết kết quả</SheetTitle><SheetDescription>Thông tin của mục dữ liệu được chọn.</SheetDescription></SheetHeader>{record && <div className="p-6"><FileIcon name={record.name}/><h3 className="mt-4 text-lg font-semibold break-all">{record.name}</h3><div className="mt-3"><StatusBadge status={record.status}/></div><dl className="mt-6 grid grid-cols-[1fr_1.2fr] gap-x-4 gap-y-5 text-sm"><dt className="text-muted-foreground">Mã kết quả</dt><dd>{record.id}</dd><dt className="text-muted-foreground">Loại dữ liệu</dt><dd>{record.type}</dd><dt className="text-muted-foreground">Dung lượng</dt><dd>{record.size}</dd><dt className="text-muted-foreground">Thời gian</dt><dd>{record.time}</dd><dt className="text-muted-foreground">Nguồn</dt><dd>Dữ liệu mô phỏng</dd></dl><pre className="mt-7 overflow-auto rounded-lg bg-muted p-4 text-xs leading-6">{JSON.stringify(record, null, 2)}</pre><div className="flex gap-2 mt-6"><Button variant="outline" onClick={() => copyText(JSON.stringify(record, null, 2))}><Copy size={14}/>Sao chép</Button><Button onClick={() => downloadFile(JSON.stringify(record, null, 2), record.id + ".json", "application/json")}><Download size={14}/>Xuất JSON</Button></div></div>}</SheetContent></Sheet>;
}
