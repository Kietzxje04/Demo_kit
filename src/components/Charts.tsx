"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CalendarDays } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Panel } from "./Panel";
import { chartData, distribution } from "../demo/data";
export type ChartPoint = {
    label: string;
    value: number;
    previous?: number;
};
export function ActivityChart({ data = chartData, initialType = "line", controls = false }: {
    data?: ChartPoint[];
    initialType?: "line" | "bar";
    controls?: boolean;
}) {
    const [period, setPeriod] = useState("7");
    const [type, setType] = useState(initialType);
    const points = period === "14" ? [...data.map(d => ({ ...d, label: d.label + "₁", value: Math.round(d.value * .72) })), ...data] : data;
    const common = <><CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false}/><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} width={32} domain={[0, 300]} ticks={[0, 75, 150, 225, 300]}/><Tooltip contentStyle={{ borderRadius: 10, borderColor: "var(--border)", background: "var(--card)", fontSize: 13 }} labelStyle={{ color: "var(--foreground)" }} formatter={(v, name) => [v, name === "previous" ? "Tuần trước" : "Tuần này"]}/></>;
    return <Panel title="Hiệu suất xử lý" description="Số lượt xử lý theo thời gian" action={<Select value={period} onValueChange={setPeriod}><SelectTrigger className="period-select"><CalendarDays size={14}/><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">7 ngày qua</SelectItem><SelectItem value="14">14 ngày qua</SelectItem></SelectContent></Select>}>
    <div className="chart-summary"><b>1.284<span>lượt xử lý</span></b><span className="growth">+15,3% <span>so với tuần trước</span></span>{controls && <Tabs value={type} onValueChange={v => setType(v as "line" | "bar")}><TabsList><TabsTrigger value="line">Đường</TabsTrigger><TabsTrigger value="bar">Cột</TabsTrigger></TabsList></Tabs>}</div>
    <div className="activity-chart" role="img" aria-label={"Biểu đồ " + (type === "line" ? "đường" : "cột") + " số lượt xử lý, dữ liệu mẫu"}><ResponsiveContainer width="100%" height="100%">{type === "line" ? <AreaChart data={points} margin={{ top: 12, right: 10, bottom: 12, left: 0 }}><defs><linearGradient id="forma-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b70e8" stopOpacity={.2}/><stop offset="95%" stopColor="#8b70e8" stopOpacity={0}/></linearGradient></defs>{common}<Area type="monotone" dataKey="previous" stroke="#cbc6dc" fill="transparent" strokeDasharray="5 5" strokeWidth={2}/><Area type="monotone" dataKey="value" stroke="#8062e0" fill="url(#forma-chart-fill)" strokeWidth={3} activeDot={{ r: 5, stroke: "var(--card)", strokeWidth: 3 }}/></AreaChart> : <BarChart data={points} margin={{ top: 12, right: 10, bottom: 12, left: 0 }}>{common}<Bar dataKey="previous" fill="#e2dafa" radius={[4, 4, 0, 0]}/><Bar dataKey="value" fill="#8062e0" radius={[4, 4, 0, 0]}/></BarChart>}</ResponsiveContainer></div>
    <div className="chart-legend"><span><i style={{ background: "#8062e0" }}/>Tuần này</span><span><i style={{ background: "#c5bfd7" }}/>Tuần trước</span><small>Dữ liệu mẫu</small></div>
  </Panel>;
}
export function DistributionChart({ data = distribution }: {
    data?: {
        name: string;
        value: number;
        color: string;
    }[];
}) {
    return <Panel title="Phân bổ dữ liệu" description="Theo loại dữ liệu đầu vào" action={<span className="sample-label">Mẫu</span>}><div className="donut-container" role="img" aria-label="Biểu đồ tròn: tài liệu 48%, hình ảnh 32%, âm thanh 20%"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={70} outerRadius={91} paddingAngle={3} stroke="none" cornerRadius={4} startAngle={90} endAngle={-270}>{data.map(d => <Cell key={d.name} fill={d.color}/>)}</Pie><Tooltip contentStyle={{ borderRadius: 8, background: "var(--card)", borderColor: "var(--border)" }} formatter={v => [v + "%", "Tỷ lệ"]}/></PieChart></ResponsiveContainer><div className="donut-center"><b>1.284</b><span>Tổng đầu vào</span></div></div><div className="donut-legend">{data.map(d => <div key={d.name}><span><i style={{ background: d.color }}/>{d.name}</span><b>{d.value}%</b></div>)}</div></Panel>;
}
