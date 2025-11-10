import React, { useState } from 'react';
import { Calculation } from '../types';
import HistoryDisplay from './HistoryDisplay';
import Settings from './Settings';
import Jarvis from './Jarvis';
import Reports from './Reports';

type View = 'main' | 'history' | 'settings' | 'jarvis' | 'reports';

interface MoreProps {
    history: Calculation[];
    onClearHistory: () => void;
    onRestoreCalculation: (calculation: Calculation) => void;
    onRemoveCalculation: (id: string) => void;
    onImportHistory: (calculations: Calculation[]) => void;
    theme: string;
    setTheme: (theme: string) => void;
    onResetApplication: () => void;
}

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const More: React.FC<MoreProps> = (props) => {
    const [view, setView] = useState<View>('main');
    
    const getTitle = () => {
        switch(view) {
            case 'history': return 'Hesaplama Geçmişi';
            case 'settings': return 'Ayarlar';
            case 'jarvis': return 'Jarvis AI';
            case 'reports': return 'Raporlar ve Grafikler';
            default: return 'Daha Fazla';
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'history':
                return <HistoryDisplay 
                          history={props.history} 
                          onClear={props.onClearHistory} 
                          onRestore={props.onRestoreCalculation} 
                          onRemove={props.onRemoveCalculation} 
                          onImport={props.onImportHistory}
                       />;
            case 'settings':
                return <Settings
                          theme={props.theme}
                          setTheme={props.setTheme}
                          onResetApplication={props.onResetApplication}
                       />;
            case 'jarvis':
                return <Jarvis />;
            case 'reports':
                return <Reports history={props.history} />;
            default: // main
                return (
                    <div className="space-y-3">
                        <MenuItem icon={<HistoryIcon />} label="Hesaplama Geçmişi" onClick={() => setView('history')} />
                        <MenuItem icon={<ChartBarIcon />} label="Raporlar ve Grafikler" onClick={() => setView('reports')} />
                        <MenuItem icon={<SettingsIcon />} label="Ayarlar" onClick={() => setView('settings')} />
                        <MenuItem icon={<SparklesIcon />} label="Jarvis AI" onClick={() => setView('jarvis')} />
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col justify-center flex-grow p-4 sm:p-6 animate-fade-slide-up">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center mb-6">
                    {view !== 'main' && (
                        <button onClick={() => setView('main')} className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <ArrowLeftIcon />
                        </button>
                    )}
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{getTitle()}</h2>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
        <div className="text-primary-600 dark:text-primary-400 mr-4">{icon}</div>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        <div className="ml-auto text-slate-400">
            <ChevronRightIcon />
        </div>
    </button>
);


export default More;