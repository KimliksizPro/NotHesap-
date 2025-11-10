import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, ...props }) => {
  const baseClasses = 'flex items-center justify-center font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow hover:shadow-lg hover:shadow-primary-600/30 dark:hover:shadow-primary-500/30',
    secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 focus:ring-slate-400 shadow-sm',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow hover:shadow-lg hover:shadow-red-600/30 dark:hover:shadow-red-500/30',
  };
  
  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${props.className || ''}`.trim();

  return (
    <button {...props} className={finalClassName}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;