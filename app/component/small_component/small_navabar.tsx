import React from 'react';
import { motion } from 'framer-motion';
import { SlidingText } from '@/app/utils-component/SlidingText';

const tabs = ["Home", "About", "Services", "Portfolio", "Contact"];

function SmallNavabar() {
  const [activetab, setActivetab] = React.useState("Home");

  return (
    <div className="flex justify-center items-center rounded-full w-full">
      <ul className='flex justify-center items-center gap-16 text-[25px] font-sans font-normal cursor-pointer  rounded-full p-2'>
        {tabs.map((tab) => (
          <li
            key={tab}
            onClick={() => setActivetab(tab)}
            className={`relative px-6 py-2 transition-colors duration-900 cursor-pointer ${
              activetab === tab ? 'text-white' : 'text-black hover:text-gray-900'
            }`}
          >
            {/* This is the animated background pill */}
            {activetab === tab && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0  rounded-full cursor-pointer small_navabr_tab "
                transition={{ type: "spring", duration: 0.5 }}

                style={{ zIndex: 0 }}
              />
            )}
            
            {/* The label needs relative positioning to stay above the white pill */}
            <SlidingText className="relative z-10 cursor-pointer">
                      {tab}
                    </SlidingText>
           
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SmallNavabar;