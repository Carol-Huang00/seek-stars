import React, { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEY, UserRecord, ConstellationData } from './types';
import { calculateConstellation } from './utils/calculator';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import CoverPage from './components/CoverPage';
import { getConstellationByIndex } from './services/constellationData';
import { saveToBackend } from './services/sheetService';

const App: React.FC = () => {
  const [record, setRecord] = useState<UserRecord | null>(null);
  const [displayData, setDisplayData] = useState<ConstellationData | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: UserRecord = JSON.parse(stored);
        setRecord(parsed);
        setDisplayData(getConstellationByIndex(parsed.constellationId));
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    setInitLoading(false);
  }, []);

  const handleSubmission = (dateStr: string) => {
    const constellation = calculateConstellation(dateStr);
    setDisplayData(constellation);
    // Assuming user name input might be added back later or using default
    const userName = "旅人"; 
    const newRecord: UserRecord = {
      birthDate: dateStr,
      constellationId: constellation.id,
      timestamp: Date.now(),
      userName: userName
    };
    setRecord(newRecord);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecord));
    saveToBackend(newRecord, constellation.fullName);
  };

  if (initLoading) return null;

  if (!started) {
    return <CoverPage onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <main className="relative z-10 w-full flex flex-col items-center justify-center min-h-[80vh]">
        {!record ? (
          <InputForm onSubmit={handleSubmission} />
        ) : (
          displayData && (
            <div className="w-full flex flex-col items-center">
              <ResultCard data={displayData} userName={record.userName} />
              <button 
                onClick={() => {
                  setRecord(null); 
                  localStorage.removeItem(LOCAL_STORAGE_KEY);
                }}
                className="mt-8 text-white/50 text-xs border-b border-white/20 pb-1 hover:text-white transition-colors"
              >
                重测
              </button>
            </div>
          )
        )}
      </main>
      <footer className="fixed bottom-4 text-white/20 text-[10px] font-serif uppercase tracking-widest z-0 pointer-events-none">
        Star Destiny
      </footer>
    </div>
  );
};

export default App;