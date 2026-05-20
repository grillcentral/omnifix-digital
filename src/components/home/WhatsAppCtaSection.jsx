import { ArrowRight, MessageCircle, ShieldCheck, Wrench } from "lucide-react";

export default function WhatsAppCtaSection() {
  return (
    <section className="page-shell">
      <div className="relative overflow-hidden rounded-lg border border-orange-500/25 bg-zinc-950 p-6 shadow-2xl shadow-black/30 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.22),transparent_28%),linear-gradient(135deg,rgba(39,39,42,0.92),rgba(9,9,11,0.96))]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">atendimento direto</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-zinc-50 md:text-5xl">
              Fale com a Viatec e agilize seu orçamento.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 md:text-base">
              Envie o modelo do aparelho, descreva o problema e receba a primeira
              orientacao para assistencia, produtos ou drop-off.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-700/80 bg-black/35 p-4">
                <ShieldCheck className="text-orange-400" size={22} />
                <strong className="mt-3 block text-sm font-black text-zinc-50">
                  Garantia e laudo
                </strong>
                <span className="mt-1 block text-xs leading-relaxed text-zinc-400">
                  Atendimento com registro e acompanhamento.
                </span>
              </div>
              <div className="rounded-lg border border-zinc-700/80 bg-black/35 p-4">
                <Wrench className="text-orange-400" size={22} />
                <strong className="mt-3 block text-sm font-black text-zinc-50">
                  Triagem tecnica
                </strong>
                <span className="mt-1 block text-xs leading-relaxed text-zinc-400">
                  Celular, notebook, computador e acessorios.
                </span>
              </div>
            </div>
            <a
              href="https://wa.me/5548999712206?text=Ola!%20Vim%20pelo%20site%20da%20Viatec."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-5 py-4 text-sm font-black text-zinc-950 shadow-lg shadow-orange-500/20 hover:bg-orange-400"
            >
              <MessageCircle size={18} />
              Chamar no WhatsApp
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
