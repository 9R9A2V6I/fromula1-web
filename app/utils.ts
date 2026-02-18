import { FunnelStage } from "./type";

export interface SankeyNode {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

const COLORS = ["#4285F4", "#34A853", "#EA4335", "#FBBC05", "#A14DED"];

export function transformDataToSankey(data: FunnelStage) {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  function traverse(node: FunnelStage, depth: number) {
    if (!nodes.find((n) => n.id === node.id)) {
      nodes.push({
        id: node.id,
        label: node.label || "Total",
        value: node.value,
        color: COLORS[depth % COLORS.length],
      });
    }

    if (node.children) {
      node.children.forEach((child) => {
        links.push({
          source: node.id,
          target: child.id,
          value: child.value || 0.1, // Ensure small values still show a thin line
        });
        traverse(child, depth + 1);
      });
    }
  }

  traverse(data, 0);
  return { nodes, links };
}