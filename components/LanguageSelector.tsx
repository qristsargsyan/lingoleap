
import React, { useState } from 'react';
import type { Language } from '../types';
import Icon from './common/Icon';

interface LanguageSelectorProps {
  languages: Language[];
  onStart: (name: string, language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, onStart }) => {
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleStart = () => {
    if (name.trim() && selectedLanguage) {
      onStart(name, selectedLanguage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-2xl text-center">
        <Icon name="teacher" className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 font-display">Welcome to LingoLeap AI</h1>
        <p className="mt-4 text-lg text-slate-600">Your personal AI-powered journey to mastering a new language.</p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 mt-10">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            First, what's your name?
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Alex"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Next, choose a language to learn:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang)}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-200 ${
                  selectedLanguage?.id === lang.id
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
              >
                <span className="text-3xl">{lang.flag}</span>
                <span className="mt-2 text-sm font-semibold text-slate-700">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim() || !selectedLanguage}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Start Learning
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
