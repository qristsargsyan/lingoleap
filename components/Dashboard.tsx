import React, { useState } from 'react';
import type { Language, Exercise } from '../types';
import type { View } from '../constants';
import Icon from './common/Icon';
import Teacher from './features/Teacher';
import StudyBook from './features/StudyBook';
import GrammarGuide from './features/GrammarGuide';
import ExerciseBook from './features/ExerciseBook';
import AnswerBook from './features/AnswerBook';
import Quiz from './features/Quiz';
import Certificate from './features/Certificate';

interface DashboardProps {
  userName: string;
  language: Language;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, language, onReset }) => {
  const [activeView, setActiveView] = useState<View>('teacher');
  const [exercises, setExercises] =useState<Exercise[] | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const navItems: { id: View; name: string; icon: string; disabled?: boolean }[] = [
    { id: 'teacher', name: 'AI Teacher', icon: 'teacher' },
    { id: 'study', name: 'Study Book', icon: 'study' },
    { id: 'grammar', name: 'Grammar Guide', icon: 'grammar' },
    { id: 'exercise', name: 'Exercise Book', icon: 'exercise' },
    { id: 'answers', name: 'Answer Book', icon: 'answers', disabled: !exercises },
    { id: 'quiz', name: 'Take a Quiz', icon: 'quiz' },
    { id: 'certificate', name: 'Certificate', icon: 'certificate', disabled: !quizScore || quizScore < 80 },
  ];
  
  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    // Automatically switch to certificate view if passed
    if (score >= 80) {
      setActiveView('certificate');
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'teacher':
        return <Teacher userName={userName} language={language} />;
      case 'study':
        return <StudyBook language={language} />;
      case 'grammar':
        return <GrammarGuide language={language} />;
      case 'exercise':
        return <ExerciseBook language={language} onExercisesGenerated={setExercises} />;
      case 'answers':
        return <AnswerBook exercises={exercises} />;
      case 'quiz':
        return <Quiz language={language} onQuizComplete={handleQuizComplete} />;
      case 'certificate':
        return <Certificate userName={userName} language={language} score={quizScore ?? 0} />;
      default:
        return <Teacher userName={userName} language={language} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="no-print w-64 bg-white flex flex-col p-4 border-r border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl">{language.flag}</span>
            <div>
                <h1 className="text-xl font-bold text-indigo-700 font-display">LingoLeap</h1>
                <p className="text-sm text-slate-600">Learning {language.name}</p>
            </div>
        </div>
        <nav className="flex-grow">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeView === item.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-200'
                  } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon name={item.icon} className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
            <button
              onClick={onReset}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-100 hover:text-red-700 transition-colors"
            >
              <Icon name="logout" className="w-5 h-5" />
              <span>Change Language</span>
            </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;