import { AlertTriangle } from "lucide-react";

export default function ErrorState({
  title = "Nao foi possivel carregar",
  message = "Verifique a configuracao e tente novamente.",
}) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
      <div className="flex gap-3">
        <AlertTriangle className="shrink-0 text-red-300" size={22} />
        <div>
          <h2 className="font-black text-red-100">{title}</h2>
          <p className="mt-1 text-sm text-red-200/80">{message}</p>
        </div>
      </div>
    </div>
  );
}
