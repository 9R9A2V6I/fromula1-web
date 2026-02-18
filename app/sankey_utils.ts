import { FunnelStage } from "@/app/types/lead_converstion_funnel";

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

const COLORS = [
  "#4E80EE",
  "#51D09B",
  "#52B4D1",
  "#A14DED",
  "#FAA6E2",
  "#FFC892",
];



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