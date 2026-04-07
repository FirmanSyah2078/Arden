'use client';

import { ReactNode } from 'react';
import { Logo } from '@/components/logo';

interface HeaderProps {
  children?: ReactNode;
  className?: string;
}

export const Header = ({ children, className = '' }: HeaderProps) => {
  return (
    <div className={`flex w-full items-center justify-between py-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="scale-75 origin-left"> 
          <Logo /> 
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
};