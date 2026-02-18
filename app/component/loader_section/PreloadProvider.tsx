"use client";

import { ReactNode, useEffect } from "react";
import { useLoaderStore } from "@/app/store/useLoaderStore";

interface Props {
  children: ReactNode;
}

const PreloadProvider: React.FC<Props> = ({ children }) => {
  const setLoaded = useLoaderStore((s) => s.setLoaded);

  useEffect(() => {
    const preload = async () => {
      await Promise.all([
        import("@/app/component/hero_section/hero-section"),
        import("@/app/component/journey_section/journey_section"),
        import("@/app/component/image-translater/image-slider"),
        import("@/app/component/social_media_card/card_main_section"),
        import("@/app/component/product_section/product_main"),
      ]);

      setLoaded();
    };

    preload();
  }, [setLoaded]);

  return <>{children}</>;
};

export default PreloadProvider;
