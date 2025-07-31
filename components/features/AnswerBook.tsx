
import React from 'react';
import type { Exercise } from '../../types';
import Icon from '../common/Icon';

interface AnswerBookProps {
  exercises: Exercise[] | null;
}

const AnswerBook: React.FC<AnswerBookProps> = ({ exercises }) => {
  return (
    <div className="h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Answer Book</h2>
        <p className="text-sm text-slate-500">Check your answers for the latest set of exercises.</p>
      </header>

      <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-y-auto">
        {!exercises || exercises.length === 0 ? (
          <div className="text-center text-slate-500 h-full flex flex-col justify-center items-center">
            <Icon name="answers" className="w-16 h-16 text-slate-300 mb-4"/>
            <h3 className="text-lg font-semibold">No exercises found.</h3>
            <p>Go to the 'Exercise Book' to generate a new set first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-700 mb-2">{index + 1}. {exercise.question}</p>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">Answer:</span>
                  <p className="text-green-700">{exercise.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerBook;
