"use client";
import { ImagePlus, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export function ImagePreview({ src, name = "Hình ảnh", onSelect }: {
    src?: string;
    name?: string;
    onSelect?: () => void;
}) {
    const [zoom, setZoom] = useState(1);
    return <><div className="image-preview">{src ? <img src={src} alt={name} style={{ transform: "scale(" + zoom + ")", transition: "transform .2s" }}/> : <div className="image-placeholder"><ImagePlus size={35}/><span>Thêm hình ảnh để xem trước</span>{onSelect && <Button variant="outline" onClick={onSelect}>Chọn hình ảnh</Button>}</div>}</div>{src && <div className="doc-pagination"><span>{name}</span><div className="flex items-center gap-2"><Button size="icon" variant="outline" aria-label="Thu nhỏ ảnh" disabled={zoom <= .5} onClick={() => setZoom(z => Math.max(.5, z - .25))}><ZoomOut size={15}/></Button><span>{Math.round(zoom * 100)}%</span><Button size="icon" variant="outline" aria-label="Phóng to ảnh" disabled={zoom >= 2} onClick={() => setZoom(z => Math.min(2, z + .25))}><ZoomIn size={15}/></Button></div></div>}</>;
}
