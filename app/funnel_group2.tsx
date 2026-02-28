"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import * as d3Sankey from "d3-sankey";
import { motion } from "framer-motion";

/** Types & Utils **/
export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  children?: FunnelStage[];
}

export interface SankeyNode {
  id: string;
  label: string;
  value: number;
  color: string;
  depth?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

// Added missing Enum
enum FunnelStageLabel {
  NO_ATTEMPT = "No Attempt",
}

const COLORS = ["#4E80EE", "#51D09B", "#52B4D1", "#A14DED", "#FAA6E2", "#FFC892"];

export function transformDataToSankey(data: FunnelStage) {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  function traverse(node: FunnelStage, depth: number) {
    let existingNode = nodes.find((n) => n?.id === node?.id);

    if (!existingNode) {
      existingNode = {
        id: node?.id,
        label: node?.label,
        value: node?.value,
        depth,
        color: COLORS[depth % COLORS.length],
      };
      nodes.push(existingNode);
    }

    if (node?.children) {
      node?.children.forEach((child) => {
        links.push({
          source: node?.id,
          target: child?.id,
          value: child?.value || 0,
        });
        traverse(child, depth + 1);
      });
    }
  }

  traverse(data, 0);
  return { nodes, links };
}

/** Component Types **/
type MyNode = d3Sankey.SankeyNode<SankeyNode, SankeyLink>;
type MyLink = d3Sankey.SankeyLink<SankeyNode, SankeyLink> & {
  width?: number;
};

type Props = {
  currentData: FunnelStage | null;
};

export default function SankeyWaveChart({ currentData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentSize, setParentSize] = useState({ width: 1000, height: 500 });
  
  // Cleaned up unused state
  const [notAttemptedtooltip, setNotAttemptedtooltip] = useState<boolean>(false);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setParentSize({ width: rect.width, height: rect.height });
    }
  }, []);

  const margin = { top: 10, right: 160, bottom: 10, left: 10 };
  const innerWidth = parentSize.width - margin.left - margin.right;
  const innerHeight = parentSize.height - margin.top - margin.bottom;

  const { nodes, links } = useMemo(() => {
    if (!currentData) return { nodes: [], links: [] };

    const raw = transformDataToSankey(currentData);

    const sankey = d3Sankey
      .sankey<SankeyNode, SankeyLink>()
      .nodeWidth(14)
      .nodePadding(36)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .nodeId((d) => d.id)
      .nodeAlign(d3Sankey.sankeyJustify)
      .iterations(100);

    const graph = sankey({
      nodes: raw.nodes.map((d) => ({ ...d })),
      links: raw.links.map((d) => ({ ...d })),
    });

    return {
      nodes: graph.nodes as MyNode[],
      links: graph.links as MyLink[],
    };
  }, [currentData, innerWidth, innerHeight]);

  function fadeColor(hex: string, opacity: number) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${opacity})`;
  }

  const hasData = currentData && currentData.value > 0;

  return (
    <div ref={containerRef} className="w-full h-full flex justify-center items-center">
      {hasData ? (
        <svg width={parentSize.width} height={parentSize.height}>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <defs>
              {links.map((link, i) => (
                <linearGradient
                  key={`grad-${i}`}
                  id={`link-grad-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={(link.source as MyNode).x1 ?? 0}
                  x2={(link.target as MyNode).x0 ?? 0}
                >
                  <stop offset="0%" stopColor={(link.source as MyNode).color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={(link.target as MyNode).color} stopOpacity={0.35} />
                </linearGradient>
              ))}
            </defs>

            {/* LINKS */}
            <g>
              {links.map((link, i) => {
                const path = d3Sankey.sankeyLinkHorizontal()(link);
                return (
                  <motion.path
                    key={`link-${i}`}
                    d={path ?? ""}
                    fill="none"
                    stroke={`url(#link-grad-${i})`}
                    strokeWidth={Math.max(2, link.width ?? 0)}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{
                      duration: 0.6,
                      delay: (link.source as MyNode).depth! * 0.2,
                    }}
                    whileHover={{ opacity: 1 }}
                  />
                );
              })}
            </g>

            {/* NODES */}
            <g>
              {nodes.map((node) => {
                const nodeHeight = Math.max((node.y1 ?? 0) - (node.y0 ?? 0), 4);
                const isLeaf = !links.some((l) => (l.source as MyNode).id === node.id);
                const nodeColor = isLeaf ? fadeColor(node.color, 0.5) : node.color;
                const isNoAttempt = node.label === FunnelStageLabel.NO_ATTEMPT;

                return (
                  <g key={node.id}>
                    <motion.rect
                      x={node.x0}
                      y={node.y0}
                      width={(node.x1 ?? 0) - (node.x0 ?? 0)}
                      height={nodeHeight}
                      rx={2}
                      fill={nodeColor}
                      initial={{ height: 0 }}
                      animate={{ height: nodeHeight }}
                      transition={{ duration: 0.8 }}
                    />

                    {/* LABEL CARD */}
                    <g
                      transform={`translate(${(node.x1 ?? 0) + 10}, ${(node.y0 ?? 0) + nodeHeight / 2})`}
                      onClick={() => isNoAttempt && setNotAttemptedtooltip(true)}
                      className={isNoAttempt ? "cursor-pointer" : "cursor-default"}
                    >
                      <text dy="-2" className="text-[12px] font-semibold fill-slate-800">
                        {node.label}
                      </text>
                      <text dy="12" className="text-[12px] fill-slate-500">
                        {node.value.toLocaleString()}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      ) : (
        <h1 className="font-semibold text-xl text-slate-400">No Data found</h1>
      )}
    </div>
  );
}
