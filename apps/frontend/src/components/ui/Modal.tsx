import { ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  confirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function Modal({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  confirming = false,
  onConfirm,
  onClose,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-zinc-900/30 sm:items-center sm:justify-center sm:p-6" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="flex min-h-full w-full flex-col bg-[#f8f5ef] p-5 sm:min-h-0 sm:max-w-md sm:rounded-2xl sm:border sm:border-stone-200 sm:bg-white sm:p-6 sm:shadow-md"
      >
        <div className="flex-1">
          <h2 id="modal-title" className="font-heading text-xl font-bold text-zinc-950">{title}</h2>
          <div className="mt-3 text-zinc-700">{children}</div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={confirming}>{cancelLabel}</Button>
          <Button variant="danger" fullWidth onClick={onConfirm} disabled={confirming}>
            {confirming ? 'กำลังลบ...' : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
