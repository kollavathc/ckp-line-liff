import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="block text-sm font-medium text-zinc-700">
      {label}
      <input
        id={inputId}
        className={`mt-2 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 ${className}`}
        {...props}
      />
    </label>
  );
}
