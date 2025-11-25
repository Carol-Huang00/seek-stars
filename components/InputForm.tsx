
import React, { useState } from 'react';

interface InputFormProps {
  onSubmit: (date: string, name: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [date, setDate] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    if (!date) {
      setError('请选择出生日期');
      return;
    }
    // Name is optional but recommended. We pass it even if empty (App handles default)
    setError('');
    onSubmit(date, name);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] animate-fade-in relative z-10 p-4">
      
      {/* Top Glow Effect */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Card Container - Game UI Style */}
        <div className="w-full bg-[#1a1c24]/90 backdrop-blur-xl border border-[#7c3aed]/20 rounded-[20px] p-8 shadow-2xl relative overflow-hidden">
           
           {/* Subtle gradient border effect */}
           <div className="absolute inset-0 rounded-[20px] border border-white/5 pointer-events-none"></div>
           
           {/* Decorative L-Corners (Game Style) - Changed to Purple */}
           <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#7c3aed]/50 rounded-tl-lg pointer-events-none"></div>
           <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#7c3aed]/50 rounded-tr-lg pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#7c3aed]/50 rounded-bl-lg pointer-events-none"></div>
           <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#7c3aed]/50 rounded-br-lg pointer-events-none"></div>

           {/* Title Section inside Card */}
           <div className="text-center mb-10 mt-2">
             <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-md font-serif">
               请输入你的信息
             </h1>
           </div>

           {/* Name Input Section */}
           <div className="mb-6">
             <div className="flex items-center gap-2 mb-2 text-[#e2e8f0] text-sm font-medium opacity-80">
               {/* Icon changed to Purple */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
               姓名 / 昵称
             </div>
             <input 
               type="text"
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="请输入您的称呼"
               className="
                 w-full bg-[#0b0c15]/60 border border-white/10 border-b-2 border-b-white/20
                 text-white text-lg px-4 py-3 rounded-lg
                 focus:outline-none focus:border-b-[#7c3aed] focus:bg-[#0b0c15]/80
                 transition-all duration-300
                 placeholder-gray-600
               "
             />
           </div>

           {/* Date Input Section */}
           <div className="mb-8">
             <div className="flex items-center gap-2 mb-2 text-[#e2e8f0] text-sm font-medium opacity-80">
               {/* Icon changed to Purple */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               出生日期 (新历)
             </div>
             <div className="relative group">
               <input 
                 type="date"
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="
                   w-full bg-[#0b0c15]/60 border border-white/10 border-b-2 border-b-white/20
                   text-white text-lg px-4 py-3 rounded-lg
                   focus:outline-none focus:border-b-[#7c3aed] focus:bg-[#0b0c15]/80
                   transition-all duration-300
                   placeholder-gray-600
                   appearance-none
                   shadow-inner
                 "
                 style={{ colorScheme: 'dark' }} 
               />
             </div>
           </div>

           {/* Error Message */}
           {error && (
             <p className="text-red-400 text-xs text-center mb-4 animate-pulse">
               {error}
             </p>
           )}

           {/* Action Button */}
           <button 
             onClick={handleSubmit}
             className="
               w-full py-4 rounded-xl relative overflow-hidden group
               bg-gradient-to-r from-[#7c3aed] to-[#5b21b6]
               border border-[#7c3aed]/30
               text-white font-bold text-lg tracking-widest
               shadow-[0_0_20px_rgba(124,58,237,0.3)]
               transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
               flex items-center justify-center
             "
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
             查看星宿
           </button>

           {/* Footer Security Note */}
           <div className="mt-6 flex items-center justify-center gap-1.5 text-[#718096] text-xs opacity-60">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
             数据仅用于内部娱乐
           </div>

        </div>
      </div>
    </div>
  );
};

export default InputForm;
