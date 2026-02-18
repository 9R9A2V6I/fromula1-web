"use client";

import React, { useMemo } from "react";
import * as d3Sankey from "d3-sankey";
import { FunnelData } from "./data";
import { transformDataToSankey, SankeyNode, SankeyLink } from "./utils";

// --- Types ---
interface MyNode extends d3Sankey.SankeyNode<SankeyNode, SankeyLink> {
  id: string;
  label: string;
  color: string;
  value: number;
}

interface MyLink extends d3Sankey.SankeyLink<SankeyNode, SankeyLink> {
  source: MyNode;
  target: MyNode;
  value: number;
}

export default function SankeyWaveChart() {
  // 1. MAINTAIN HEIGHT FOR SPACING
  const width = 1000;
  const height = 900; 
  const margin = { top: 40, right: 300, bottom: 40, left: 50 }; // Widened right margin for horizontal text

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const { nodes, links } = useMemo(() => {
    const raw = transformDataToSankey(FunnelData);

    const sankeyGenerator = d3Sankey.sankey<SankeyNode, SankeyLink>()
      .nodeWidth(10)
      .nodePadding(50) 
      .extent([[0, 0], [innerWidth, innerHeight]])
      .nodeId((d) => d.id)
      .nodeAlign(d3Sankey.sankeyJustify);

    const graph = sankeyGenerator({
      nodes: raw.nodes.map((d) => ({ ...d })),
      links: raw.links.map((d) => ({ ...d })),
    });

    return {
      nodes: graph.nodes as MyNode[],
      links: graph.links as MyLink[],
    };
  }, [innerWidth, innerHeight]);

  return (
    <div className="w-full flex flex-col items-center bg-white p-8">
      <h2 className="text-xl font-bold mb-6 text-slate-800 self-start px-12">
        Sales Funnel Flow
      </h2>

      <svg width={width} height={height} className="overflow-visible">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <defs>
            {links.map((link, i) => (
              <linearGradient
                key={`grad-${i}`}
                id={`grad-link-${i}`}
                gradientUnits="userSpaceOnUse"
                x1={link.source.x1}
                x2={link.target.x0}
              >
                <stop offset="0%" stopColor={link.source.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={link.target.color} stopOpacity={0.2} />
              </linearGradient>
            ))}
          </defs>

          {/* FLOW LINKS */}
          <g>
            {links.map((link, i) => (
              <path
                key={`link-${i}`}
                d={d3Sankey.sankeyLinkHorizontal()(link) ?? ""}
                fill="none"
                stroke={`url(#grad-link-${i})`}
                strokeWidth={Math.max(1, link.width ?? 0)}
                style={{ mixBlendMode: "multiply" }}
              />
            ))}
          </g>

          {/* NODES & HORIZONTAL LABELS */}
          <g>
            {nodes.map((node) => {
              const nodeHeight = (node.y1 ?? 0) - (node.y0 ?? 0);
              const nodeY = node.y0 ?? 0;
              const nodeX = node.x1 ?? 0;

              return (
                <g key={node.id}>
                  {/* The Vertical Bar */}
                  <rect
                    x={node.x0}
                    y={nodeY}
                    width={(node.x1 ?? 0) - (node.x0 ?? 0)}
                    height={nodeHeight}
                    fill={node.color}
                    rx={2}
                  />

                  {/* The Extension Line */}
                  <line
                    x1={nodeX}
                    y1={nodeY + nodeHeight / 2}
                    x2={innerWidth + 20}
                    y2={nodeY + nodeHeight / 2}
                    stroke={node.color}
                    strokeOpacity={0.3}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />

                  {/* HORIZONTAL ALIGNMENT GROUP */}
                  <g transform={`translate(${innerWidth + 30}, ${nodeY + nodeHeight / 2})`}>
                    {/* Label */}
                    <text
                      dy="0.35em" 
                      className="text-[12px] font-bold fill-slate-700"
                      dominantBaseline="middle"
                    >
                      {node.label}
                    </text>

                    {/* Value: Offset horizontally from the label */}
                    <text
                      x={140} // Adjust this value based on your longest label width
                      dy="0.35em" 
                      className="text-[14px] font-medium fill-slate-800"
                      dominantBaseline="middle"
                      textAnchor="start"
                    >
                      {node.value.toLocaleString()}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}