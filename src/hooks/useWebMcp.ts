"use client";
import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import type { View } from "../config";
type DemoState = {
    view: View;
    brand: string;
    running: boolean;
    recordCount: number;
};
type ModelTool = {
    name: string;
    title: string;
    description: string;
    inputSchema: object;
    annotations: {
        readOnlyHint: boolean;
        untrustedContentHint: boolean;
    };
    execute: (input: unknown) => unknown;
};
type ModelContext = {
    registerTool: (tool: ModelTool, options: {
        signal: AbortSignal;
    }) => void | Promise<void>;
};
const views: View[] = ["overview", "library", "chat", "files", "data", "charts", "process", "controls", "docs"];
export function useWebMcp(state: DemoState, onView: (view: View) => void) {
    const live = useRef({ state, onView });
    live.current = { state, onView };
    useEffect(() => {
        const context = (document as Document & {
            modelContext?: ModelContext;
        }).modelContext;
        if (!context?.registerTool)
            return;
        const lifecycle = new AbortController();
        const register = (tool: ModelTool) => { try {
            void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => console.info("Optional WebMCP registration unavailable"));
        }
        catch {
            console.info("Optional WebMCP registration unavailable");
        } };
        register({ name: "read_demo_state", title: "Đọc trạng thái demo", description: "Read the visible workspace view, brand, process status and record count.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: (input) => { if (typeof input !== "object" || input === null || Array.isArray(input) || Object.keys(input).length)
                throw new Error("Expected an empty object."); return live.current.state; } });
        register({ name: "navigate_demo", title: "Mở màn hình demo", description: "Navigate to an existing demo screen. Does not run processing or modify records.", inputSchema: { type: "object", properties: { view: { type: "string", enum: views } }, required: ["view"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: (input) => { if (typeof input !== "object" || input === null || Array.isArray(input) || Object.keys(input).length !== 1 || !("view" in input) || !views.includes(input.view as View))
                throw new Error("Invalid demo view."); const view = input.view as View; flushSync(() => live.current.onView(view)); return { view: live.current.state.view }; } });
        return () => lifecycle.abort();
    }, []);
}
