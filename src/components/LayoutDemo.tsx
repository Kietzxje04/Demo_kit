"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, PanelsTopLeft } from "lucide-react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";
export function LayoutDemo() {
    const { theme, setTheme } = useTheme();
    const { state } = useSidebar();
    return <Panel title="App shell & navigation" description="Bố cục linh hoạt trên desktop và mobile" icon={<PanelsTopLeft size={17}/>}><div className="content-pad"><div className="flex items-center justify-between border-b pb-5 mb-5"><div><b className="text-sm font-medium">Sidebar có thể thu gọn</b><p className="text-xs text-muted-foreground mt-1">Hiện tại: {state === "expanded" ? "Mở rộng" : "Thu gọn"}</p></div><SidebarTrigger className="size-9" aria-label="Thử gập hoặc mở sidebar"/></div><div className="flex items-center justify-between"><div><b className="text-sm font-medium">Giao diện sáng / tối</b><p className="text-xs text-muted-foreground mt-1">Hiện tại: {theme === "dark" ? "Tối" : "Sáng"}</p></div><Button size="icon" variant="outline" aria-label="Thử đổi theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={16}/> : <Moon size={16}/>}</Button></div><p className="block-note mt-6 !mb-0">Bố cục và theme dùng chung cho toàn bộ workspace. Thử hai nút trên để xem thay đổi trực tiếp.</p></div></Panel>;
}
