import React from 'react';

const BookmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
);


const InfoBox: React.FC = () => {
    return (
    <div className="mt-8 text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center">
            <div className="text-primary-500 dark:text-primary-400 mr-4 shrink-0">
                <BookmarkIcon />
            </div>
            <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Pro İpucu:</p>
            <p className="text-slate-600 dark:text-slate-400">Notlarınızı düzenli olarak takip etmek, akademik başarınızı artırmanın anahtarıdır.</p>
            </div>
        </div>
    </div>
    );
};

export default InfoBox;