"use client";
import { useState } from "react";
import { CheckCircle2, CircleX, TriangleAlert, Info, PanelRight, SquareMousePointer, Save, FileText, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Panel } from "./Panel";
import { copyText } from "../lib/utils";
export function ToastDemo() {
    return <Panel title="Thông báo nổi" description="Phản hồi tức thì cho các thao tác"><div className="toast-buttons"><Button variant="outline" onClick={() => toast.success("Thao tác thành công", { description: "Thay đổi đã được ghi nhận trong phiên demo." })}><CheckCircle2 size={15} className="text-emerald-600"/>Thành công</Button><Button variant="outline" onClick={() => toast.error("Không thể hoàn tất", { description: "Đây là thông báo lỗi mẫu. Bạn có thể thử lại." })}><CircleX size={15} className="text-red-500"/>Lỗi</Button><Button variant="outline" onClick={() => toast.warning("Cần kiểm tra lại", { description: "Một số thông tin đầu vào chưa đầy đủ." })}><TriangleAlert size={15} className="text-amber-600"/>Cảnh báo</Button><Button variant="outline" onClick={() => toast.info("Thông tin demo", { description: "Các thông báo được hiển thị trong 4 giây." })}><Info size={15} className="text-blue-500"/>Thông tin</Button></div></Panel>;
}
export function OverlayDemo() {
    const [name, setName] = useState("Bản demo của tôi");
    const [draft, setDraft] = useState(name);
    const [open, setOpen] = useState(false);
    return <Panel title="Hộp thoại & bảng chi tiết" description="Thông tin đúng lúc, không rời ngữ cảnh"><div className="overlay-actions"><Dialog open={open} onOpenChange={o => { setOpen(o); if (o)
        setDraft(name); }}><DialogTrigger asChild><Button variant="outline"><SquareMousePointer size={15}/>Mở hộp thoại</Button></DialogTrigger><DialogContent className="kit-dialog"><DialogHeader><DialogTitle>Đổi tên bản demo</DialogTitle><DialogDescription>Thử một biểu mẫu trong hộp thoại. Bấm lưu để cập nhật bản xem trước.</DialogDescription></DialogHeader><form onSubmit={e => { e.preventDefault(); if (!draft.trim()) {
        toast.error("Vui lòng nhập tên bản demo");
        return;
    } setName(draft.trim()); setOpen(false); toast.success("Đã lưu tên bản demo"); }}><Label htmlFor="overlay-name" className="mb-2 block">Tên bản demo</Label><Input id="overlay-name" value={draft} maxLength={60} onChange={e => setDraft(e.target.value)}/><DialogFooter className="mt-6"><DialogClose asChild><Button variant="outline" type="button">Hủy</Button></DialogClose><Button type="submit"><Save size={14}/>Lưu thay đổi</Button></DialogFooter></form></DialogContent></Dialog>
    <Sheet><SheetTrigger asChild><Button variant="outline"><PanelRight size={15}/>Mở bảng chi tiết</Button></SheetTrigger><SheetContent className="sm:max-w-md bg-card"><SheetHeader className="p-6 border-b"><SheetTitle>Thông tin bản demo</SheetTitle><SheetDescription>Chi tiết trong bảng trượt cạnh phải.</SheetDescription></SheetHeader><div className="p-6"><span className="ai-avatar mb-4"><FileText size={20}/></span><h3 className="font-semibold text-xl">{name}</h3><p className="text-sm text-muted-foreground mt-2 leading-7">Drawer giữ màn hình chính ở phía sau và hiển thị nội dung chi tiết theo ngữ cảnh.</p><dl className="mt-6 grid grid-cols-2 gap-4 text-sm"><dt className="text-muted-foreground">Trạng thái</dt><dd>Sẵn sàng</dd><dt className="text-muted-foreground">Chế độ</dt><dd>Demo</dd><dt className="text-muted-foreground">Tương tác</dt><dd>Keyboard & touch</dd></dl><Button className="mt-7" variant="outline" onClick={() => copyText(JSON.stringify({ name, mode: "demo", status: "ready" }, null, 2))}><Copy size={14}/>Sao chép thông tin</Button></div></SheetContent></Sheet></div><div className="px-6 pb-6 text-sm text-muted-foreground">Demo hiện tại: <b className="font-medium text-foreground">{name}</b></div></Panel>;
}
