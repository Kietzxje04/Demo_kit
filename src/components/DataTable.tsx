"use client";
import { useMemo, useState, type ReactNode } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, MoreHorizontal, ChevronLeft, ChevronRight, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Panel } from "./Panel";
import { downloadFile } from "../lib/utils";
import { toast } from "sonner";
export type TableColumn<T> = {
    key: string;
    label: string;
    value: (row: T) => string;
    render?: (row: T) => ReactNode;
    className?: string;
    compare?: (a: T, b: T) => number;
};
export type TableFilter<T> = {
    key: string;
    label: string;
    options: {
        value: string;
        label: string;
    }[];
    value: (row: T) => string;
};
export function exportRows<T>(rows: T[], columns: TableColumn<T>[], format: "csv" | "json") {
    if (format === "json")
        downloadFile(JSON.stringify(rows, null, 2), "demo-data.json", "application/json");
    else {
        const quote = (s: string) => '"' + (/^[=+@-]/.test(s) ? "'" : "") + s.replaceAll('"', '""') + '"';
        const content = [columns.map(c => quote(c.label)).join(","), ...rows.map(r => columns.map(c => quote(c.value(r))).join(","))].join("\r\n");
        downloadFile("\uFEFF" + content, "demo-data.csv", "text/csv;charset=utf-8");
    }
    toast.success("Đã xuất " + rows.length + " dòng dữ liệu");
}
export function DataTable<T>({ data, columns, rowKey, filters = [], pageSize = 5, title = "Bảng dữ liệu", description, compact = false, onDetails, onViewAll }: {
    data: T[];
    columns: TableColumn<T>[];
    rowKey: (row: T) => string;
    filters?: TableFilter<T>[];
    pageSize?: number;
    title?: string;
    description?: string;
    compact?: boolean;
    onDetails?: (row: T) => void;
    onViewAll?: () => void;
}) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [values, setValues] = useState<Record<string, string>>({});
    const [sort, setSort] = useState<{
        key: string;
        ascending: boolean;
    } | null>(null);
    const filtered = useMemo(() => {
        const q = search.toLocaleLowerCase("vi");
        const rows = data.filter(r => columns.some(c => c.value(r).toLocaleLowerCase("vi").includes(q)) && filters.every(f => !values[f.key] || values[f.key] === "all" || f.value(r) === values[f.key]));
        if (sort) {
            const col = columns.find(c => c.key === sort.key);
            if (col)
                rows.sort((a, b) => (col.compare ? col.compare(a, b) : col.value(a).localeCompare(col.value(b), "vi", { numeric: true })) * (sort.ascending ? 1 : -1));
        }
        return rows;
    }, [data, search, columns, filters, values, sort]);
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const current = Math.min(page, pages);
    const visible = filtered.slice((current - 1) * pageSize, current * pageSize);
    const exportMenu = <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="section-link"><Download size={13}/>Xuất dữ liệu</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => exportRows(filtered, columns, "csv")}>Xuất CSV</DropdownMenuItem><DropdownMenuItem onClick={() => exportRows(filtered, columns, "json")}>Xuất JSON</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
    return <Panel title={title} description={description} className={compact ? "dashboard-table" : ""} action={compact ? <Button variant="ghost" className="section-link" onClick={onViewAll}>Xem tất cả</Button> : exportMenu}>
    <div className="table-controls"><div className="search-field"><Search size={14}/><Input aria-label="Tìm kiếm dữ liệu" placeholder="Tìm kiếm tập tin…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/></div><div className="flex items-center gap-2">{filters.slice(0, compact ? 1 : filters.length).map(f => <Select key={f.key} value={values[f.key] || "all"} onValueChange={v => { setValues(a => ({ ...a, [f.key]: v })); setPage(1); }}><SelectTrigger aria-label={f.label} className="table-filter"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{f.label}</SelectItem>{f.options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>)}</div></div>
    <Table className="kit-table"><TableHeader><TableRow>{columns.map(c => <TableHead key={c.key} className={c.className} aria-sort={sort?.key === c.key ? sort.ascending ? "ascending" : "descending" : "none"}><button className="sort-button" onClick={() => setSort(s => ({ key: c.key, ascending: s?.key === c.key ? !s.ascending : true }))}>{c.label}{sort?.key === c.key ? sort.ascending ? <ArrowUp size={11}/> : <ArrowDown size={11}/> : <ArrowUpDown size={11}/>}</button></TableHead>)}{onDetails && <TableHead className="w-9"><span className="sr-only">Thao tác</span></TableHead>}</TableRow></TableHeader><TableBody>{visible.map(row => <TableRow key={rowKey(row)}>{columns.map(c => <TableCell key={c.key} className={c.className}>{c.render ? c.render(row) : c.value(row)}</TableCell>)}{onDetails && <TableCell><Button variant="ghost" size="icon" className="size-6" aria-label={"Xem chi tiết " + rowKey(row)} onClick={() => onDetails(row)}><MoreHorizontal size={16}/></Button></TableCell>}</TableRow>)}</TableBody></Table>
    {visible.length === 0 && <div className="empty-state"><Table2 size={26}/>Không tìm thấy dữ liệu phù hợp.<br /><Button variant="link" onClick={() => { setSearch(""); setValues({}); }}>Xóa bộ lọc</Button></div>}
    <div className="table-pagination"><span>{filtered.length ? (current - 1) * pageSize + 1 : 0}–{Math.min(current * pageSize, filtered.length)} / {filtered.length} kết quả</span><Pagination aria-label="Phân trang dữ liệu"><PaginationContent><PaginationItem><button aria-label="Trang trước" disabled={current === 1} onClick={() => setPage(current - 1)}><ChevronLeft size={13}/></button></PaginationItem>{Array.from({ length: pages }, (_, i) => i + 1).filter(n => Math.abs(n - current) <= 1 || n === 1 || n === pages).map(n => <PaginationItem key={n}><button className={n === current ? "active" : ""} aria-current={n === current ? "page" : undefined} onClick={() => setPage(n)}>{n}</button></PaginationItem>)}<PaginationItem><button aria-label="Trang sau" disabled={current === pages} onClick={() => setPage(current + 1)}><ChevronRight size={13}/></button></PaginationItem></PaginationContent></Pagination></div>
  </Panel>;
}
