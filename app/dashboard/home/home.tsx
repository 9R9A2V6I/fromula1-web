"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { AudioPlayer } from "@/app/component/small_component/audio_player";

const HeroSection = dynamic(() => import("@/app/component/hero_section/hero-section"), { ssr: true });
const JourneySection = dynamic(() => import("@/app/component/journey_section/journey_section"), { ssr: false });
const ImageSlider = dynamic(() => import("@/app/component/image-translater/image-slider"), { ssr: false });
const CardMain = dynamic(() => import("@/app/component/social_media_card/card_main_section"), { ssr: false });
const ProductMain = dynamic(() => import("@/app/component/product_section/product_main"), { ssr: false });
const FotterMain = dynamic(() => import("@/app/component/fotter_section/fotter_main"), { ssr: false });

const Home: React.FC = () => {
  const { scrollY } = useScroll();

  /**
   * START FROM LEFT → infinite zig-zag
   * left: 10vw ↔ 85vw
   */
  const leftRaw = useTransform(scrollY, (v) => {
    const min = 10;
    const max = 85;
    const mid = (min + max) / 2;
    const amp = (max - min) / 2;

    // 👇 PHASE SHIFT (-π/2) starts from LEFT
    return `${mid + Math.sin(v * 0.002 - Math.PI / 2) * amp}vw`;
  });

  const left = useSpring(leftRaw, {
    stiffness: 40,
    damping: 18,
  });

  return (
    <>
      <div className="w-full flex flex-col">
        <HeroSection />
        <div className="bg-[#282C20] text-white">
          <JourneySection />
        </div>
        <div className="bg-[#f4f4ed]">
          <ImageSlider />
        </div>
        <div className="bg-[#f4f4ed] pb-[100px]">
          <CardMain />
        </div>
        <div className="bg-black">
          <ProductMain />
        </div>
        <FotterMain />
      </div>

      {/* 🎧 STARTS FROM LEFT */}
      <motion.div
        style={{ left }}
        className="fixed top-[70%] z-50 pointer-events-auto"
      >
        <AudioPlayer />
      </motion.div>
    </>
  );
};

export default Home;
