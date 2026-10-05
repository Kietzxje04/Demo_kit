"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export type DocumentPage = {
    title: string;
    content: string;
};
export function DocumentViewer({ pages, name = "document_sample.txt" }: {
    pages: DocumentPage[];
    name?: string;
}) {
    const [page, setPage] = useState(0);
    const current = Math.min(page, Math.max(pages.length - 1, 0));
    return <><article className="document-page"><div className="doc-kicker">DOCUMENT PREVIEW · {name}</div><h3>{pages[current]?.title || "Tài liệu trống"}</h3><div className="doc-line"/>{(pages[current]?.content || "").split("\n").map((p, i) => <p key={i} className="break-words whitespace-pre-wrap">{p}</p>)}</article><div className="doc-pagination"><Button variant="outline" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)} aria-label="Trang tài liệu trước"><ChevronLeft size={14}/></Button><span>Trang {pages.length ? current + 1 : 0} / {pages.length}</span><Button variant="outline" size="sm" disabled={current >= pages.length - 1} onClick={() => setPage(current + 1)} aria-label="Trang tài liệu sau"><ChevronRight size={14}/></Button></div></>;
}
