import React from 'react';

interface CoverPageProps {
  onStart: () => void;
}

const CoverPage: React.FC<CoverPageProps> = ({ onStart }) => {
  // Prompt: Winding stardust path leading to a floating celestial palace, dark fantasy game art style
  const fantasyBg = "https://image.pollinations.ai/prompt/High%20fantasy%20digital%20art%2C%20vertical%20composition%2C%20a%20winding%20path%20made%20of%20stardust%20leading%20up%20to%20a%20majestic%20floating%20Chinese%20celestial%20palace%20in%20the%20sky%2C%20a%20tiny%20silhouette%20of%20a%20traveler%20walking%20on%20the%20road%2C%20deep%20blue%20starry%20night%20background%2C%20glowing%20constellations%2C%20ethereal%2C%208k%20masterpiece?width=1080&height=1920&nologo=true&seed=99";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f1014] overflow-hidden animate-fade-in">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={fantasyBg} alt="Background" className="w-full h-full object-cover opacity-80" />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full h-full max-w-md p-8 flex flex-col">
        
        {/* Top Spacer */}
        <div className="h-[15%]"></div>

        {/* Title Area - Right Aligned Vertical Text */}
        <div className="flex-1 flex flex-row justify-end items-start pr-4">
           
           {/* Vertical Title Group - reduced gap to bring lines closer */}
           <div className="flex flex-row-reverse gap-1">
             {/* Main Title Line 1 */}
             <div className="writing-vertical-rl font-calligraphy text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-widest leading-loose">
               寻找你的
             </div>
             {/* Main Title Line 2 */}
             <div className="writing-vertical-rl font-calligraphy text-7xl text-[#ffd700] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] tracking-widest leading-loose mt-16">
               守护星宿
             </div>
           </div>
        </div>

        {/* Bottom Area: Button - reduced padding to move button down */}
        <div className="flex flex-col items-center justify-end pb-8">
          
          {/* Start Button - Game Style Crystal Orb */}
          <button 
            onClick={onStart}
            className="
              group relative w-20 h-20 rounded-full 
              bg-gradient-to-br from-indigo-600 to-purple-800
              border-2 border-[#ffd700]
              shadow-[0_0_30px_rgba(124,58,237,0.6)]
              flex items-center justify-center
              transition-all duration-500 hover:scale-110 hover:shadow-[0_0_50px_rgba(255,215,0,0.6)]
              cursor-pointer
            "
          >
             {/* Inner Pulse */}
             <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-30"></div>
             <div className="absolute inset-0 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors"></div>
             
             {/* Text */}
             <span className="font-serif text-xl text-white font-bold tracking-widest drop-shadow-md z-10 group-hover:text-[#ffd700] transition-colors">
               开始
             </span>
             
             {/* Decor Elements */}
             <div className="absolute -inset-1 rounded-full border border-[#ffd700]/30 border-dashed animate-spin-slow" style={{ animationDuration: '10s' }}></div>
          </button>
          
        </div>

      </div>
    </div>
  );
};

export default CoverPage;