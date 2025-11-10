import React, { useState, useEffect, useCallback } from 'react';
import { Tab, Calculation, Course } from './types';
import LiteratureCalculator from './components/LiteratureCalculator';
import EnglishCalculator from './components/EnglishCalculator';
import OverallAverageCalculator from './components/OverallAverageCalculator';
import More from './components/More';
import CourseGradeCalculator from './components/CourseGradeCalculator';
import InfoBox from './components/InfoBox';

const BookIcon = () => ( // New: BookOpenIcon
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const ChartPieIcon = () => ( // New: ChartPieIcon
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);

const MoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);


const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const BottomNavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 focus:outline-none rounded-lg ${isActive ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-slate-700/50' : 'text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'}`}
        >
            {icon}
            <span className="mt-1 text-sm">{label}</span>
        </button>
    );
};

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const ThemeToggle: React.FC<{ theme: string; setTheme: (theme: string) => void }> = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};


export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('literature');
  const [history, setHistory] = useState<Calculation[]>([]);
  const [coursesToRestore, setCoursesToRestore] = useState<Course[] | null>(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    // Check for a saved theme in localStorage.
    const savedTheme = localStorage.getItem('theme');
    // If a valid theme is saved, use it. Otherwise, default to 'light'.
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    // Set color-scheme to keep browser UI in sync with the app's theme.
    root.style.colorScheme = theme;

    if (theme === 'dark') {
      root.classList.add('dark');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#0f172a'); // slate-900 to match header/nav
      }
    } else {
      root.classList.remove('dark');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#f8fafc'); // slate-50 to match background
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('calculationHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('calculationHistory', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  }, [history]);

  const addCalculationToHistory = useCallback((type: string, result: number, courses?: Course[]) => {
    const newCalculation: Calculation = {
      id: Date.now().toString(),
      type,
      result,
      timestamp: new Date().toISOString(),
      ...(courses && { courses }),
    };
    setHistory(prevHistory => [newCalculation, ...prevHistory]);
  }, []);
  
  const removeCalculationFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    if (window.confirm("Hesaplama geçmişini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
        setHistory([]);
    }
  }, []);
  
  const resetApplication = useCallback(() => {
    if (window.confirm("Tüm uygulama verilerini (geçmiş ve ayarlar) silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
        setHistory([]);
        localStorage.clear();
        // Force reload to apply default settings.
        window.location.reload();
        alert("Uygulama verileri sıfırlandı. Sayfa yeniden başlatılıyor.");
    }
  }, []);

  const handleImportHistory = useCallback((importedHistory: Calculation[]) => {
      setHistory(importedHistory);
  }, []);

  const handleRestoreCalculation = useCallback((calculation: Calculation) => {
    if (calculation.type === 'Genel Ortalama' && calculation.courses) {
        setCoursesToRestore(calculation.courses);
        setActiveTab('overall');
    }
  }, []);

  const handleCoursesRestored = useCallback(() => {
    setCoursesToRestore(null);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'literature':
        return <LiteratureCalculator onCalculate={addCalculationToHistory} />;
      case 'english':
        return <EnglishCalculator onCalculate={addCalculationToHistory} />;
      case 'course':
        return <CourseGradeCalculator onCalculate={addCalculationToHistory} />;
      case 'overall':
        return <OverallAverageCalculator 
                  onCalculate={addCalculationToHistory} 
                  initialCourses={coursesToRestore}
                  onRestored={handleCoursesRestored}
                />;
      case 'more':
        return <More 
                    history={history} 
                    onClearHistory={clearHistory} 
                    onRestoreCalculation={handleRestoreCalculation} 
                    onRemoveCalculation={removeCalculationFromHistory} 
                    onImportHistory={handleImportHistory}
                    theme={theme}
                    setTheme={setTheme}
                    onResetApplication={resetApplication}
                />;
      default:
        return null;
    }
  };

  return (
    <div className="mobile-container bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <header className="relative flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 z-10">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Not Hesaplayıcı+</h1>
            <ThemeToggle theme={theme} setTheme={setTheme} />
        </header>

        <main className="relative z-0 flex-grow flex flex-col overflow-y-auto pb-24">
          {renderContent()}
        </main>

        <nav className="absolute bottom-0 left-0 right-0 flex justify-around p-2 gap-1 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
            <BottomNavItem label="Edebiyat" icon={<BookIcon />} isActive={activeTab === 'literature'} onClick={() => setActiveTab('literature')} />
            <BottomNavItem label="İngilizce" icon={<GlobeIcon />} isActive={activeTab === 'english'} onClick={() => setActiveTab('english')} />
            <BottomNavItem label="Ders Notu" icon={<PencilIcon />} isActive={activeTab === 'course'} onClick={() => setActiveTab('course')} />
            <BottomNavItem label="Genel" icon={<ChartPieIcon />} isActive={activeTab === 'overall'} onClick={() => setActiveTab('overall')} />
            <BottomNavItem label="Daha Fazla" icon={<MoreIcon />} isActive={activeTab === 'more'} onClick={() => setActiveTab('more')} />
        </nav>
    </div>
  );
}