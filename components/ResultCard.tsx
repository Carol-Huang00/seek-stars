import React, { useState, useEffect } from 'react';
import { ConstellationData, Direction } from '../types';
import { generateStarImage } from '../services/geminiService';

interface ResultCardProps {
  data: ConstellationData;
  userName?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, userName = "旅人" }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(data.imageUrl);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cacheKey = `constellation_game_v5_${data.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setImageUrl(cached);
    } else {
      setLoading(true);
      generateStarImage(data.imagePrompt).then(res => {
        if(res) {
          localStorage.setItem(cacheKey, res);
          setImageUrl(res);
        }
        setLoading(false);
      });
    }
  }, [data]);

  // Helper to generate a consistent "Lucky Color" based on ID
  const getLuckyColor = (id: number) => {
    const colors = ['#ADD8E6', '#FFB6C1', '#98FB98', '#FFD700', '#E6E6FA', '#F08080', '#87CEFA'];
    return colors[id % colors.length];
  };

  const luckyColor = getLuckyColor(data.id);

  // Theme Logic: Exact match to reference colors
  // 朱雀：红色 | 白虎：橙色 | 玄武：蓝色 | 青龙：青色
  const getThemeStyles = (dir: Direction) => {
    switch (dir) {
      case Direction.SOUTH: // 朱雀 - Red
        return {
          wrapper: 'bg-[#2a0a0a] border-[#ffb3b3]',
          innerBorder: 'border-[#5c2b2b]',
          headerTag: 'border-[#ff8080] bg-[#3d1a1a] text-[#ffcccc]',
          nameText: 'text-[#ffcccc]',
          titleGradient: 'from-[#fff0f0] to-[#ff9999]', // White to Pink/Red
          subTitle: 'text-[#ffb3b3]',
          accentBox: 'bg-[#3d1a1a]/80 border-[#5c2b2b]',
          highlight: '#ff4d4d',
        };
      case Direction.WEST: // 白虎 - Orange
        return {
          wrapper: 'bg-[#2a1505] border-[#ffcc80]',
          innerBorder: 'border-[#5c3a1a]',
          headerTag: 'border-[#ffb74d] bg-[#3d220a] text-[#ffe0b2]',
          nameText: 'text-[#ffe0b2]',
          titleGradient: 'from-[#fffbf0] to-[#ffcc80]', // White to Orange/Gold
          subTitle: 'text-[#ffcc80]',
          accentBox: 'bg-[#3d220a]/80 border-[#5c3a1a]',
          highlight: '#ff9800',
        };
      case Direction.NORTH: // 玄武 - Blue
        return {
          wrapper: 'bg-[#050a20] border-[#99ccff]',
          innerBorder: 'border-[#1a2b5c]',
          headerTag: 'border-[#66b3ff] bg-[#0f1a3d] text-[#cce5ff]',
          nameText: 'text-[#cce5ff]',
          titleGradient: 'from-[#f0f8ff] to-[#80bfff]', // White to Blue
          subTitle: 'text-[#99ccff]',
          accentBox: 'bg-[#0f1a3d]/80 border-[#1a2b5c]',
          highlight: '#00bfff',
        };
      case Direction.EAST: // 青龙 - Cyan
        return {
          wrapper: 'bg-[#05201a] border-[#80ffdb]',
          innerBorder: 'border-[#1a5c4d]',
          headerTag: 'border-[#5eead4] bg-[#0a3d33] text-[#ccfbf1]',
          nameText: 'text-[#ccfbf1]',
          titleGradient: 'from-[#f0fdfa] to-[#5eead4]', // White to Teal
          subTitle: 'text-[#80ffdb]',
          accentBox: 'bg-[#0a3d33]/80 border-[#1a5c4d]',
          highlight: '#1de9b6',
        };
      default:
        return {
          wrapper: 'bg-gray-900 border-gray-500',
          innerBorder: 'border-gray-700',
          headerTag: 'border-gray-500 bg-gray-800 text-gray-300',
          nameText: 'text-white',
          titleGradient: 'from-white to-gray-400',
          subTitle: 'text-gray-400',
          accentBox: 'bg-gray-800 border-gray-700',
          highlight: '#ffffff',
        };
    }
  };

  const theme = getThemeStyles(data.direction);

  return (
    <div className="animate-fade-in w-full max-w-[420px] mx-auto p-2 relative z-20">
      
      {/* Outer Card Wrapper */}
      <div className={`
        relative w-full rounded-[20px] p-1.5 shadow-2xl
        ${theme.wrapper} border-[3px]
      `}>
        
        {/* Inner Decor Line (inset) */}
        <div className={`
          relative w-full h-full rounded-[14px] p-5
          border ${theme.innerBorder}
          flex flex-col gap-5
        `}>

          {/* --- Corner L-Shapes (The "Tech/Game" look) --- */}
          <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${theme.wrapper.split(' ')[1]} rounded-tl-sm opacity-80`}></div>
          <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 ${theme.wrapper.split(' ')[1]} rounded-tr-sm opacity-80`}></div>
          <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 ${theme.wrapper.split(' ')[1]} rounded-bl-sm opacity-80`}></div>
          <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 ${theme.wrapper.split(' ')[1]} rounded-br-sm opacity-80`}></div>


          {/* --- Header --- */}
          <div className="flex justify-between items-center z-10">
            {/* Tag */}
            <div className={`
              px-3 py-1 rounded-full border ${theme.headerTag}
              text-xs font-serif tracking-widest shadow-sm
            `}>
              暖冬节快乐
            </div>
            {/* Name */}
            <div className={`font-serif text-lg tracking-wide ${theme.nameText} font-bold drop-shadow-md`}>
              {userName}
            </div>
          </div>


          {/* --- Image & Title Section --- */}
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-inner border border-white/5 bg-black/20 group">
             
             {/* The Image */}
             {loading ? (
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`${theme.subTitle} animate-pulse font-serif text-sm`}>星灵召唤中...</span>
               </div>
             ) : (
               <img 
                 src={imageUrl} 
                 alt={data.name} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
               />
             )}
             
             {/* Bottom Gradient for Text Readability */}
             <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

             {/* Floating Title Overlay */}
             <div className="absolute bottom-6 left-0 w-full text-center z-10 flex flex-col items-center">
                <h1 className={`
                  font-calligraphy text-6xl mb-2
                  text-transparent bg-clip-text bg-gradient-to-b ${theme.titleGradient}
                  drop-shadow-[0_4px_4px_rgba(0,0,0,1)]
                  filter brightness-110
                `}>
                  {data.fullName}
                </h1>
                
                <div className="flex items-center justify-center gap-3 opacity-90">
                   <div className={`h-[1px] w-12 ${theme.wrapper.split(' ')[1].replace('border-','bg-')}`}></div>
                   <span className={`text-sm font-serif tracking-[0.2em] ${theme.subTitle} uppercase`}>
                      {data.direction}
                   </span>
                   <div className={`h-[1px] w-12 ${theme.wrapper.split(' ')[1].replace('border-','bg-')}`}></div>
                </div>
             </div>
          </div>


          {/* --- Attributes Row --- */}
          <div className="grid grid-cols-2 gap-4">
             {/* Element Box */}
             <div className={`
               flex flex-col items-center justify-center py-3 rounded-lg border ${theme.accentBox}
               backdrop-blur-sm
             `}>
                <span className={`text-[10px] ${theme.subTitle} mb-1 opacity-60 tracking-widest`}>五行属性</span>
                <span className={`text-3xl font-serif font-bold ${theme.nameText} drop-shadow-sm`}>
                  {data.element}
                </span>
             </div>

             {/* Color Box */}
             <div className={`
               flex flex-col items-center justify-center py-3 rounded-lg border ${theme.accentBox}
               backdrop-blur-sm
             `}>
                <span className={`text-[10px] ${theme.subTitle} mb-1 opacity-60 tracking-widest`}>幸运色</span>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-5 h-5 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: luckyColor }}></div>
                   <span className={`text-sm font-serif ${theme.nameText} opacity-90`}>{luckyColor}</span>
                </div>
             </div>
          </div>


          {/* --- Fortune Section --- */}
          <div className={`
            relative mt-2 p-5 rounded-lg border ${theme.accentBox}
            backdrop-blur-sm
          `}>
             {/* Floating Label */}
             <div className={`
               absolute -top-3 left-1/2 transform -translate-x-1/2
               px-4 py-[2px] rounded-full border ${theme.headerTag}
               text-[10px] tracking-[0.2em] shadow-sm
             `}>
               星运批注
             </div>

             {/* Content */}
             <p className={`text-justify font-serif text-[13px] leading-6 ${theme.nameText} opacity-80 indent-6`}>
               {data.fortune}
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultCard;