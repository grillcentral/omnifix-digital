import { useCallback, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { ToastContext } from "@/lib/toastContext.js";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  loading: Loader2,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    ({ type = "success", title, message, duration = 3200 }) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, type, title, message }]);

      if (type !== "loading") {
        window.setTimeout(() => remove(id), duration);
      }

      return id;
    },
    [remove],
  );

  const value = useMemo(
    () => ({
      success: (title, message) => notify({ type: "success", title, message }),
      error: (title, message) => notify({ type: "error", title, message }),
      loading: (title, message) => notify({ type: "loading", title, message }),
      dismiss: remove,
    }),
    [notify, remove],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[120] grid w-[min(360px,calc(100vw-2rem))] gap-3">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] ?? CheckCircle2;

          return (
            <div
              key={toast.id}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 shadow-2xl shadow-black"
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`mt-0.5 ${
                    toast.type === "error" ? "text-red-300" : "text-orange-400"
                  } ${toast.type === "loading" ? "animate-spin" : ""}`}
                  size={20}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-zinc-50">{toast.title}</p>
                  {toast.message ? (
                    <p className="mt-1 text-xs text-zinc-400">{toast.message}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(toast.id)}
                  className="text-zinc-500 hover:text-zinc-100"
                  aria-label="Fechar aviso"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
