
"use client"
import { FunnelGroup } from "./funnel_group";
import { FunnelData } from "./data";
import { LocalFunnelData } from "./data";
import Image from "next/image";
import FunnelGroup2 from "./funnel_group2";

type FunnelSectionProps = {
  activeData: string;
};

export default function FunnelSection({ activeData }: FunnelSectionProps) {
  const currentData = activeData === "global" ? FunnelData : LocalFunnelData;
  return (
    <div className="h-[600px] w-full shadow-md rounded px-3 py-2 flex flex-col gap-3">
      {/* <div className="flex  items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#EE96061A] text-[#EE9606]   text-sm font-semibold">
          <Image
            src="/trending-down-icon.svg"
            alt="down-svg"
            width={25}
            height={25}
            className="w-4 h-4 cursor-pointer "
          />
          <span>Drop: Contacted</span>
          <Image
            src="/chevron-yellow-left.svg"
            alt="left-svg"
            width={25}
            height={25}
            className="w-4 h-4 cursor-pointer hover:opacity-[0.6]"
          />
          <span>Booked</span>
          <span className="ml-2">33%</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#fbe8e8] text-[#FF0000]   text-sm font-semibold">
         <Image
            src="/red-info-icon.svg"
            alt="left-svg"
            width={25}
            height={25}
            className="w-4 h-4 cursor-pointer hover:opacity-[0.6]"
          />
          <span>High DNA after visit</span>
          <span className="ml-2 text-sm">20</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#34A3011A] text-[#34A301]   text-sm font-semibold">
          <Image
            src="/pound-green-icon.svg"
            alt="left-svg"
            width={25}
            height={25}
            className="w-4 h-4 cursor-pointer hover:opacity-[0.6]"
          />
          <span>Distance sales converting better</span>
          <span className="ml-2 text-[#34A301]">30% vs 25%</span>
        </div>
      </div> */}

      {/* Funnel Section */}
      <div className="flex-1 w-full">
       <FunnelGroup2
  currentData={FunnelData}
  
/>

      </div>
    </div>
  );
}