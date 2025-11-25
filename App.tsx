
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
    // 1. Check local record (for UI persistence)
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

  const handleSubmission = (dateStr: string, name: string) => {
    const constellation = calculateConstellation(dateStr);
    setDisplayData(constellation);
    
    // Use provided name or default to '旅人' if empty
    const finalName = name.trim() || "旅人";
    
    const newRecord: UserRecord = {
      birthDate: dateStr,
      constellationId: constellation.id,
      timestamp: Date.now(),
      userName: finalName
    };

    // Always update local UI state
    setRecord(newRecord);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecord));

    // CORE LOGIC UPDATE: Always save to backend for every query
    // We no longer check if it was previously synced.
    console.log("Submitting record to Feishu...");
    saveToBackend(newRecord, constellation.fullName);
  };

  const handleRetest = () => {
    // Clear current display record to show InputForm again
    setRecord(null);
    setDisplayData(null);
  };

  if (initLoading) return null;

  if (!started) {
    return <CoverPage onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-y-auto">
      <main className="relative z-10 w-full flex flex-col items-center justify-center min-h-[80vh] py-10">
        {!record ? (
          <InputForm onSubmit={handleSubmission} />
        ) : (
          displayData && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <ResultCard 
                data={displayData} 
                userName={record.userName} 
                onRetest={handleRetest} // Pass retest handler
              />
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default App;
