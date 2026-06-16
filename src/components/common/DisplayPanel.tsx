import type { ReactNode } from 'react';

interface DisplayPanelProps {
  children: ReactNode;
  className?: string;
}

export default function DisplayPanel({ children, className = '' }: DisplayPanelProps) {
  return (
    <div
      className={`
        bg-display-bg
        rounded-2xl
        border border-border
        shadow-lg
        p-4
        ${className}
      `}
    >
      {children}
    </div>
  );
}
