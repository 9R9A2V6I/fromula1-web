

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  // Recursive definition for nested children
  children?: FunnelStage[];
}

/**
 * Props for the FunnelGroup2 component.
 */
export interface FunnelGroupProps {
  /** The current data node being rendered */
  node: FunnelStage;
  /** The total height (in pixels) allocated to this node and its children */
  heightPx: number;
  /** The nesting level (used for color rotation) */
  depth?: number;
  /** Optional: The original data set or a string identifier for comparison logic */
  activeData?: FunnelStage | string;
}