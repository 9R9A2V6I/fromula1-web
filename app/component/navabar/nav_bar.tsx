"use client";

import React from "react";
import Image from "next/image";
import { motion ,Variants} from "framer-motion";
import AnimatedMenuButton from "../animated_small_compo/animatedMenuButton";
import SmallNavabar from "../small_component/small_navabar";

const leftVariant: Variants = {
  hidden: {
    x: -120,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12, // bounce
    },
  },
};

const rightVariant: Variants = {
  hidden: {
    x: 120,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
      delay: 0.15,
    },
  },
};

const topVariant: Variants = {
  hidden: {
    y: -80,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 14,
      delay: 0.25,
    },
  },
};

function Navbar() {
  return (
    <div className="w-full justify-center items-center px-4 py-4">
      <div className="flex justify-between items-center w-full">

        {/* LEFT – Logo Text */}
        <motion.h1
          variants={leftVariant}
          initial="hidden"
          animate="visible"
          className="text-5xl flex flex-col leading-12 w-[15%]"
        >
          <span className="font-brier font-semibold">FIGHT</span>
          <span className="font-mona  uppercase font-semibold text-[55px]">
WITH LIFE
          </span>
        </motion.h1>

        {/* CENTER – Small Navbar */}
        <motion.div
          variants={topVariant}
          initial="hidden"
          animate="visible"
          className="w-[70%] flex justify-center"
        >
          <SmallNavabar />
        </motion.div>

        {/* RIGHT – Store Button + Menu */}
        <motion.div
          variants={rightVariant}
          initial="hidden"
          animate="visible"
          className="flex justify-end items-center gap-3 w-[15%]"
        >
          <div className="bg-[#d2ff03] px-6 py-6 uppercase font-mona font-extrabold text-[20px] rounded-xl flex justify-center items-center hover:opacity-70 cursor-pointer">
            <Image
              src="/images/store.svg"
              alt="shopping-bag"
              width={24}
              height={24}
              className="mr-2"
            />
            Store
          </div>

          <AnimatedMenuButton />
        </motion.div>
      </div>
    </div>
  );
}

export default Navbar;
