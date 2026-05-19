import { X } from "lucide-react";

export default function Modal({ open, title, description, children, footer, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 p-5">
          <div>
            <h2 className="text-xl font-black text-zinc-50">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-zinc-500">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 text-zinc-400 hover:border-orange-500 hover:text-zinc-50"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[calc(92vh-150px)] overflow-y-auto p-5">{children}</div>
        {footer ? (
          <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 p-5 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
