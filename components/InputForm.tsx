import React, { useState } from 'react';

interface InputFormProps {
  onSubmit: (date: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      onSubmit(date);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-stone-900/80 backdrop-blur-md border border-amber-700/50 rounded-2xl shadow-[0_0_30px_rgba(180,83,9,0.2)] text-center animate-fade-in-up">
      <h2 className="text-3xl font-calligraphy text-amber-500 mb-6 tracking-widest">
        探寻本命星宿
      </h2>
      <p className="text-stone-400 mb-8 font-serif text-sm leading-relaxed">
        请输入您的阳历（新历）出生日期<br/>系统将推演您命中所属的二十八星宿
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-stone-800 border-b-2 border-stone-600 text-stone-200 text-center py-3 px-4 focus:outline-none focus:border-amber-500 focus:bg-stone-800/50 transition-colors font-serif text-lg placeholder-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={!date}
          className={`w-full py-3 px-6 rounded-full font-serif font-bold tracking-widest transition-all duration-300
            ${date 
              ? 'bg-gradient-to-r from-amber-700 to-red-900 text-amber-100 hover:shadow-[0_0_20px_rgba(180,83,9,0.6)] hover:scale-105 transform cursor-pointer' 
              : 'bg-stone-800 text-stone-600 cursor-not-allowed'
            }
          `}
        >
          {date ? '开启星盘' : '请选择日期'}
        </button>
      </form>
      
      <p className="mt-6 text-xs text-stone-600">
        * 每位员工仅限查询一次，请准确填写
      </p>
    </div>
  );
};

export default InputForm;