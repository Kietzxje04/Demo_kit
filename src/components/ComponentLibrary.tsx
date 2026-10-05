"use client";
import { useState } from "react";
import { Search, LayoutDashboard, MessageSquare, FolderOpen, Table2, ChartNoAxesCombined, Workflow, SlidersHorizontal, Shapes } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatBlock } from "./ChatBlock";
import { FilesBlock } from "./FilesBlock";
import { DataTable } from "./DataTable";
import { ListItems } from "./ListItems";
import { ActivityChart, DistributionChart } from "./Charts";
import { MetricCard } from "./MetricCard";
import { ProcessBlock, type ProcessController } from "./ProcessBlock";
import { FormControls } from "./FormControls";
import { ToastDemo, OverlayDemo } from "./Overlays";
import { LayoutDemo } from "./LayoutDemo";
import { sampleMessages, demoReply } from "../demo/assistant";
import { recordColumns, recordFilters } from "../demo/table";
import type { DemoRecord } from "../demo/data";
import type { View } from "../config";
const groups = [
    { id: "layout", label: "Bố cục", icon: LayoutDashboard, count: 3, search: "app shell sidebar navigation theme toggle bố cục điều hướng" },
    { id: "chat", label: "Trò chuyện", icon: MessageSquare, count: 7, search: "chat markdown message typing citation composer prompt assistant ai" },
    { id: "files", label: "Tập tin", icon: FolderOpen, count: 4, search: "file dropzone document viewer audio player image preview media tập tin tài liệu hình ảnh âm thanh" },
    { id: "data", label: "Dữ liệu", icon: Table2, count: 2, search: "data table list items search filter pagination export bảng dữ liệu danh sách" },
    { id: "charts", label: "Biểu đồ", icon: ChartNoAxesCombined, count: 4, search: "metric kpi line bar donut charts biểu đồ chỉ số" },
    { id: "process", label: "Quy trình", icon: Workflow, count: 3, search: "stepper progress logs console badge trạng thái quy trình nhật ký" },
    { id: "controls", label: "Điều khiển", icon: SlidersHorizontal, count: 5, search: "input select slider switch toast modal dialog drawer sheet form điều khiển hộp thoại thông báo" },
];
export function ComponentLibrary({ data, process, onDetails, onView }: {
    data: DemoRecord[];
    process: ProcessController;
    onDetails: (r: DemoRecord) => void;
    onView: (v: View) => void;
}) {
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");
    const visible = groups.filter(g => (tab === "all" || g.id === tab) && (g.search + " " + g.label).toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")));
    const resources = [{ id: "chat", title: "Trò chuyện & AI", description: "Tin nhắn, Markdown và các nguồn trích dẫn", icon: MessageSquare, onAction: () => onView("chat") }, { id: "files", title: "Tập tin & media", description: "Nạp dữ liệu và xem trước nội dung", icon: FolderOpen, onAction: () => onView("files") }, { id: "process", title: "Quy trình & logs", description: "Theo dõi tiến trình và trạng thái", icon: Workflow, onAction: () => onView("process") }];
    return <><div className="component-toolbar"><div className="search-field"><Search size={15}/><Input autoFocus aria-label="Tìm component" placeholder="Tìm nhóm hoặc component…" value={search} onChange={e => setSearch(e.target.value)}/></div><span className="text-xs text-muted-foreground">28 component · 7 nhóm linh kiện</span></div><Tabs value={tab} onValueChange={setTab} className="mb-6"><TabsList variant="line" className="component-tabs"><TabsTrigger value="all">Tất cả</TabsTrigger>{groups.map(g => <TabsTrigger key={g.id} value={g.id}>{g.label}</TabsTrigger>)}</TabsList></Tabs>
    {visible.map(g => <section className="component-section" key={g.id}><div className="component-caption"><g.icon size={18}/><h2>{g.label}</h2><span>{g.count} component</span></div>
      {g.id === "layout" && <LayoutDemo />}
      {g.id === "chat" && <ChatBlock initialMessages={sampleMessages} respond={demoReply}/>}
      {g.id === "files" && <FilesBlock />}
      {g.id === "data" && <div className="space-y-5"><DataTable data={data} columns={recordColumns} rowKey={r => r.id} filters={recordFilters} onDetails={onDetails}/><ListItems items={resources}/></div>}
      {g.id === "charts" && <><div className="metrics-grid"><MetricCard label="Chỉ số mẫu" value="1.284" change="+15,3%" icon={ChartNoAxesCombined}/><MetricCard label="Tỷ lệ hoàn tất" value="98,6" unit="%" change="+2,1%" icon={Shapes} tone="green"/></div><div className="focus-chart-grid"><ActivityChart controls/><DistributionChart /></div><div className="mt-5"><ActivityChart initialType="bar"/></div></>}
      {g.id === "process" && <ProcessBlock process={process}/>}
      {g.id === "controls" && <div className="component-grid"><FormControls /><div className="space-y-5"><ToastDemo /><OverlayDemo /></div></div>}
    </section>)}
    {visible.length === 0 && <div className="panel empty-state"><Shapes size={30}/>Không có component phù hợp.<br /><Button variant="link" onClick={() => { setTab("all"); setSearch(""); }}>Xóa bộ lọc</Button></div>}
  </>;
}
