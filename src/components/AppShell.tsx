"use client";
import type { ReactNode, CSSProperties } from "react";
import { useTheme } from "next-themes";
import { LayoutDashboard, Shapes, MessageSquare, FolderOpen, Table2, ChartNoAxesCombined, Workflow, SlidersHorizontal, BookOpen, Settings2, ChevronsUpDown, Moon, Sun, ChevronRight, Layers3, Search, Sparkles, Command } from "lucide-react";
import { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { appConfig, type View } from "../config";
const navigation: {
    id: View;
    label: string;
    icon: typeof Shapes;
    count?: string;
}[] = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard }, { id: "library", label: "Thư viện component", icon: Shapes, count: String(appConfig.componentCount) },
    { id: "chat", label: "Trò chuyện & AI", icon: MessageSquare }, { id: "files", label: "Tập tin & media", icon: FolderOpen },
    { id: "data", label: "Bảng dữ liệu", icon: Table2 }, { id: "charts", label: "Biểu đồ & số liệu", icon: ChartNoAxesCombined },
    { id: "process", label: "Quy trình & logs", icon: Workflow }, { id: "controls", label: "Điều khiển & hộp thoại", icon: SlidersHorizontal },
];
export const viewLabels = Object.fromEntries(navigation.map(n => [n.id, n.label]));
function Navigation({ view, onView, brand, onSettings }: {
    view: View;
    onView: (v: View) => void;
    brand: string;
    onSettings: () => void;
}) {
    const { setOpenMobile, state } = useSidebar();
    const go = (v: View) => { onView(v); setOpenMobile(false); };
    return <Sidebar collapsible="icon" className="kit-sidebar"><SidebarHeader className="brand-header"><button className="brand" onClick={() => go("overview")} aria-label="Về tổng quan"><span className="brand-mark"><span /><span /><span /><span /></span><span className="brand-name">{brand}<span>{appConfig.description}</span></span></button></SidebarHeader>
    <SidebarContent><SidebarGroup className="nav-group"><SidebarGroupLabel className="nav-label">WORKSPACE</SidebarGroupLabel><SidebarMenu>{navigation.map(n => <SidebarMenuItem key={n.id}><SidebarMenuButton className="nav-button" isActive={view === n.id} tooltip={n.label} onClick={() => go(n.id)}><n.icon /><span>{n.label}</span>{n.count && state === "expanded" && <b className="nav-count">{n.count}</b>}</SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroup>
    <SidebarGroup className="nav-group resource-group"><SidebarGroupLabel className="nav-label">TÀI NGUYÊN</SidebarGroupLabel><SidebarMenu><SidebarMenuItem><SidebarMenuButton className="nav-button" isActive={view === "docs"} tooltip="Tài liệu" onClick={() => go("docs")}><BookOpen /><span>Tài liệu</span></SidebarMenuButton></SidebarMenuItem><SidebarMenuItem><SidebarMenuButton className="nav-button" tooltip="Cài đặt" onClick={onSettings}><Settings2 /><span>Cài đặt</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroup>
    </SidebarContent><SidebarFooter className="kit-sidebar-footer">{state === "expanded" && <div className="sidebar-note"><span className="note-icon"><Sparkles size={18}/></span><b>Một bộ khung.<br />Mọi ý tưởng.</b><p>Lắp ghép linh hoạt, demo<br />theo cách của bạn.</p><Button variant="outline" className="w-full" onClick={() => go("library")}><Shapes />Khám phá component</Button></div>}<button className="workspace-select" onClick={onSettings}><span className="workspace-icon"><Layers3 size={18}/></span>{state === "expanded" && <><span><b>Demo Workspace</b><small>Phiên bản {appConfig.version}</small></span><ChevronsUpDown size={15}/></>}</button></SidebarFooter>
  </Sidebar>;
}
function TopBar({ view, onView }: {
    view: View;
    onView: (v: View) => void;
}) {
    const { theme, setTheme } = useTheme();
    return <header className="topbar"><div className="breadcrumbs"><SidebarTrigger aria-label="Gập hoặc mở sidebar" className="sidebar-toggle"/><span className="breadcrumb-root">Workspace</span><ChevronRight size={13}/><b>{viewLabels[view] || "Tài liệu"}</b></div><div className="topbar-actions"><Button variant="ghost" className="quick-search" onClick={() => onView("library")}><Search size={15}/><span>Tìm component</span><kbd><Command size={10}/> K</kbd></Button><span className="demo-mode"><span />Chế độ demo</span><span className="topbar-divider"/><Button variant="ghost" size="icon" aria-label={theme === "dark" ? "Chuyển giao diện sáng" : "Chuyển giao diện tối"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</Button><button className="profile-avatar" aria-label="Mở cài đặt workspace" onClick={() => document.dispatchEvent(new Event("forma-settings"))}>DN</button></div></header>;
}
export function AppShell({ children, view, onView, brand, onSettings }: {
    children: ReactNode;
    view: View;
    onView: (v: View) => void;
    brand: string;
    onSettings: () => void;
}) {
    return <SidebarProvider style={{ "--sidebar-width": "15.25rem", "--sidebar-width-icon": "4rem" } as CSSProperties}><Navigation view={view} onView={onView} brand={brand} onSettings={onSettings}/><SidebarInset className="main-surface"><TopBar view={view} onView={onView}/><div className="page-content">{children}</div><footer className="app-footer"><span>Forma Universal Demo Kit <span className="footer-dot">·</span> v{appConfig.version}</span><span>Được thiết kế để thích ứng.</span></footer></SidebarInset></SidebarProvider>;
}
