/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'fr' | 'rw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n, t, ready } = useTranslation();
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Set initial language from localStorage or browser
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'fr', 'rw'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      // Default to English if no saved language
      setLanguageState('en');
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const translationFunction = (key: string, options?: any): string => {
    return t(key, options) as string;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t: translationFunction,
        isReady: ready 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};