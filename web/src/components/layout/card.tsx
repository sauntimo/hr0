import type { PropsWithChildren } from "react";
import React from "react";

interface CardProps {
  title: string;
}

export const Card: React.FC<PropsWithChildren<CardProps>> = ({
  title,
  children,
}) => {
  return (
    <div className="not-prose card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};
