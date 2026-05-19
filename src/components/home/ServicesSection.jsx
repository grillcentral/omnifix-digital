import { Cpu, Monitor, Smartphone } from "lucide-react";

const services = [
  {
    title: "Celular",
    icon: Smartphone,
    text: "Tela, bateria, conector, camera, oxidados e diagnostico de placa.",
  },
  {
    title: "Notebook",
    icon: Monitor,
    text: "SSD, memoria, limpeza tecnica, sistema, teclado, tela e carregamento.",
  },
  {
    title: "Computador",
    icon: Cpu,
    text: "Montagem, upgrade, manutencao preventiva, fonte, placa e desempenho.",
  },
];

export default function ServicesSection() {
  return (
    <section className="page-shell">
      <p className="eyebrow">servicos</p>
      <h2 className="mt-2 text-3xl font-black text-zinc-50">
        Assistencia por categoria
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.title}
            className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <service.icon size={26} />
            </div>
            <h3 className="mt-5 text-xl font-black text-zinc-50">{service.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {service.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
