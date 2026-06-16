import { useEffect, useRef, useState } from 'react';

type KeyboardKeyVariant = 'number' | 'operator' | 'function' | 'equal' | 'delete';
type KeyboardKeySize = 'sm' | 'md' | 'lg';

interface KeyboardKeyProps {
  label: string;
  onClick: () => void;
  variant?: KeyboardKeyVariant;
  disabled?: boolean;
  size?: KeyboardKeySize;
}

const variantClasses: Record<KeyboardKeyVariant, string> = {
  number: 'bg-key-bg text-text-primary',
  operator: 'bg-key-operator-bg text-text-primary font-bold',
  function: 'bg-key-function-bg text-text-primary',
  equal: 'bg-key-equal-bg text-white font-bold',
  delete: 'bg-key-operator-bg text-text-primary',
};

const sizeClasses: Record<KeyboardKeySize, string> = {
  sm: 'h-10 text-sm',
  md: 'h-12 text-base',
  lg: 'h-14 text-lg',
};

export default function KeyboardKey({
  label,
  onClick,
  variant = 'number',
  disabled = false,
  size = 'md',
}: KeyboardKeyProps) {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pressTimeoutRef.current) {
        clearTimeout(pressTimeoutRef.current);
      }
      if (repeatIntervalRef.current) {
        clearInterval(repeatIntervalRef.current);
      }
    };
  }, []);

  const handleMouseDown = () => {
    if (disabled) return;
    setIsPressed(true);
    onClick();

    pressTimeoutRef.current = setTimeout(() => {
      repeatIntervalRef.current = setInterval(() => {
        onClick();
      }, 100);
    }, 500);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
      pressTimeoutRef.current = null;
    }
    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (isPressed) {
      handleMouseUp();
    }
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => {
        e.preventDefault();
        handleMouseDown();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleMouseUp();
      }}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-xl font-medium
        border border-border
        shadow-key
        hover:brightness-110
        active:scale-95
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100
        select-none
      `}
    >
      {label}
    </button>
  );
}
