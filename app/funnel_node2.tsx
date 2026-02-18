import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type FunnelNodeProps = {
  label: string;
  value: number;
  depth: number;
  isSecondary?: boolean;
  activeData: string;
  isParentHovered?: boolean;
};

export function FunnelNode2({
  label,
  value,
  depth,
  isSecondary,
  activeData,
  isParentHovered,
}: FunnelNodeProps) {
  const STAGE_COLORS = ["#4E80EE", "#51D09B", "#52B4D1", "#A14DED", "#FAA6E2", "#FFC892"];
  const [showNoAnsweredModal, setShowNoAnsweredModal] = useState(false);

  const currentColor = STAGE_COLORS[depth % STAGE_COLORS.length];
  const prevColor = STAGE_COLORS[(depth - 1 + STAGE_COLORS.length) % STAGE_COLORS.length];
  const barOpacity = isSecondary ? 0.65 : 1;

  // Logic to hide content if the bar is in the 5px "Zero" state
  const isCollapsed = value <= 0 && !isParentHovered;

  const getLabelBackground = () => {
    if (activeData === "local") {
      return value > 0 ? `linear-gradient(to right, ${prevColor}20, ${currentColor}20)` : "#F8F8F8";
    }
    return value > 0 ? `linear-gradient(to right, ${prevColor}40, ${currentColor}40)` : "linear-gradient(to right, #F2F2F6, #FFFFFF)";
  };

  const getBarBackground = () => {
    if (value <= 0) return "#F2F2F6";
    return activeData === "local" ? `${currentColor}95` : currentColor;
  };

  return (
    <div className="flex w-full h-full min-h-0 overflow-hidden border-b border-white/10">
      {label && (
        <div
          className="flex-1 flex items-center px-3 text-[10px] font-medium text-slate-700 transition-opacity duration-200"
          style={{ 
            background: getLabelBackground(),
            opacity: isCollapsed ? 0 : 1, // Hide text if 5px
          }}
        >
          <span className="truncate">{label}</span>
          {label === "Not Answered" && !isCollapsed && (
            <div className="relative ml-2 shrink-0">
              <Image src="/info-icon-grey.svg" alt="info" width={14} height={14} />
            </div>
          )}
        </div>
      )}

      <div
        className="w-[60px] flex items-center justify-center text-sm font-bold transition-all duration-300"
        style={{
          backgroundColor: getBarBackground(),
          opacity: barOpacity,
          color: value > 0 ? "black" : "#FF0000",
          fontSize: isCollapsed ? "0px" : "12px", // Hide value if 5px
        }}
      >
        {value}
      </div>
    </div>
  );
}