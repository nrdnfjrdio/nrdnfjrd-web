"use client";

import { useEffect, useState } from "react";

interface WorkflowNode {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
}

interface WorkflowVisualizerProps {
  nodes: WorkflowNode[];
  isConsulting?: boolean;
}

export default function WorkflowVisualizer({
  nodes,
  isConsulting = false,
}: WorkflowVisualizerProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < nodes.length) {
      const t = setTimeout(() => setVisibleCount((c) => c + 1), 300);
      return () => clearTimeout(t);
    }
  }, [visibleCount, nodes.length]);

  useEffect(() => {
    setVisibleCount(0);
    const t = setTimeout(() => setVisibleCount(1), 100);
    return () => clearTimeout(t);
  }, [nodes.length]);

  const NODE_W = 120;
  const NODE_H = 36;
  const GAP = 56;
  const SVG_W = Math.max(400, nodes.length * (NODE_W + GAP));
  const SVG_H = 100;
  const CY = SVG_H / 2;

  const nodePositions = nodes.map((n, i) => ({
    ...n,
    x: i * (NODE_W + GAP) + 20,
    y: CY - NODE_H / 2,
  }));

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={SVG_W}
        height={SVG_H}
        className="font-[var(--font-jetbrains-mono)]"
      >
        {nodePositions.map((node, i) => {
          const visible = i < visibleCount;
          const prev = nodePositions[i - 1];
          return (
            <g key={node.id}>
              {i > 0 && visible && (
                <line
                  x1={prev.x + NODE_W}
                  y1={CY}
                  x2={node.x}
                  y2={CY}
                  stroke="#F0EDE6"
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  strokeDasharray="4 3"
                  className="animate-dash"
                />
              )}
              {visible && (
                <g
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_W}
                    height={NODE_H}
                    fill={node.color}
                    fillOpacity={0.15}
                    stroke={node.color}
                    strokeWidth={1}
                    rx={0}
                  />
                  <text
                    x={node.x + NODE_W / 2}
                    y={CY + 5}
                    textAnchor="middle"
                    fill={node.color}
                    fontSize={11}
                    fontFamily="var(--font-jetbrains-mono)"
                  >
                    {node.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        {isConsulting && visibleCount >= nodes.length && (
          <g>
            <line
              x1={nodePositions[nodePositions.length - 1]?.x + NODE_W || 0}
              y1={CY}
              x2={nodePositions[nodePositions.length - 1]?.x + NODE_W + GAP || 0}
              y2={CY}
              stroke="#F0EDE6"
              strokeWidth={1}
              strokeOpacity={0.3}
              strokeDasharray="4 3"
            />
            <rect
              x={(nodePositions[nodePositions.length - 1]?.x + NODE_W + GAP) || 0}
              y={CY - NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              fill="transparent"
              stroke="#F0EDE6"
              strokeWidth={1}
              strokeDasharray="4 3"
              strokeOpacity={0.5}
            />
            <text
              x={(nodePositions[nodePositions.length - 1]?.x + NODE_W + GAP + NODE_W / 2) || 0}
              y={CY + 5}
              textAnchor="middle"
              fill="#F0EDE6"
              fillOpacity={0.5}
              fontSize={14}
              fontFamily="var(--font-jetbrains-mono)"
            >
              ?
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
