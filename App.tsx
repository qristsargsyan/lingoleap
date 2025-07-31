
import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import Dashboard from './components/Dashboard';
import type { Language } from './types';
import { LANGUAGES } from './constants';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [language, setLanguage] = useState<Language | null>(null);

  const handleStartLearning = (name: string, lang: Language) => {
    setUserName(name);
    setLanguage(lang);
  };

  const handleReset = () => {
    setUserName('');
    setLanguage(null);
  }

  return (
    <div className="min-h-screen w-full bg-slate-100">
      {language && userName ? (
        <Dashboard userName={userName} language={language} onReset={handleReset} />
      ) : (
        <LanguageSelector languages={LANGUAGES} onStart={handleStartLearning} />
      )}
    </div>
  );
};

export default App;
