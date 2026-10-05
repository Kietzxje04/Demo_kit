"use client";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Play, RotateCcw, Download, Square, Layers3, CircleCheck, Clock3, Shapes, Workflow, FolderOpen, MessageSquare, Table2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { appConfig, type View } from "./config";
import { AppShell, viewLabels } from "./components/AppShell";
import { MetricCard } from "./components/MetricCard";
import { ActivityChart, DistributionChart } from "./components/Charts";
import { DataTable, exportRows } from "./components/DataTable";
import { ChatBlock } from "./components/ChatBlock";
import { FilesBlock } from "./components/FilesBlock";
import { ProcessBlock } from "./components/ProcessBlock";
import { Stepper } from "./components/Stepper";
import { FormControls } from "./components/FormControls";
import { ToastDemo, OverlayDemo } from "./components/Overlays";
import { ListItems } from "./components/ListItems";
import { ComponentLibrary } from "./components/ComponentLibrary";
import { SettingsDialog } from "./components/SettingsDialog";
import { ExportDialog } from "./components/ExportDialog";
import { RecordDrawer } from "./components/RecordDrawer";
import { Documentation } from "./components/Documentation";
import { demoRecords, type DemoRecord } from "./demo/data";
import { recordColumns, recordFilters } from "./demo/table";
import { sampleMessages, demoReply } from "./demo/assistant";
import { useDemoProcess } from "./hooks/useDemoProcess";
import { useWebMcp } from "./hooks/useWebMcp";
const descriptions: Record<View, string> = {
    overview: "Một bộ khung linh hoạt. Sẵn sàng cho mọi ý tưởng.",
    library: "Khám phá, tương tác và lắp ghép các khối giao diện theo nhu cầu.",
    chat: "Một không gian tương tác cho văn bản, tập tin và trợ lý.",
    files: "Nạp và xem trước tài liệu, hình ảnh, âm thanh ở một nơi.",
    data: "Tìm kiếm, lọc, sắp xếp và xuất bộ dữ liệu của bạn.",
    charts: "Quan sát các chỉ số và khám phá dữ liệu trực quan.",
    process: "Theo dõi từng bước xử lý, trạng thái và nhật ký.",
    controls: "Thử các điều khiển, thông báo và lớp giao diện tương tác.",
    docs: "Bắt đầu nhanh và tái sử dụng các component độc lập.",
};
function Workspace() {
    const [view, setView] = useState<View>("overview");
    const [brand, setBrand] = useState(appConfig.name);
    const [records, setRecords] = useState(demoRecords);
    const [settings, setSettings] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [detail, setDetail] = useState<DemoRecord | null>(null);
    const [resetKey, setResetKey] = useState(0);
    const [runs, setRuns] = useState(0);
    const process = useDemoProcess(() => { setRuns(n => n + 1); setRecords(r => [{ id: "DEMO-" + crypto.randomUUID().slice(0, 8).toUpperCase(), name: "demo_result_" + (r.length + 1) + ".json", type: "Dữ liệu", status: "success", size: "1.2 KB", time: "Vừa xong" }, ...r]); });
    const navigate = (v: View) => { setView(v); window.scrollTo({ top: 0, behavior: "instant" }); };
    useWebMcp({ view, brand, running: process.running, recordCount: records.length }, navigate);
    useEffect(() => { try {
        const saved = localStorage.getItem("forma-brand");
        if (saved)
            setBrand(saved);
    }
    catch { } const handler = () => setSettings(true); document.addEventListener("forma-settings", handler); return () => document.removeEventListener("forma-settings", handler); }, []);
    useEffect(() => { const key = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        navigate("library");
    } }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, []);
    const refresh = () => { process.reset(); setRecords(demoRecords); setRuns(0); setDetail(null); setResetKey(k => k + 1); toast.success("Đã làm mới dữ liệu demo"); };
    const metrics = <div className="metrics-grid"><MetricCard label="Tổng lượt xử lý" value={(1284 + runs).toLocaleString("vi-VN")} change="+15,3%" icon={Layers3}/><MetricCard label="Tỷ lệ thành công" value="98,6" unit="%" change="+2,1%" icon={CircleCheck} tone="green"/><MetricCard label="Thời gian trung bình" value="2,4" unit="s" change="−12,8%" decreasing icon={Clock3} tone="blue"/><MetricCard label="Component có sẵn" value={String(appConfig.componentCount)} detail="7 nhóm · Sẵn sàng sử dụng" icon={Shapes} tone="orange"/></div>;
    const quickItems = [{ id: "chat", title: "Trò chuyện & AI", description: "Tin nhắn và phản hồi tương tác", icon: MessageSquare, onAction: () => navigate("chat") }, { id: "files", title: "Tập tin & media", description: "Nạp và xem trước nội dung", icon: FolderOpen, onAction: () => navigate("files") }, { id: "data", title: "Bảng dữ liệu", description: "Tìm kiếm, lọc và xuất dữ liệu", icon: Table2, onAction: () => navigate("data") }];
    return <AppShell view={view} onView={navigate} brand={brand} onSettings={() => setSettings(true)}><div className="page-header"><div><div className="page-title"><h1>{view === "docs" ? "Tài liệu" : viewLabels[view]}</h1>{view === "overview" && <span className="sample-label">Workspace</span>}</div><p>{descriptions[view]}</p></div><div className="page-actions"><Button variant="outline" onClick={refresh}><RotateCcw />Làm mới</Button><Button variant="outline" onClick={() => setExportOpen(true)}><Download />Xuất kết quả</Button><Button onClick={process.running ? process.stop : process.run}>{process.running ? <Square /> : <Play />}{process.running ? "Dừng xử lý" : "Chạy xử lý"}</Button></div></div>
  <div key={resetKey}>
    {view === "overview" && <>{metrics}<div className="dashboard-grid"><ActivityChart /><DistributionChart /></div><div className="dashboard-grid"><DataTable title="Hoạt động gần đây" description="Các kết quả xử lý trong workspace" compact data={records} columns={recordColumns} rowKey={r => r.id} filters={recordFilters} onDetails={setDetail} onViewAll={() => navigate("data")}/><ChatBlock compact respond={demoReply}/></div><div className="process-overview"><div className="process-overview-label"><span><Workflow size={18}/></span><div><b>Quy trình xử lý</b><p>{process.running ? "Đang chạy mô phỏng…" : process.completed ? "Hoàn tất quy trình demo" : "Sẵn sàng cho lần chạy tiếp theo"}</p></div></div><Stepper current={process.current} running={process.running} completed={process.completed}/><Button variant="ghost" className="section-link" onClick={() => navigate("process")}>Xem nhật ký</Button></div></>}
    {view === "library" && <ComponentLibrary data={records} process={process} onDetails={setDetail} onView={navigate}/>}
    {view === "chat" && <ChatBlock initialMessages={sampleMessages} respond={demoReply}/>}
    {view === "files" && <FilesBlock />}
    {view === "data" && <div className="space-y-6"><DataTable title="Tất cả dữ liệu" description="Dữ liệu mẫu để thử các thao tác trên bảng" data={records} columns={recordColumns} rowKey={r => r.id} filters={recordFilters} onDetails={setDetail} pageSize={7}/><ListItems title="Các khối liên quan" items={quickItems}/></div>}
    {view === "charts" && <>{metrics}<div className="focus-chart-grid"><ActivityChart controls/><DistributionChart /></div><div className="mt-6"><ActivityChart initialType="bar"/></div></>}
    {view === "process" && <ProcessBlock process={process}/>}
    {view === "controls" && <div className="component-grid"><FormControls /><div className="space-y-6"><ToastDemo /><OverlayDemo /></div></div>}
    {view === "docs" && <Documentation />}
  </div><SettingsDialog open={settings} onOpenChange={setSettings} brand={brand} onBrandChange={name => { setBrand(name); try {
        localStorage.setItem("forma-brand", name);
    }
    catch { } }}/><ExportDialog open={exportOpen} onOpenChange={setExportOpen} count={records.length} onExport={f => exportRows(records, recordColumns, f)}/><RecordDrawer record={detail} onClose={() => setDetail(null)}/></AppShell>;
}
export default function App() {
    return <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="forma-theme" disableTransitionOnChange><Workspace /><Toaster position="bottom-right" richColors closeButton duration={4000}/></ThemeProvider>;
}
