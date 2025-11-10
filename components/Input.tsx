import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  const errorClasses = error ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-primary-500';

  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
        {label}
      </label>
      <input
        {...props}
        type={props.type || 'number'}
        className={`w-full px-4 py-2.5 border-transparent rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-slate-800 ${errorClasses}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && <p id={`${props.id}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Input;