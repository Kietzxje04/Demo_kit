"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Save } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function SettingsDialog({ open, onOpenChange, brand, onBrandChange }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brand: string;
    onBrandChange: (name: string) => void;
}) {
    const [draft, setDraft] = useState(brand);
    const { theme, setTheme } = useTheme();
    useEffect(() => { if (open)
        setDraft(brand); }, [open, brand]);
    return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="kit-dialog"><DialogHeader><DialogTitle>Cài đặt workspace</DialogTitle><DialogDescription>Cá nhân hóa thương hiệu và giao diện trên thiết bị này.</DialogDescription></DialogHeader><form onSubmit={e => { e.preventDefault(); if (!draft.trim()) {
        toast.error("Vui lòng nhập tên ứng dụng");
        return;
    } onBrandChange(draft.trim()); onOpenChange(false); toast.success("Đã lưu cài đặt workspace"); }}><div className="settings-form"><div><Label htmlFor="brand-name" className="field-label">Tên ứng dụng</Label><Input id="brand-name" value={draft} onChange={e => setDraft(e.target.value)} maxLength={20}/><p className="mt-2 text-xs text-muted-foreground">Tên xuất hiện trong sidebar. Tối đa 20 ký tự.</p></div><div><Label className="field-label">Giao diện</Label><div className="settings-theme"><Button type="button" variant={theme !== "dark" ? "secondary" : "outline"} onClick={() => setTheme("light")}><Sun size={15}/>Sáng</Button><Button type="button" variant={theme === "dark" ? "secondary" : "outline"} onClick={() => setTheme("dark")}><Moon size={15}/>Tối</Button></div></div></div><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button><Button type="submit"><Save size={14}/>Lưu cài đặt</Button></DialogFooter></form></DialogContent></Dialog>;
}
