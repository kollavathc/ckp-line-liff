import { ReactNode, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function Select({ label, id, children, className = '', ...props }: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <label htmlFor={selectId} className="block text-sm font-medium text-zinc-700">
      {label}
      <select
        id={selectId}
        className={`mt-2 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-base text-zinc-900 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
