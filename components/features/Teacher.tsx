
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { createChatSession } from '../../services/geminiService';
import type { Language } from '../../types';
import Icon from '../common/Icon';
import Spinner from '../common/Spinner';

interface TeacherProps {
  userName: string;
  language: Language;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Teacher: React.FC<TeacherProps> = ({ userName, language }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const initializeChat = useCallback(() => {
    setIsLoading(true);
    const newChat = createChatSession(language, userName);
    setChat(newChat);
    
    // Send an empty message to get the initial greeting
    newChat.sendMessageStream({ message: "" }).then(async (stream) => {
      let fullResponse = "";
      for await (const chunk of stream) {
          fullResponse += chunk.text;
      }
      setMessages([{ sender: 'ai', text: fullResponse }]);
      setIsLoading(false);
    }).catch(error => {
      console.error("Failed to initialize chat:", error);
      setMessages([{ sender: 'ai', text: "Hello! I'm having a little trouble connecting right now. Please try again in a moment." }]);
      setIsLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, userName]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);


  const handleSend = async () => {
    if (input.trim() === '' || !chat || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: input });
      let fullResponse = "";
      let aiMessage: Message = { sender: 'ai', text: '...' };

      // Add a placeholder message for AI
      setMessages((prev) => [...prev, aiMessage]);

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'ai', text: fullResponse + " ▌" };
          return newMessages;
        });
      }
      
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { sender: 'ai', text: fullResponse };
        return newMessages;
      });

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { sender: 'ai', text: "I'm sorry, I encountered an error. Could you please rephrase your question?" };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-md">
      <header className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Your AI Teacher</h2>
        <p className="text-sm text-slate-500">Ask me anything about {language.name}!</p>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center flex-shrink-0"><Icon name="robot" className="w-5 h-5"/></div>}
            <div className={`max-w-lg px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
               <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center flex-shrink-0"><Icon name="robot" className="w-5 h-5"/></div>
              <div className="max-w-lg px-4 py-2 rounded-xl bg-slate-200 text-slate-800">
                <Spinner size="sm" />
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200 mt-auto">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message your teacher...`}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Icon name="send" className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
