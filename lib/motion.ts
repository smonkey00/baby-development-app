import { ReactNode, createElement } from "react";

type MotionProps = {
  children: ReactNode;
  initial?: Record<string, number | string>;
  animate?: Record<string, number | string>;
  transition?: Record<string, number | string>;
  className?: string;
};

export function motion({ 
  children, 
  className 
}: MotionProps) {
  return createElement('div', { className }, children);
}

// The motion object allows for JSX syntax like <motion.div>
motion.div = function({ 
  children, 
  className,
  // These props are used in real animation libraries but simplified here
  initial, 
  animate, 
  transition
}: MotionProps) {
  return createElement(
    'div',
    { 
      className: `transition-all duration-500 ease-in-out ${className || ""}`
    },
    children
  );
};