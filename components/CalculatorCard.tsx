import React from 'react';

interface CalculatorCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, icon, children, footer }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700/50 shadow-sm transition-colors duration-300 flex flex-col">
      <div className="p-6 sm:p-8">
        <div className="flex items-center mb-6">
          <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg mr-4 text-primary-600 dark:text-primary-400">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        </div>
        {children}
      </div>
      {footer && (
        <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 border-t border-slate-200/70 dark:border-slate-700/50 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default CalculatorCard;