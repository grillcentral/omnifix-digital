import { Cpu, Droplets, Monitor, Smartphone } from "lucide-react";

const services = [
  { icon: Smartphone, title: "Celulares", text: "Tela, bateria, conectores e software." },
  { icon: Monitor, title: "Notebooks", text: "Upgrade, limpeza, SSD e diagnostico." },
  { icon: Droplets, title: "Molhou?", text: "Triagem rapida para dano por liquido." },
  { icon: Cpu, title: "Automacao", text: "Suporte tecnico e integracoes locais." },
];

export default function Assistencia() {
  return (
    <main className="page-shell">
      <p className="eyebrow">assistencia</p>
      <h1 className="mt-2 text-3xl font-black text-zinc-50">Assistencia tecnica especializada</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">
        Estrutura inicial para capturar necessidades, orientar triagem e gerar
        futuras ordens de servico.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <article key={service.title} className="card p-5">
            <service.icon className="text-orange-400" size={28} />
            <h2 className="mt-4 text-lg font-bold text-zinc-50">{service.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{service.text}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
