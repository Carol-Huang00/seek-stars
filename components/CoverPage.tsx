import React from 'react';

interface CoverPageProps {
  onStart: () => void;
}

const CoverPage: React.FC<CoverPageProps> = ({ onStart }) => {
  // Fantasy starry sky background
  const fantasyBg = "https://image.pollinations.ai/prompt/anime%20boy%20back%20view%20looking%20at%20starry%20night%20sky%2C%20galaxy%2C%20shooting%20stars%2C%20makoto%20shinkai%20style%2C%20digital%20art%2C%20high%20quality%2C%20deep%20blue%20atmosphere?width=1080&height=1920&nologo=true&seed=42";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f1014] overflow-hidden animate-fade-in">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={fantasyBg} alt="Background" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f1014]/50 to-[#0f1014]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full max-w-md p-8 pb-20">
        
        {/* Top Spacer */}
        <div className="flex-1"></div>

        {/* Title Area */}
        <div className="flex flex-row items-start justify-center w-full mb-12">
           {/* Vertical Title */}
           <div className="flex flex-col items-center">
             <div className="writing-vertical-rl font-calligraphy text-7xl text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] tracking-wide">
               寻找你的
             </div>
             <div className="writing-vertical-rl font-calligraphy text-7xl text-[#ffd700] drop-shadow-[0_0_10px_rgba(255,215,0,0.4)] tracking-wide mt-[-2rem] mr-[-4rem]">
               守护星宿
             </div>
           </div>
        </div>

        <div className="flex-1"></div>

        {/* Start Button - Game Style */}
        <button 
          onClick={onStart}
          className="
            group relative w-20 h-20 rounded-full 
            bg-gradient-to-br from-purple-600 to-indigo-800
            border-2 border-[#ffd700]
            shadow-[0_0_30px_rgba(124,58,237,0.6)]
            flex items-center justify-center
            transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(255,215,0,0.5)]
          "
        >
           <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse"></div>
           <span className="font-serif text-xl text-white font-bold tracking-widest drop-shadow-md">
             开启
           </span>
           
           {/* Decor Diamonds */}
           <div className="absolute top-1/2 -left-4 w-2 h-2 bg-[#ffd700] rotate-45"></div>
           <div className="absolute top-1/2 -right-4 w-2 h-2 bg-[#ffd700] rotate-45"></div>
        </button>

      </div>
    </div>
  );
};

export default CoverPage;