
import React, { useState, useCallback } from 'react';
import { generateQuiz } from '../../services/geminiService';
import type { Language, QuizQuestion } from '../../types';
import Spinner from '../common/Spinner';
import Icon from '../common/Icon';

interface QuizProps {
  language: Language;
  onQuizComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ language, onQuizComplete }) => {
  const [level, setLevel] = useState('Beginner');
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartQuiz = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setQuestions(null);
    setScore(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    
    try {
      const quizQuestions = await generateQuiz(language, level);
      if (quizQuestions.length === 0) {
        setError("Could not generate a valid quiz. Please try again.");
      } else {
        setQuestions(quizQuestions);
        setUserAnswers(new Array(quizQuestions.length).fill(''));
      }
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [language, level]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (questions && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    if (!questions) return;
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (q.correctAnswer === userAnswers[index]) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    onQuizComplete(finalScore);
  };

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center h-full"><Spinner size="lg" /><p className="mt-4 text-slate-600">Generating your quiz...</p></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error} <button onClick={handleStartQuiz} className="ml-2 text-indigo-600 underline">Try Again</button></div>;
  }
  
  if(score !== null) {
    const passed = score >= 80;
    return (
        <div className="bg-white rounded-xl shadow-md p-8 text-center h-full flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-slate-800">Quiz Complete!</h2>
            <p className="text-lg text-slate-600 mt-2">Your Score:</p>
            <p className={`text-6xl font-bold my-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>{score}%</p>
            {passed ? (
                <>
                    <Icon name="certificate" className="w-16 h-16 text-green-500 mx-auto"/>
                    <p className="mt-4 text-slate-600 max-w-md">Congratulations! You've passed. You can now view your certificate in the 'Certificate' tab.</p>
                </>
            ) : (
                <p className="mt-4 text-slate-600 max-w-md">Good effort! You need a score of 80% or higher to get a certificate. Keep studying and try again!</p>
            )}
            <button onClick={handleStartQuiz} className="mt-8 bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700">
                Take Another Quiz
            </button>
        </div>
    );
  }

  if (!questions) {
    return (
      <div className="text-center h-full flex flex-col justify-center items-center bg-white rounded-xl shadow-md p-8">
        <Icon name="quiz" className="w-16 h-16 text-slate-400 mb-4"/>
        <h2 className="text-2xl font-bold text-slate-800">Ready for a Challenge?</h2>
        <p className="text-slate-500 mt-2">Test your knowledge with a quiz.</p>
        <div className="my-6">
          <label htmlFor="level-quiz" className="block text-sm font-medium text-slate-700 mb-1">Select your level:</label>
          <select id="level-quiz" value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <button onClick={handleStartQuiz} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors">
          Start Quiz
        </button>
      </div>
    );
  }
  
  const q = questions[currentQuestion];
  return (
    <div className="bg-white rounded-xl shadow-md p-8 h-full flex flex-col">
        <div className="mb-4">
            <p className="text-sm text-slate-500">Question {currentQuestion + 1} of {questions.length}</p>
            <h2 className="text-xl font-bold text-slate-800 mt-1">{q.question}</h2>
        </div>
        <div className="space-y-3 flex-grow">
            {q.options.map(option => (
                <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 border rounded-lg transition-colors ${userAnswers[currentQuestion] === option ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                >
                    {option}
                </button>
            ))}
        </div>
        <div className="mt-6 text-right">
            {currentQuestion < questions.length - 1 ? (
                 <button onClick={handleNext} disabled={!userAnswers[currentQuestion]} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400">Next</button>
            ) : (
                <button onClick={handleSubmit} disabled={!userAnswers[currentQuestion]} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 disabled:bg-slate-400">Submit Quiz</button>
            )}
        </div>
    </div>
  );
};

export default Quiz;
