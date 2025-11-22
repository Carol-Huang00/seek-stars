import React, { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEY, UserRecord, ConstellationData } from './types';
import { calculateConstellation } from './utils/calculator';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { getConstellationByIndex } from './services/constellationData';

const App: React.FC = () => {
  const [record, setRecord] = useState<UserRecord | null>(null);
  const [displayData, setDisplayData] = useState<ConstellationData | null>(null);
  const [initLoading, setInitLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: UserRecord = JSON.parse(stored);
        setRecord(parsed);
        setDisplayData(getConstellationByIndex(parsed.constellationId));
      } catch (e) {
        console.error("Storage parse error", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    setInitLoading(false);
  }, []);

  // Handle new submission
  const handleSubmission = (dateStr: string) => {
    // 1. Calculate (All logic is local)
    const constellation = calculateConstellation(dateStr);
    setDisplayData(constellation);

    // 2. Create Record Wrapper
    // Note: aiInterpretation is removed, we rely on the static data in `constellation` object
    const newRecord: UserRecord = {
      birthDate: dateStr,
      constellationId: constellation.id,
      timestamp: Date.now(),
    };

    // 3. Save to LocalStorage (simulating backend save)
    setRecord(newRecord);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecord));
  };

  if (initLoading) {
    return <div className="min-h-screen bg-stone-900 flex items-center justify-center text-amber-500">加载中...</div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-stone-800/50 rounded-full blur-3xl"></div>
      </div>

      <header className="relative z-10 mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-calligraphy text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-700 drop-shadow-sm mb-2">
          二十八星宿
        </h1>
        <p className="text-stone-500 font-serif tracking-widest text-xs md:text-sm uppercase">
          The 28 Lunar Mansions
        </p>
      </header>

      <main className="relative z-10 w-full flex flex-col items-center">
        {!record ? (
          <InputForm onSubmit={handleSubmission} />
        ) : (
          displayData && (
            <div className="animate-fade-in">
              <ResultCard 
                data={displayData} 
              />
              <div className="mt-8 text-center">
                 <p className="text-stone-500 text-sm mb-2">您已完成测算</p>
                 <button 
                    onClick={() => window.print()}
                    className="text-amber-600 border border-amber-600/50 px-6 py-2 rounded-full text-sm hover:bg-amber-600 hover:text-stone-900 transition-colors duration-300 cursor-pointer"
                 >
                   保存星宿卡片
                 </button>
              </div>
            </div>
          )
        )}
      </main>

      <footer className="relative z-10 mt-12 text-stone-600 text-xs font-serif opacity-50">
        &copy; {new Date().getFullYear()} Star Destiny. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;