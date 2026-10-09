'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  className?: string;
  label?: string;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  className = '',
  label = 'Print / Save as PDF',
}) => {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      aria-label="Print or save resume as PDF"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-neon-indigo/10 hover:bg-neon-indigo/20 text-neon-cyan border border-neon-indigo/30 hover:border-neon-cyan shadow-sm active:scale-95 cursor-pointer print:hidden ${className}`}
    >
      <Printer className="w-4 h-4 text-neon-cyan" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
};

export default PrintButton;
