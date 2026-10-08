import React from 'react';

interface ScrollStackItemProps {
  children: React.ReactNode;
  index?: number;
  totalCards?: number;
  id?: string;
  className?: string;
  borderless?: boolean;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  id,
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`relative w-full py-2 sm:py-4 ${className}`}
    >
      {children}
    </div>
  );
};

export const ScrollStackContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="relative w-full max-w-[1840px] mx-auto px-2 sm:px-4 lg:px-6">{children}</div>;
};
