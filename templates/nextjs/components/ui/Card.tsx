'use client';

import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card = ({ children, variant = 'default', className = '', ...props }: CardProps) => {
  const variantClasses = {
    default: 'bg-white rounded-2xl shadow-lg',
    elevated: 'bg-white rounded-2xl shadow-xl',
    outlined: 'bg-white rounded-2xl border-2 border-gray-200',
  };

  return (
    <div className={`${variantClasses[variant]} p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const CardHeader = ({ title, subtitle, action }: CardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = '' }: CardContentProps) => {
  return <div className={className}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={`mt-6 pt-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
