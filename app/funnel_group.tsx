import { FunnelStage } from "./type";
import { FunnelNode } from "./funnel_node";
import { useMemo, useState } from "react";

const GAP_PX = 6;
const MIN_ZERO_HEIGHT = 5;    // Thin line for zero values
const MIN_ACTIVE_HEIGHT = 30; // Substantial height for values > 0

function computeChildHeights(children: { value: number }[], parentPx: number) {
  if (children.length === 0) return [];

  const totalGap = (children.length - 1) * GAP_PX;
  const available = parentPx - totalGap;
  const totalValue = children.reduce((s, c) => s + c.value, 0);

  // Allocate 5px to every zero-value node first
  let heights: number[] = children.map(c => (c.value <= 0 ? MIN_ZERO_HEIGHT : -1));

  const zeroSpace = heights.filter(h => h > 0).reduce((a, b) => a + b, 0);
  const remainingSpace = available - zeroSpace;

  // Distribute the remaining large chunk of space to active nodes only
  heights = heights.map((h, i) => {
    if (h !== -1) return h;
    const share = totalValue > 0 ? (children[i].value / totalValue) * remainingSpace : 0;
    return Math.max(share, MIN_ACTIVE_HEIGHT);
  });

  // Final scale check to ensure we don't overflow the parent container
  const totalAllocated = heights.reduce((a, b) => a + b, 0);
  if (totalAllocated > available) {
    const scale = available / totalAllocated;
    return heights.map(h => h * scale);
  }

  return heights;
}
type FunnelGroupProps = {
  node: FunnelStage;
  heightPx: number;
  depth?: number;
  activeData: string;
};

export function FunnelGroup({ node, heightPx, depth = 0, activeData }: FunnelGroupProps) {
  const [isHovered, setIsHovered] = useState(false);

  const childHeights = useMemo(() => {
    if (!node.children) return [];
    return computeChildHeights(node.children, heightPx);
  }, [node.children, heightPx]);

  // If the node is zero-value and hovered, we force it to expand
  // Otherwise, we use the calculated heightPx
  const currentHeight = node.value === 0 && isHovered ? 40 : heightPx;

  return (
    <div
      className="flex w-full transition-all duration-300 ease-in-out"
      style={{ 
        height: `${currentHeight}px`,
        zIndex: isHovered ? 50 : 1 // Bring to front when hovered
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="shrink-0 transition-all duration-300"
        style={{
          width: node.label ? "18vw" : "60px",
          minWidth: node.label ? "18vw" : "60px",
        }}
      >
        <FunnelNode
          label={node.label}
          value={node.value}
          depth={depth}
          activeData={activeData}
          // Pass hover state to node if you want to change label colors too
          isParentHovered={isHovered} 
        />
      </div>

      {node.children && (
        <div className="flex flex-col flex-1" style={{ gap: `${GAP_PX}px` }}>
          {node.children.map((child, i) => (
            <FunnelGroup
              key={child.id}
              node={child}
              heightPx={childHeights[i]}
              depth={depth + 1}
              activeData={activeData}
            />
          ))}
        </div>
      )}
    </div>
  );
}