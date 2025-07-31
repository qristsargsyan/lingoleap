
export interface Language {
  id: string;
  name: string;
  flag: string;
}

export interface Exercise {
  type: 'fill-in-the-blank' | 'multiple-choice' | 'translation';
  question: string;
  options?: string[];
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}
