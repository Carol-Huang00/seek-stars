
import React, { useRef, useState } from 'react';
import { ConstellationData, Direction } from '../types';
import { CONSTELLATIONS, getConstellationByIndex } from '../services/constellationData';
import { generateStarImage } from '../services/geminiService';

interface ResultCardProps {
  data: ConstellationData;
  userName?: string; 
  onRetest?: () => void; // Optional callback for re-testing
}

const ResultCard: React.FC<ResultCardProps> = ({ data, userName, onRetest }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // --- AI Workshop State ---
  const [workshopId, setWorkshopId] = useState<number>(data.id);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fallback Logic
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!imgError) {
      setImgError(true);
    }
  };

  // Theme Logic
  const getThemeStyles = (dir: Direction) => {
    switch (dir) {
      case Direction.SOUTH: // 朱雀 - Red
        return {
          wrapper: 'bg-[#2a0a0a] border-[#ffb3b3]',
          innerBorder: 'border-[#5c2b2b]',
          nameBorder: 'border-[#ff3333]/50',
          nameText: 'text-[#ffcccc]', 
          titleGradient: 'bg-gradient-to-b from-[#ffffff] via-[#ffcccc] to-[#ff3333]',
          titleShadow: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] drop-shadow-[0_0_15px_rgba(255,50,50,0.6)]',
          solidColor: '#ff3333', // For Screenshot
          subTitle: 'text-[#ff9999]',
          accentBox: 'border-[#ff3333]/30 bg-[#ff3333]/10'
        };
      case Direction.WEST: // 白虎 - Orange
        return {
          wrapper: 'bg-[#2a1505] border-[#ffcc80]',
          innerBorder: 'border-[#5c3a1a]',
          nameBorder: 'border-[#ff8800]/50',
          nameText: 'text-[#ffe0b2]',
          titleGradient: 'bg-gradient-to-b from-[#ffffff] via-[#ffe0b2] to-[#ff8800]',
          titleShadow: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] drop-shadow-[0_0_15px_rgba(255,160,0,0.6)]',
          solidColor: '#ff8800',
          subTitle: 'text-[#ffcc80]',
          accentBox: 'border-[#ff8800]/30 bg-[#ff8800]/10'
        };
      case Direction.NORTH: // 玄武 - Blue
        return {
          wrapper: 'bg-[#050a20] border-[#99ccff]',
          innerBorder: 'border-[#1a2b5c]',
          nameBorder: 'border-[#2979ff]/50',
          nameText: 'text-[#cce5ff]',
          titleGradient: 'bg-gradient-to-b from-[#ffffff] via-[#cce5ff] to-[#2979ff]',
          titleShadow: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] drop-shadow-[0_0_15px_rgba(40,120,255,0.6)]',
          solidColor: '#2979ff',
          subTitle: 'text-[#99ccff]',
          accentBox: 'border-[#2979ff]/30 bg-[#2979ff]/10'
        };
      case Direction.EAST: // 青龙 - Cyan
        return {
          wrapper: 'bg-[#05201a] border-[#80ffdb]',
          innerBorder: 'border-[#1a5c4d]',
          nameBorder: 'border-[#00bfa5]/50',
          nameText: 'text-[#ccfbf1]',
          titleGradient: 'bg-gradient-to-b from-[#ffffff] via-[#ccfbf1] to-[#00bfa5]',
          titleShadow: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] drop-shadow-[0_0_15px_rgba(29,233,182,0.6)]',
          solidColor: '#00bfa5',
          subTitle: 'text-[#80ffdb]',
          accentBox: 'border-[#00bfa5]/30 bg-[#00bfa5]/10'
        };
      default:
        return {
          wrapper: 'bg-gray-900 border-gray-500',
          innerBorder: 'border-gray-700',
          nameBorder: 'border-white/50',
          nameText: 'text-white',
          titleGradient: 'bg-gradient-to-b from-white to-gray-400',
          titleShadow: 'drop-shadow-md',
          solidColor: '#ffffff',
          subTitle: 'text-gray-300',
          accentBox: 'border-white/20 bg-white/5'
        };
    }
  };

  const theme = getThemeStyles(data.direction);

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      // Small delay to ensure rendering stability
      await new Promise(r => setTimeout(r, 100));

      // @ts-ignore - html2canvas is loaded via CDN
      const canvas = await window.html2canvas(cardRef.current, {
        useCORS: true,       // Critical for images
        allowTaint: true,    // Allowed to capture tainted images
        scale: 2,            // High res
        backgroundColor: null, // Transparent bg where possible
        logging: false,
        onclone: (clonedDoc: Document) => {
           // 🛠️ FIX: Manually fix the Gradient Text for screenshot
           // html2canvas doesn't support 'bg-clip: text', so we force a solid color on the clone.
           const titleEl = clonedDoc.getElementById('star-title-text');
           if (titleEl) {
             titleEl.style.backgroundImage = 'none';
             titleEl.style.webkitBackgroundClip = 'initial';
             titleEl.style.webkitTextFillColor = 'initial';
             titleEl.style.color = theme.solidColor; // Use the theme's solid color
           }
        }
      });

      const link = document.createElement('a');
      link.download = `暖冬节_${data.fullName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("下载失败，请尝试长按图片保存");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateAiImage = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setAiImage(null);

    const targetStar = getConstellationByIndex(workshopId);
    
    // Construct a high-quality prompt based on Game Art style
    const prompt = `High fantasy game character art, masterpiece, 8k resolution, best quality, close-up shot of ${targetStar.fullName} (Chinese constellation), represented as a majestic ${targetStar.animal} spirit, dynamic pose, glowing magical energy, detailed fur and scales, traditional chinese cloud patterns on body, floating in deep dark starry night sky, cinematic lighting, ${targetStar.direction}ern mythology theme colors, bioluminescence.`;

    const img = await generateStarImage(prompt);
    if (img) {
      setAiImage(img);
    }
    setIsGenerating(false);
  };

  const handleDownloadAiImage = () => {
    if (!aiImage) return;
    const link = document.createElement('a');
    const targetStar = getConstellationByIndex(workshopId);
    link.download = `AI工坊_${targetStar.fullName}.png`;
    link.href = aiImage;
    link.click();
  }

  return (
    <div className="w-full max-w-[420px] mx-auto p-2 relative z-20 flex flex-col gap-8 mb-10">
      
      {/* --- Main Result Card --- */}
      <div 
        ref={cardRef}
        className={`
          relative w-full rounded-[20px] p-1.5 shadow-2xl
          ${theme.wrapper} border-[3px]
        `}
      >
        <div className={`
          relative w-full h-full rounded-[14px] p-5
          border ${theme.innerBorder}
          flex flex-col gap-5
        `}>

          {/* Corners */}
          <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${theme.wrapper.split(' ')[1]} rounded-tl-sm opacity-80`}></div>
          <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 ${theme.wrapper.split(' ')[1]} rounded-tr-sm opacity-80`}></div>
          <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 ${theme.wrapper.split(' ')[1]} rounded-bl-sm opacity-80`}></div>
          <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 ${theme.wrapper.split(' ')[1]} rounded-br-sm opacity-80`}></div>

          {/* Header Row: Minimalist Elegant Name */}
          <div className="w-full flex justify-center items-center relative z-20 mt-3 mb-1">
             <span className={`
               font-serif text-lg tracking-[0.5em] font-bold 
               ${theme.nameText} opacity-90
               drop-shadow-sm
               uppercase
             `}>
                {userName || '旅人'}
             </span>
          </div>

          {/* Image & Title Section */}
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-inner border border-white/5 bg-black/20 group mt-0">
             {/* The Image */}
             {imgError ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col p-4 text-center">
                   <span className={`font-calligraphy text-8xl opacity-30 ${theme.nameText}`}>{data.name}</span>
                </div>
             ) : (
                <img 
                  src={data.imageUrl} 
                  alt={data.name} 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsImgLoaded(true)}
                  onError={handleImgError}
                  // IMPORTANT: Do NOT use crossOrigin here if images are local or standard HTTP.
                  // If using external CORS-enabled images, you might need it, but for local download, removing it is safer.
                />
             )}
             
             {/* Fallback Loading State */}
             {!isImgLoaded && !imgError && (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[#ffd700]/30 border-t-[#ffd700] rounded-full animate-spin"></div>
               </div>
             )}
             
             {/* Bottom Gradient Overlay for Text Readability */}
             <div className="absolute bottom-0 left-0 w-full h-3/5 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none"></div>

             {/* Floating Title Overlay */}
             <div className="absolute bottom-5 left-0 w-full text-center z-10 flex flex-col items-center">
                {/* ID added for html2canvas targeting */}
                <h1 id="star-title-text" className={`
                  font-calligraphy text-6xl mb-2 scale-y-110
                  text-transparent bg-clip-text
                  ${theme.titleGradient}
                  ${theme.titleShadow}
                  filter brightness-125
                `}>
                  {data.fullName}
                </h1>
                
                <div className={`flex items-center justify-center gap-3 opacity-90 ${theme.subTitle}`}>
                   <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-current to-transparent opacity-60"></div>
                   <span className={`text-xs font-serif tracking-[0.3em] uppercase font-bold drop-shadow-md`}>
                      {data.direction}
                   </span>
                   <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-current to-transparent opacity-60"></div>
                </div>
             </div>
          </div>

          {/* Characteristic (Poem) */}
          <div className={`
            flex flex-col items-center justify-center py-5 rounded-lg border ${theme.accentBox}
            backdrop-blur-sm relative overflow-hidden
          `}>
             {/* Subtle Glow Background */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30"></div>
             
             <span className={`relative text-xl font-serif font-bold ${theme.nameText} drop-shadow-sm tracking-widest leading-relaxed text-center px-4`}>
               “{data.poem}”
             </span>
          </div>

          {/* Fortune Text */}
          <div className={`
            relative mt-0 p-4 rounded-lg border ${theme.accentBox}
            backdrop-blur-sm
          `}>
             <p className={`text-justify font-serif text-[13px] leading-6 ${theme.nameText} opacity-90 indent-6`}>
               {data.fortune}
             </p>
          </div>

        </div>
      </div>

      {/* Buttons Container */}
      <div className="flex flex-col gap-3">
        {/* Main: Download Button */}
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`
            w-full py-3 rounded-xl relative overflow-hidden group
            bg-gradient-to-r from-purple-700 to-indigo-800
            border border-purple-400/50
            text-white font-bold text-lg tracking-widest
            shadow-lg
            transition-all duration-300 transform active:scale-[0.98]
            flex items-center justify-center gap-2
            ${isDownloading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}
          `}
        >
          {isDownloading ? (
             <span>生成中...</span>
          ) : (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ffd700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
               <span>下载卡片</span>
             </>
          )}
        </button>

        {/* Retest Button (Ghost Style) */}
        {onRetest && (
          <button 
            onClick={onRetest}
            className="
              w-full py-3 mt-1
              text-white/40 text-sm font-serif tracking-widest
              hover:text-[#ffd700] hover:bg-white/5
              rounded-lg transition-colors duration-300
              flex items-center justify-center gap-2
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            再测一次
          </button>
        )}
      </div>

      {/* --- AI Workshop Section --- */}
      <div className="w-full mt-8 pt-8 border-t border-white/10 flex flex-col gap-4 animate-fade-in">
         <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-5 bg-[#ffd700] rounded-full"></div>
            <h2 className="text-xl font-bold text-white font-serif tracking-widest">AI 星宿工坊</h2>
         </div>
         
         <div className="bg-[#1a1c24] border border-white/10 rounded-xl p-4 flex flex-col gap-4">
            <p className="text-xs text-gray-400">选择任意星宿，召唤独一无二的专属神兽。</p>
            
            <select 
               value={workshopId}
               onChange={(e) => setWorkshopId(Number(e.target.value))}
               className="w-full bg-black/50 border border-white/20 text-white rounded-lg p-3 outline-none focus:border-[#ffd700]"
            >
               {CONSTELLATIONS.map((c) => (
                  <option key={c.id} value={c.id}>{c.fullName} ({c.direction})</option>
               ))}
            </select>

            <button
               onClick={handleGenerateAiImage}
               disabled={isGenerating}
               className={`
                  w-full py-3 rounded-lg border border-[#ffd700]/30
                  bg-gradient-to-r from-orange-600 to-red-700
                  text-white font-bold tracking-widest shadow-lg
                  hover:scale-[1.01] active:scale-[0.99] transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed
               `}
            >
               {isGenerating ? 'AI 绘制中...' : '✨ AI 祈愿 (生成)'}
            </button>

            {aiImage && (
               <div className="flex flex-col gap-3 mt-2 animate-fade-in">
                  <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden border border-white/20">
                     <img src={aiImage} alt="AI Generated" className="w-full h-full object-cover" />
                  </div>
                  <button
                     onClick={handleDownloadAiImage}
                     className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white rounded-lg transition-colors"
                  >
                     保存原图
                  </button>
               </div>
            )}
         </div>
      </div>

    </div>
  );
};

export default ResultCard;
