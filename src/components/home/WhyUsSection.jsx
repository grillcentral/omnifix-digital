import { BadgeCheck, Clock3, FileCheck2, ShieldCheck } from "lucide-react";

const items = [
  { title: "Garantia", icon: ShieldCheck, text: "Servicos com garantia e laudo." },
  { title: "Atendimento rapido", icon: Clock3, text: "Triagem objetiva e prazo claro." },
  { title: "Tecnicos certificados", icon: BadgeCheck, text: "Processo tecnico organizado." },
  { title: "Orcamento sem compromisso", icon: FileCheck2, text: "Analise antes da aprovacao." },
];

export default function WhyUsSection() {
  return (
    <section className="border-y border-zinc-800 bg-black/60">
      <div className="page-shell">
        <p className="eyebrow">por que escolher</p>
        <h2 className="mt-2 text-3xl font-black text-zinc-50">
          Processo premium, sem enrolacao.
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.title} className="card p-5">
              <item.icon className="text-orange-400" size={24} />
              <h3 className="mt-4 font-bold text-zinc-50">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
