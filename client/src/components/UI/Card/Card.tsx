import type { ReactNode } from "react";
import classes from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`${className ?? ""} ${classes.card} overflow-auto`}>
      {children}
    </div>
  );
}
