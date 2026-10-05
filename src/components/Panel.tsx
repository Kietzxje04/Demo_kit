import type { ReactNode } from "react";
export function Panel({ title, description, action, children, className = "", icon }: {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
}) {
    return <section className={"panel " + className}><div className="panel-heading"><div><h2>{icon}{title}</h2>{description && <p>{description}</p>}</div>{action}</div>{children}</section>;
}
