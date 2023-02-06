import type { PropsWithChildren } from "react";

interface PageContainerProps {
  title: string;
}

export const Container: React.FC<PropsWithChildren<PageContainerProps>> = ({
  title,
  children,
}) => {
  return (
    <div className="prose p-8">
      <h1>{title}</h1>
      {children}
    </div>
  );
};
