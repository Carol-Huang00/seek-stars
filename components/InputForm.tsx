import React, { useState } from 'react';

interface InputFormProps {
  onSubmit: (date: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    if (!date) {
      setError('请选择出生日期');
      return;
    }
    setError('');
    onSubmit(date);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] animate-fade-in relative z-10 p-4">
      
      {/* Top Glow Effect */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-600/30 blur-[60px] rounded-full pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Title Section */}
        <div className="text-center mb-10 relative">
          <h1 className="text-3xl font-bold text-white mb-3 tracking-wide drop-shadow-lg">
            选择你的生日日期
          </h1>
          <p className="text-[#a0aec0] text-sm tracking-widest font-light">
            探索你的灵魂星宿与命运守护
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full bg-[#1a1c24]/90 backdrop-blur-md border border-white/10 rounded-[24px] p-8 shadow-2xl relative overflow-hidden">
           
           {/* Subtle gradient border effect */}
           <div className="absolute inset-0 rounded-[24px] border border-white/5 pointer-events-none"></div>

           {/* Input Label */}
           <div className="flex items-center gap-2 mb-3 text-[#e2e8f0] text-sm font-medium">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#a0aec0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
             出生日期 (新历)
           </div>

           {/* Input Field */}
           <div className="relative mb-8 group">
             <input 
               type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               className="
                 w-full bg-[#0f1014] border border-[#2d3748] 
                 text-white text-lg px-4 py-4 rounded-xl
                 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]
                 transition-all duration-300
                 placeholder-gray-600
                 appearance-none
               "
               style={{ colorScheme: 'dark' }} 
             />
             {/* Custom Calendar Icon (Visual only, relying on native picker) */}
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
           </div>

           {/* Error Message */}
           {error && (
             <p className="text-red-400 text-xs text-center mb-4 absolute top-20 left-0 w-full animate-pulse">
               {error}
             </p>
           )}

           {/* Action Button */}
           <button 
             onClick={handleSubmit}
             className="
               w-full py-4 rounded-xl
               bg-gradient-to-r from-[#7c3aed] to-[#5b21b6]
               hover:from-[#6d28d9] hover:to-[#4c1d95]
               text-white font-bold text-lg tracking-widest
               shadow-[0_4px_14px_0_rgba(124,58,237,0.39)]
               transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
               flex items-center justify-center
             "
           >
             查看我的星宿
           </button>

           {/* Footer Security Note */}
           <div className="mt-6 flex items-center justify-center gap-1.5 text-[#718096] text-xs">
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