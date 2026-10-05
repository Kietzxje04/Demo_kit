import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
export type MetricProps = {
    label: string;
    value: string;
    unit?: string;
    change?: string;
    decreasing?: boolean;
    detail?: string;
    icon: LucideIcon;
    tone?: string;
};
export function MetricCard({ label, value, unit, change, decreasing, detail, icon: Icon, tone = "purple" }: MetricProps) {
    return <div className="metric-card"><div className="metric-label">{label}<span className={"metric-icon tone-" + tone}><Icon size={17}/></span></div><div className="metric-value">{value}<span>{unit}</span></div><div className="metric-foot">{change && <span className="metric-change">{decreasing ? <TrendingDown size={13}/> : <TrendingUp size={13}/>}{change}</span>}<span>{detail || "so với tuần trước"}</span></div></div>;
}
