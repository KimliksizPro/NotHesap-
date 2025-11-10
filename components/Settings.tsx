import React from 'react';
import Button from './Button';

interface SettingsProps {
    theme: string;
    setTheme: (theme: string) => void;
    onResetApplication: () => void;
}

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const ExclamationTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const Settings: React.FC<SettingsProps> = ({ theme, setTheme, onResetApplication }) => {
    
    return (
        <div className="space-y-6">
            
            {/* Görünüm Bölümü */}
            <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Görünüm</h3>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700 dark:text-slate-200">Uygulama Teması</span>
                        <div className="flex items-center gap-2 rounded-full bg-slate-200 dark:bg-slate-600 p-1">
                            <button onClick={() => setTheme('light')} className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500'}`} aria-label="Açık Tema">
                                <SunIcon />
                            </button>
                            <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-800 shadow-sm text-primary-400' : 'text-slate-500'}`} aria-label="Koyu Tema">
                                <MoonIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hakkında Bölümü */}
            <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Hakkında</h3>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <p><span className="font-semibold">Versiyon:</span> 1.2.0</p>
                    <p>Bu uygulama öğrencilerin notlarını kolayca hesaplaması için tasarlanmıştır.</p>
                </div>
            </div>

            {/* Diğer Eylemler Bölümü */}
             <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Eylemler</h3>
                 <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg space-y-3">
                    <a 
                        href="mailto:destek@example.com?subject=Not%20Hesaplay%C4%B1c%C4%B1%2B%20Geri%20Bildirim"
                        className="w-full text-center font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-500 block"
                    >
                        Geri Bildirim Gönder
                    </a>
                    <Button onClick={onResetApplication} variant="danger" className="w-full" icon={<ExclamationTriangleIcon />}>
                        Uygulama Verilerini Sıfırla
                    </Button>
                 </div>
            </div>

        </div>
    );
};

export default Settings;