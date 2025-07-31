import type { Language } from './types';

export const LANGUAGES: Language[] = [
  { id: 'armenian', name: 'Armenian', flag: '🇦🇲' },
  { id: 'english', name: 'English', flag: '🇺🇸' },
  { id: 'french', name: 'French', flag: '🇫🇷' },
  { id: 'german', name: 'German', flag: '🇩🇪' },
  { id: 'italian', name: 'Italian', flag: '🇮🇹' },
  { id: 'japanese', name: 'Japanese', flag: '🇯🇵' },
  { id: 'korean', name: 'Korean', flag: '🇰🇷' },
  { id: 'mandarin', name: 'Mandarin', flag: '🇨🇳' },
  { id: 'portuguese', name: 'Portuguese', flag: '🇵🇹' },
  { id: 'russian', name: 'Russian', flag: '🇷🇺' },
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
];

export type View = 'teacher' | 'study' | 'grammar' | 'exercise' | 'answers' | 'quiz' | 'certificate';