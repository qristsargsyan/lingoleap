
import React from 'react';
import type { Language } from '../../types';
import Icon from '../common/Icon';

interface CertificateProps {
  userName: string;
  language: Language;
  score: number;
}

const Certificate: React.FC<CertificateProps> = ({ userName, language, score }) => {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (score < 80) {
      return (
         <div className="h-full flex flex-col justify-center items-center text-center bg-white rounded-xl shadow-md p-8">
             <Icon name="certificate" className="w-16 h-16 text-slate-400 mb-4"/>
             <h2 className="text-2xl font-bold text-slate-800">Certificate Locked</h2>
             <p className="text-slate-500 mt-2 max-w-md">You need to score at least 80% on the quiz to unlock your certificate. Keep studying and try the quiz again!</p>
         </div>
      )
  }
  
  const handlePrint = () => {
      window.print();
  }

  return (
    <div className="h-full flex flex-col">
        <header className="no-print mb-6 flex justify-between items-center">
            <div>
                 <h2 className="text-2xl font-bold text-slate-800">Your Certificate</h2>
                <p className="text-sm text-slate-500">Congratulations on your achievement!</p>
            </div>
            <button onClick={handlePrint} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700">
                Print Certificate
            </button>
        </header>
        
        <div className="flex-1 bg-white flex items-center justify-center p-4">
             <div className="w-full max-w-4xl aspect-[1.414] border-8 border-indigo-800 bg-slate-50 p-8 flex flex-col items-center justify-center text-center relative shadow-2xl"
                  style={{ backgroundImage: `
                    radial-gradient(circle at top left, rgba(239, 246, 255, 0.8), transparent 40%),
                    radial-gradient(circle at bottom right, rgba(239, 246, 255, 0.8), transparent 40%)`
                  }}
             >
                <div className="absolute top-4 right-4 text-indigo-700/50">
                    <Icon name="certificate" className="w-24 h-24"/>
                </div>
                 <div className="absolute bottom-4 left-4 text-indigo-700/50">
                    <span className="text-8xl">{language.flag}</span>
                </div>
                
                <h1 className="font-display text-5xl font-bold text-indigo-900">Certificate of Achievement</h1>
                <p className="text-lg text-slate-600 mt-6">This certificate is proudly presented to</p>
                <p className="font-display text-4xl text-slate-800 my-4 border-b-2 border-slate-400 pb-2 px-8">{userName}</p>
                <p className="text-lg text-slate-600 max-w-xl">
                    for successfully demonstrating proficiency in the <span className="font-bold">{language.name}</span> language by passing the assessment with a score of <span className="font-bold">{score}%</span>.
                </p>
                <div className="flex justify-between w-full max-w-lg mt-16 text-slate-700">
                    <div>
                        <p className="font-semibold border-b-2 border-slate-400 pb-1">{date}</p>
                        <p className="text-sm mt-1">Date</p>
                    </div>
                     <div>
                        <p className="font-display text-2xl border-b-2 border-slate-400 pb-1 px-4">LingoLeap AI</p>
                        <p className="text-sm mt-1">Issuing Authority</p>
                    </div>
                </div>
             </div>
        </div>
    </div>
  );
};

export default Certificate;
