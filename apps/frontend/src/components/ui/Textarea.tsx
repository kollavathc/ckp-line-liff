import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, id, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? props.name;
  return (
    <label htmlFor={textareaId} className="block text-sm font-medium text-zinc-700">
      {label}
      <textarea
        id={textareaId}
        className={`mt-2 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 ${className}`}
        {...props}
      />
    </label>
  );
}
