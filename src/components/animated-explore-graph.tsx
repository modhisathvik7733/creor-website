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

function DepNode({ data }: NodeProps) {
  const d = data as {
    label: string;
    active?: boolean;
    type?: "root" | "child" | "leaf";
  };
  const isRoot = d.type === "root";
  const active = d.active;

  return (
    <div
      className={`rounded-lg border px-3.5 py-1.5 text-center transition-all duration-700 ${
        active
          ? "border-indigo-400/50 bg-indigo-500/[0.15] shadow-[0_0_12px_rgba(129,140,248,0.15)]"
          : isRoot
            ? "border-white/[0.12] bg-white/[0.06]"
            : "border-white/[0.08] bg-white/[0.03]"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-0 !w-0 !h-0"
      />
      <div
        className={`font-mono text-[11px] font-medium transition-colors duration-700 ${
          active
            ? "text-indigo-300/90"
            : isRoot
              ? "text-indigo-300/70"
              : "text-white/40"
        }`}
      >
        {d.label}
      </div>
      {active && d.type !== "root" && (
        <div className="mt-0.5 animate-pulse text-[8px] text-indigo-400/50">
          traced
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-0 !h-0"
      />
    </div>
  );
}

/* ── Custom Animated Edge ── */

function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps) {
  const d = data as { active?: boolean } | undefined;
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: d?.active
            ? "rgba(129,140,248,0.5)"
            : "rgba(255,255,255,0.08)",
          strokeWidth: d?.active ? 1.5 : 1,
          transition: "stroke 0.7s ease, stroke-width 0.7s ease",
        }}
      />
      {d?.active && (
        <circle r="2.5" fill="#818cf8" opacity="0.8">
          <animateMotion
            dur="1.2s"
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      )}
    </>
  );
}

const nodeTypes = { dep: DepNode };
const edgeTypes = { animated: AnimatedEdge };

/* ── Node/Edge Definitions ── */

const initialNodes: Node[] = [
  {
    id: "useAuth",
    type: "dep",
    position: { x: 200, y: 0 },
    data: { label: "useAuth.ts", type: "root" },
  },
  {
    id: "session",
    type: "dep",
    position: { x: 60, y: 100 },
    data: { label: "session.ts", type: "child" },
  },
  {
    id: "token",
    type: "dep",
    position: { x: 340, y: 100 },
    data: { label: "token.ts", type: "child" },
  },
  {
    id: "db",
    type: "dep",
    position: { x: 0, y: 200 },
    data: { label: "db.ts", type: "leaf" },
  },
  {
    id: "redis",
    type: "dep",
    position: { x: 130, y: 200 },
    data: { label: "redis.ts", type: "leaf" },
  },
  {
    id: "crypto",
    type: "dep",
    position: { x: 280, y: 200 },
    data: { label: "crypto.ts", type: "leaf" },
  },
  {
    id: "jwt",
    type: "dep",
    position: { x: 410, y: 200 },
    data: { label: "jwt.ts", type: "leaf" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e-auth-session",
    source: "useAuth",
    target: "session",
    type: "animated",
  },
  {
    id: "e-auth-token",
    source: "useAuth",
    target: "token",
    type: "animated",
  },
  {
    id: "e-session-db",
    source: "session",
    target: "db",
    type: "animated",
  },
  {
    id: "e-session-redis",
    source: "session",
    target: "redis",
    type: "animated",
  },
  {
    id: "e-token-crypto",
    source: "token",
    target: "crypto",
    type: "animated",
  },
  {
    id: "e-token-jwt",
    source: "token",
    target: "jwt",
    type: "animated",
  },
];

/* ── Inner graph component ── */

type Phase = "idle" | "tracing" | "deep" | "done";

function ExploreGraphInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  const [phase, setPhase] = useState<Phase>("idle");
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const started = useRef(false);
  const cycleRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const past = useCallback(
    (target: Phase) => {
      const order: Phase[] = ["idle", "tracing", "deep", "done"];
      return order.indexOf(phase) >= order.indexOf(target);
    },
    [phase]
  );

  // Re-fit on resize
  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      fitView({ padding: 0.2, duration: 200 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fitView]);

  // Animation cycle
  const runCycle = useCallback(() => {
    cycleRef.current.forEach(clearTimeout);
    cycleRef.current = [];

    const t = (fn: () => void, ms: number) => {
      cycleRef.current.push(setTimeout(fn, ms));
    };

    setPhase("idle");
    t(() => setPhase("tracing"), 400);
    t(() => setPhase("deep"), 1400);
    t(() => setPhase("done"), 2400);
    // Reset and loop
    t(() => {
      setPhase("idle");
      setTimeout(() => runCycle(), 500);
    }, 6000);
  }, []);

  // Trigger on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();
          runCycle();
        }
      },
      { threshold: 0.1, rootMargin: "-80px 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cycleRef.current.forEach(clearTimeout);
    };
  }, [runCycle]);

  // Update nodes/edges when phase changes
  useEffect(() => {
    const activeNodeIds = past("done")
      ? new Set([
          "useAuth",
          "session",
          "token",
          "db",
          "redis",
          "crypto",
          "jwt",
        ])
      : past("deep")
        ? new Set(["useAuth", "session", "token"])
        : past("tracing")
          ? new Set(["useAuth"])
          : new Set<string>();

    const activeEdgeIds = past("done")
      ? new Set([
          "e-auth-session",
          "e-auth-token",
          "e-session-db",
          "e-session-redis",
          "e-token-crypto",
          "e-token-jwt",
        ])
      : past("deep")
        ? new Set(["e-auth-session", "e-auth-token"])
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
    <div ref={containerRef} className="w-full">
      <div
        ref={graphRef}
        className="pointer-events-none h-[200px] w-full overflow-hidden rounded-md sm:h-[240px]"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, minZoom: 0.3, maxZoom: 1 }}
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
    </div>
  );
}

/* ── Exported wrapper ── */

export function AnimatedExploreGraph() {
  return (
    <ReactFlowProvider>
      <ExploreGraphInner />
    </ReactFlowProvider>
  );
}
