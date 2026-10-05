import { Fragment, type ReactNode } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyText } from "../lib/utils";
function inline(text: string): ReactNode[] {
    const tick = String.fromCharCode(96);
    const pattern = new RegExp("(\\*\\*[^*]+\\*\\*|" + tick + "[^" + tick + "]+" + tick + "|\\[[^\\]]+\\]\\(https?:\\/\\/[^)]+\\))", "g");
    return text.split(pattern).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith(tick) && part.endsWith(tick))
            return <code key={i} className="rounded bg-accent px-1">{part.slice(1, -1)}</code>;
        const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
        if (link)
            return <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="text-primary underline">{link[1]}</a>;
        return <Fragment key={i}>{part}</Fragment>;
    });
}
export function CodeBlock({ code, language = "text" }: {
    code: string;
    language?: string;
}) {
    return <div className="markdown-code"><div className="code-toolbar"><span>{language}</span><Button variant="ghost" size="sm" onClick={() => copyText(code)}><Copy size={12}/>Sao chép</Button></div><pre><code>{code}</code></pre></div>;
}
/** Small, safe Markdown renderer: React escapes content, raw HTML is never evaluated. */
export function Markdown({ content }: {
    content: string;
}) {
    const fence = String.fromCharCode(96).repeat(3);
    const parts = content.split(fence);
    return <div className="markdown">{parts.map((part, p) => {
            if (p % 2) {
                const n = part.indexOf("\n");
                return <CodeBlock key={p} language={n >= 0 ? part.slice(0, n).trim() || "text" : "text"} code={(n >= 0 ? part.slice(n + 1) : part).trim()}/>;
            }
            const blocks: ReactNode[] = [];
            const lines = part.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line.trim())
                    continue;
                if (/^#{1,3}\s/.test(line)) {
                    blocks.push(<h3 key={i}>{inline(line.replace(/^#{1,3}\s/, ""))}</h3>);
                    continue;
                }
                if (/^[-*]\s/.test(line)) {
                    const start = i;
                    const items = [];
                    while (i < lines.length && /^[-*]\s/.test(lines[i])) {
                        items.push(<li key={i}>{inline(lines[i].slice(2))}</li>);
                        i++;
                    }
                    i--;
                    blocks.push(<ul key={start}>{items}</ul>);
                    continue;
                }
                if (/^\d+\.\s/.test(line)) {
                    const start = i;
                    const items = [];
                    while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
                        items.push(<li key={i}>{inline(lines[i].replace(/^\d+\.\s/, ""))}</li>);
                        i++;
                    }
                    i--;
                    blocks.push(<ol key={start}>{items}</ol>);
                    continue;
                }
                blocks.push(<p key={i}>{inline(line)}</p>);
            }
            return <Fragment key={p}>{blocks}</Fragment>;
        })}</div>;
}
