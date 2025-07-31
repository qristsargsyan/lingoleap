
import React, { useState, useCallback } from 'react';
import { generateExercises } from '../../services/geminiService';
import type { Language, Exercise } from '../../types';
import Spinner from '../common/Spinner';
import Icon from '../common/Icon';

interface ExerciseBookProps {
  language: Language;
  onExercisesGenerated: (exercises: Exercise[]) => void;
}

const ExerciseBook: React.FC<ExerciseBookProps> = ({ language, onExercisesGenerated }) => {
  const [topic, setTopic] = useState('Basic Greetings');
  const [level, setLevel] = useState('Beginner');
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setExercises(null);
    onExercisesGenerated([]);

    try {
      const generatedExercises = await generateExercises(language, topic, level);
      setExercises(generatedExercises);
      onExercisesGenerated(generatedExercises);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, level, language, onExercisesGenerated]);
  
  const renderExercise = (exercise: Exercise, index: number) => {
    return (
        <div key={index} className="p-4 border border-slate-200 rounded-lg">
            <p className="font-semibold text-slate-700 mb-2">{index + 1}. {exercise.question}</p>
            {exercise.type === 'multiple-choice' && exercise.options && (
                <div className="space-y-1">
                    {exercise.options.map((option, i) => (
                        <div key={i} className="flex items-center">
                            <input type="radio" name={`ex-${index}`} id={`ex-${index}-opt-${i}`} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/>
                            <label htmlFor={`ex-${index}-opt-${i}`} className="ml-3 block text-sm text-slate-600">{option}</label>
                        </div>
                    ))}
                </div>
            )}
            {exercise.type === 'fill-in-the-blank' && (
                <input type="text" className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Your answer..."/>
            )}
             {exercise.type === 'translation' && (
                <textarea className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Your translation..."></textarea>
            )}
        </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Exercise Book</h2>
        <p className="text-sm text-slate-500">Practice what you've learned.</p>
      </header>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="topic-ex" className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
            <input
              type="text"
              id="topic-ex"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Verb Conjugations"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="level-ex" className="block text-sm font-medium text-slate-700 mb-1">Your Level</label>
            <select
              id="level-ex"
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
          {isLoading ? 'Generating...' : 'Generate Exercises'}
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {!isLoading && !exercises && !error && (
             <div className="text-center text-slate-500 h-full flex flex-col justify-center items-center">
                <Icon name="exercise" className="w-16 h-16 text-slate-300 mb-4"/>
                <h3 className="text-lg font-semibold">Your exercises will appear here.</h3>
                <p>Generate a new set to start practicing.</p>
            </div>
        )}
        {exercises && (
            <div className="space-y-4">
                <p className="text-sm text-slate-600">Complete the exercises below. Check your answers in the 'Answer Book' tab.</p>
                {exercises.map(renderExercise)}
            </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseBook;
