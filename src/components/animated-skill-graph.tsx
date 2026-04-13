"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  BaseEdge,
  getStraightPath,
  type EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* ── Custom Node ── */

function SkillNode({ data }: NodeProps) {
  const d = data as { label: string; sub?: string; active?: boolean; type?: string };
  const isRoot = d.type === "root";
  const isLeaf = d.type === "leaf";
  const active = d.active;

  return (
    <div
      className={`rounded-md border px-4 py-2 text-center transition-all duration-700 ${
        active
          ? "border-indigo-400/50 bg-indigo-500/[0.15]"
          : isRoot
            ? "border-white/[0.12] bg-white/[0.06]"
            : "border-white/[0.08] bg-white/[0.04]"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <div className={`font-mono ${isLeaf ? "text-[10px]" : "text-[12px]"} font-medium transition-colors duration-700 ${
        active ? "text-indigo-300/90" : isRoot ? "text-indigo-300/70" : "text-white/40"
      }`}>
        {d.label}
      </div>
      {d.sub && <div className="text-[10px] text-white/25">{d.sub}</div>}
      {active && d.type === "child" && (
        <div className="mt-1 animate-pulse text-[9px] text-indigo-400/60">
          context pulled
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  );
}

/* ── Custom Animated Edge ── */

function AnimatedEdge({ id, sourceX, sourceY, targetX, targetY, data, ...rest }: EdgeProps) {
  const d = data as { active?: boolean } | undefined;
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: d?.active ? "rgba(129,140,248,0.5)" : "rgba(255,255,255,0.08)",
          strokeWidth: d?.active ? 1.5 : 1,
          transition: "stroke 0.7s ease, stroke-width 0.7s ease",
        }}
      />
      {d?.active && (
        <circle r="3" fill="#818cf8" opacity="0.8">
          <animateMotion dur="1.5s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
}

const nodeTypes = { skill: SkillNode };
const edgeTypes = { animated: AnimatedEdge };

/* ── Node/Edge Definitions ── */

const initialNodes: Node[] = [
  { id: "root", type: "skill", position: { x: 310, y: 0 }, data: { label: "SKILL.md", sub: "Auth system", type: "root" } },
  { id: "oauth", type: "skill", position: { x: 40, y: 110 }, data: { label: "oauth-flow", type: "child" } },
  { id: "jwt", type: "skill", position: { x: 295, y: 110 }, data: { label: "jwt-tokens", type: "child" } },
  { id: "mw", type: "skill", position: { x: 550, y: 110 }, data: { label: "middleware", type: "child" } },
  { id: "google", type: "skill", position: { x: -20, y: 220 }, data: { label: "google-sso", type: "leaf" } },
  { id: "github", type: "skill", position: { x: 120, y: 220 }, data: { label: "github-oauth", type: "leaf" } },
  { id: "refresh", type: "skill", position: { x: 240, y: 220 }, data: { label: "refresh-flow", type: "leaf" } },
  { id: "verify", type: "skill", position: { x: 380, y: 220 }, data: { label: "verify", type: "leaf" } },
  { id: "rate", type: "skill", position: { x: 500, y: 220 }, data: { label: "rate-limit", type: "leaf" } },
  { id: "cors", type: "skill", position: { x: 640, y: 220 }, data: { label: "cors-policy", type: "leaf" } },
];

const initialEdges: Edge[] = [
  { id: "e-root-oauth", source: "root", target: "oauth", type: "animated" },
  { id: "e-root-jwt", source: "root", target: "jwt", type: "animated" },
  { id: "e-root-mw", source: "root", target: "mw", type: "animated" },
  { id: "e-oauth-google", source: "oauth", target: "google", type: "animated" },
  { id: "e-oauth-github", source: "oauth", target: "github", type: "animated" },
  { id: "e-jwt-refresh", source: "jwt", target: "refresh", type: "animated" },
  { id: "e-jwt-verify", source: "jwt", target: "verify", type: "animated" },
  { id: "e-mw-rate", source: "mw", target: "rate", type: "animated" },
  { id: "e-mw-cors", source: "mw", target: "cors", type: "animated" },
];

/* ── Inner graph component (has access to useReactFlow) ── */

type Phase = "idle" | "query" | "traverse" | "found" | "response";

function SkillGraphInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphWrapperRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  const [phase, setPhase] = useState<Phase>("idle");
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const started = useRef(false);

  const past = useCallback(
    (target: Phase) => {
      const order: Phase[] = ["idle", "query", "traverse", "found", "response"];
      return order.indexOf(phase) >= order.indexOf(target);
    },
    [phase]
  );

  // Re-fit on container resize
  useEffect(() => {
    const el = graphWrapperRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      fitView({ padding: 0.15, duration: 200 });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [fitView]);

  // Trigger animation on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();
          setTimeout(() => setPhase("query"), 300);
          setTimeout(() => setPhase("traverse"), 1200);
          setTimeout(() => setPhase("found"), 2200);
          setTimeout(() => setPhase("response"), 3000);
        }
      },
      { threshold: 0.1, rootMargin: "-80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Update nodes/edges when phase changes
  useEffect(() => {
    const activeNodeIds = past("found") ? new Set(["root", "jwt", "refresh", "verify"]) : past("traverse") ? new Set(["root"]) : new Set<string>();
    const activeEdgeIds = past("traverse")
      ? new Set(past("found") ? ["e-root-jwt", "e-jwt-refresh", "e-jwt-verify"] : ["e-root-jwt"])
      : new Set<string>();

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, active: activeNodeIds.has(n.id) },
      }))
    );

    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        data: { ...e.data, active: activeEdgeIds.has(e.id) },
      }))
    );
  }, [phase, past, setNodes, setEdges]);

  return (
    <div ref={containerRef}>
      <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
        Skill Graph
      </span>

      {/* Query */}
      <div
        className={`mb-3 rounded-md border px-3 py-1.5 font-mono text-[10px] transition-all duration-500 ${
          past("query")
            ? "border-indigo-500/25 bg-indigo-500/[0.05] text-white/50 opacity-100"
            : "border-white/[0.06] text-white/20 opacity-0"
        }`}
      >
        <span className="text-indigo-400/50 mr-2">$</span>
        How does JWT verification work?
      </div>

      {/* React Flow graph */}
      <div ref={graphWrapperRef} className="pointer-events-none h-[220px] w-full overflow-hidden rounded-md sm:h-[260px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.15, minZoom: 0.3, maxZoom: 1 }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          className="!bg-transparent"
        />
      </div>

      {/* Response */}
      <div
        className={`mt-3 rounded-md border px-3 py-1.5 font-mono text-[10px] transition-all duration-500 ${
          past("response")
            ? "border-emerald-500/20 bg-emerald-500/[0.05] text-white/50 opacity-100 translate-y-0"
            : "border-transparent text-white/20 opacity-0 translate-y-2"
        }`}
      >
        <span className="text-emerald-400/50 mr-2">←</span>
        JWT tokens are verified via <span className="text-emerald-400/60">verifyJWT(token, SECRET)</span> in auth middleware...
      </div>
    </div>
  );
}

/* ── Exported wrapper with ReactFlowProvider ── */

export function AnimatedSkillGraph() {
  return (
    <ReactFlowProvider>
      <SkillGraphInner />
    </ReactFlowProvider>
  );
}
