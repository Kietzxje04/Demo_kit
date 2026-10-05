"use client";
import { useRef, useState, useEffect } from "react";
import { Play, Pause, AudioLines } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const time = (s: number) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
export function AudioPlayer({ src = "/demo-tone.wav", name = "audio_sample.wav" }: {
    src?: string;
    name?: string;
}) {
    const audio = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(12);
    useEffect(() => { setPlaying(false); setPosition(0); }, [src]);
    const toggle = async () => { if (!audio.current)
        return; if (playing)
        audio.current.pause();
    else {
        try {
            await audio.current.play();
        }
        catch {
            toast.error("Không thể phát tập tin âm thanh này.");
        }
    } };
    return <div className="audio-card"><audio ref={audio} src={src} preload="metadata" onLoadedMetadata={e => setDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 12)} onTimeUpdate={e => setPosition(e.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => toast.error("Định dạng âm thanh không được trình duyệt hỗ trợ.")}/><div className="audio-top"><span className="ai-avatar"><AudioLines size={21}/></span><div><b>{name}</b><p>{src === "/demo-tone.wav" ? "Âm thanh mẫu · 12 giây" : "Tập tin âm thanh của bạn"}</p></div></div><div className="audio-wave" aria-hidden="true">{Array.from({ length: 52 }, (_, i) => <span key={i} className={i / 52 < position / duration ? "played" : ""} style={{ height: 12 + Math.abs(Math.sin(i * 1.8) * Math.cos(i * .37)) * 42 }}/>)}</div><div className="audio-controls"><Button size="icon" onClick={toggle} aria-label={playing ? "Tạm dừng âm thanh" : "Phát âm thanh"}>{playing ? <Pause size={16}/> : <Play size={16}/>}</Button><span className="audio-time">{time(position)}</span><input type="range" min={0} max={duration || 12} step={.1} value={position} aria-label="Vị trí phát âm thanh" onChange={e => { const next = Number(e.target.value); if (audio.current)
        audio.current.currentTime = next; setPosition(next); }}/><span className="audio-time">{time(duration)}</span></div></div>;
}
