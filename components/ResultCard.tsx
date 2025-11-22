import React, { useState } from 'react';
import { ConstellationData } from '../types';

interface ResultCardProps {
  data: ConstellationData;
}

const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-lg mx-auto perspective-1000 animate-fade-in">
      {/* Decorative Border Container */}
      <div className="relative bg-stone-100 rounded-lg overflow-hidden shadow-2xl border-8 border-stone-800">
        
        {/* Inner Border */}
        <div className="absolute inset-0 border-2 border-amber-600/30 pointer-events-none m-2 rounded-sm z-20"></div>

        {/* Header Section */}
        <div className="bg-stone-900 text-amber-500 p-6 text-center relative overflow-hidden z-30">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
            <h3 className="text-sm font-serif tracking-[0.5em] uppercase opacity-80 mb-2">{data.direction}</h3>
            <h1 className="text-5xl font-calligraphy text-amber-400 drop-shadow-lg z-10 relative">{data.fullName}</h1>
        </div>

        {/* Image Section (Divine Beast) */}
        <div className="relative h-80 w-full overflow-hidden bg-stone-900 group">
          {/* Loading State for Image */}
          {!imgLoaded && (
             <div className="absolute inset-0 flex items-center justify-center text-amber-700/50 font-serif animate-pulse">
                神兽显形中...
             </div>
          )}
          {/* 
             In a real backend scenario, src would be a relative path like "/assets/beasts/jiao.jpg".
             Here we use the static URL provided by our data service.
          */}
          <img 
            src={data.imageUrl} 
            alt={data.fullName}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${imgLoaded ? 'opacity-90 scale-100' : 'opacity-0 scale-105'} group-hover:scale-110`}
          />
          {/* Subtle gradient for text readability at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-900/90 to-transparent pointer-events-none"></div>
          
          {/* Element Badge */}
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-amber-500/50 flex items-center justify-center bg-stone-900/80 text-amber-500 font-serif text-xl font-bold shadow-lg backdrop-blur-sm z-20">
            {data.element}
          </div>
          
          {/* Animal Label */}
          <div className="absolute bottom-4 left-4 text-stone-200 font-calligraphy text-2xl z-20 drop-shadow-md">
             {data.animal}神
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 pt-6 bg-stone-100 relative">
          
          {/* Traditional Poem */}
          <div className="text-center mb-8">
            <div className="inline-block border-t border-b border-stone-300 py-2 px-6">
              <p className="text-stone-800 font-serif text-lg italic">"{data.poem}"</p>
            </div>
          </div>

          {/* Description Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Traditional Description */}
            <div className="bg-stone-200/50 p-4 rounded-lg border-l-4 border-stone-600">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">古诀</h4>
              <p className="text-stone-700 font-serif text-sm leading-relaxed">{data.description}</p>
            </div>

            {/* Pre-stored Fortune (Formerly AI) */}
            <div className="bg-amber-50/80 p-4 rounded-lg border-l-4 border-amber-600 relative overflow-hidden">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-2">
                星宿启示
              </h4>
              <p className="text-stone-800 font-serif text-sm leading-relaxed min-h-[80px]">
                {data.fortune}
              </p>
              <div className="absolute -right-4 -bottom-4 text-9xl text-amber-200 opacity-20 font-calligraphy pointer-events-none select-none">
                {data.name}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
             <div className="text-[10px] text-stone-400 uppercase tracking-widest">Star Destiny Record</div>
          </div>
        </div>
      </div>
      
      {/* Shine Effects */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500 blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 blur-[100px] opacity-20 pointer-events-none"></div>
    </div>
  );
};

export default ResultCard;