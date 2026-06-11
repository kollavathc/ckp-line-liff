import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
}

export function Alert({ children }: AlertProps) {
  return (
    <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {children}
    </div>
  );
}
