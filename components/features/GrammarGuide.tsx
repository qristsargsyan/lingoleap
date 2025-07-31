import React, { useState, useCallback } from 'react';
import { generateGrammarGuide } from '../../services/geminiService';
import type { Language } from '../../types';
import Spinner from '../common/Spinner';
import Icon from '../common/Icon';

interface GrammarGuideProps {
  language: Language;
}

const commonGrammarTopics = [
    "Verb Tenses (Present, Past, Future)",
    "Articles (a, an, the)",
    "Nouns and Gender",
    "Adjective Agreement",
    "Prepositions of Place",
    "Forming Questions",
    "Sentence Structure",
    "Conditional Clauses",
];

const GrammarGuide: React.FC<GrammarGuideProps> = ({ language }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!topic) {
      setError('Please enter a grammar topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setContent('');
    try {
      const generatedContent = await generateGrammarGuide(language, topic, level);
      setContent(generatedContent);
    } catch (e) {
        const err = e as Error;
        setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, level, language]);
  
  // Custom renderer for markdown-like text
  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-slate-700">{line.substring(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-slate-800">{line.substring(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-slate-900">{line.substring(2)}</h1>;
      if (line.match(/^\d+\./)) return <li key={index} className="ml-6 list-item list-decimal">{line.substring(line.indexOf('.') + 1).trim()}</li>;
      if (line.startsWith('* ')) return <li key={index} className="ml-6 list-item list-disc">{line.substring(2)}</li>;
      if (line.trim() === '') return <br key={index} />;
      
      const parts = line.split(/(\*\*.*?\*\*)/g); // Split by bold syntax
      return (
        <p key={index} className="text-slate-600 leading-relaxed my-1">
          {parts.map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Grammar Guide</h2>
        <p className="text-sm text-slate-500">Explore and understand {language.name} grammar rules.</p>
      </header>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Grammar Topic</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`e.g., "Verb Conjugations in ${language.name}"`}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-1">Your Level</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic}
          className="mt-4 w-full md:w-auto bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors"
        >
          {isLoading ? 'Generating...' : 'Explain Grammar'}
        </button>
         <div className="mt-4">
             <h4 className="text-sm font-medium text-slate-600 mb-2">Or try a common grammar topic:</h4>
             <div className="flex flex-wrap gap-2">
                 {commonGrammarTopics.map(t => (
                     <button key={t} onClick={() => setTopic(t)} className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full hover:bg-indigo-200 hover:text-indigo-800 transition-colors">{t}</button>
                 ))}
             </div>
         </div>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {!isLoading && !content && !error && (
            <div className="text-center text-slate-500 h-full flex flex-col justify-center items-center">
                <Icon name="grammar" className="w-16 h-16 text-slate-300 mb-4"/>
                <h3 className="text-lg font-semibold">Your grammar guide will appear here.</h3>
                <p>Enter a topic above to get started!</p>
            </div>
        )}
        {content && <div>{renderContent(content)}</div>}
      </div>
    </div>
  );
};

export default GrammarGuide;