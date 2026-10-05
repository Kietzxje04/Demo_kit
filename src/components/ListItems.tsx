import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";
export type ListEntry = {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    action?: string;
    onAction?: () => void;
};
export function ListItems({ items, title = "Danh sách mục" }: {
    items: ListEntry[];
    title?: string;
}) {
    return <Panel title={title} description="Tiêu đề, mô tả và thao tác theo ngữ cảnh"><div className="mt-5">{items.map(item => <div className="list-item" key={item.id}><span className="ai-avatar"><item.icon size={17}/></span><div><b>{item.title}</b><p>{item.description}</p></div>{item.onAction && <Button variant="ghost" size="sm" onClick={item.onAction}>{item.action || "Mở"}</Button>}</div>)}</div></Panel>;
}
