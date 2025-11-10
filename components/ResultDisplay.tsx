import React from 'react';
import { CertificateStatus } from '../types';

interface ResultDisplayProps {
  result: number | null;
  label: string;
  certificateStatus?: CertificateStatus;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, label, certificateStatus }) => {
  if (result === null) return null;

  const renderCertificateStatus = () => {
    if (!certificateStatus) return null;

    const statusInfo = {
        takdir: {
            icon: '🎉',
            text: 'Tebrikler! Takdir Belgesi alıyorsunuz.',
            className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
        },
        tesekkur: {
            icon: '👍',
            text: 'Çok iyi! Teşekkür Belgesi alıyorsunuz.',
            className: 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300'
        },
        low_grade: {
            icon: '⚠️',
            text: 'Bazı ders notlarınız 50\'nin altında olduğu için belge alamıyorsunuz.',
            className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
        },
        low_average: {
            icon: '🎯',
            text: 'Belge almak için ortalamanızın en az 70 olması gerekiyor. Çalışmaya devam!',
            className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
        }
    };

    const info = statusInfo[certificateStatus];

    return (
        <div className={`mt-4 p-4 rounded-lg flex items-center text-sm font-medium ${info.className}`}>
            <span className="text-2xl mr-3">{info.icon}</span>
            <span>{info.text}</span>
        </div>
    );
  };

  return (
    <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-700 text-center animate-fade-slide-up">
      <p className="text-base font-medium text-slate-600 dark:text-slate-400">{label}</p>
      <p className="text-5xl font-bold text-slate-800 dark:text-slate-100 mt-2 tracking-tight">
        {result.toFixed(2)}
      </p>
      {renderCertificateStatus()}
    </div>
  );
};

export default ResultDisplay;