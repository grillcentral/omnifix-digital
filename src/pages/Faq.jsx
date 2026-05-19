import { HelpCircle, ShieldCheck } from "lucide-react";

const faqs = [
  {
    category: "Assistencia tecnica",
    question: "Quais equipamentos a Viatec atende?",
    answer:
      "Atendemos celulares, notebooks e computadores, incluindo diagnostico, troca de pecas, limpeza tecnica, upgrade e recuperacao de desempenho.",
  },
  {
    category: "Garantia",
    question: "Os servicos possuem garantia?",
    answer:
      "Sim. A garantia varia conforme o tipo de servico e peca utilizada. O prazo e informado no orcamento e registrado na ordem de servico.",
  },
  {
    category: "Orcamento",
    question: "O orcamento tem custo?",
    answer:
      "A triagem inicial e sem compromisso. Quando houver necessidade de analise tecnica avancada, o cliente e informado antes de qualquer cobranca.",
  },
  {
    category: "Prazo",
    question: "Quanto tempo demora o reparo?",
    answer:
      "Servicos simples podem sair no mesmo dia. Casos com placa, liquido ou peca sob encomenda recebem previsao individual na abertura da OS.",
  },
  {
    category: "Pecas",
    question: "As pecas sao originais?",
    answer:
      "Trabalhamos com pecas de qualidade, sempre informando ao cliente a procedencia, compatibilidade, garantia e opcoes disponiveis.",
  },
  {
    category: "SGBR",
    question: "A Viatec presta suporte para SGBR?",
    answer:
      "Sim. O suporte pode envolver diagnostico de estacoes, impressoras, rede, backups e operacao local relacionada ao ambiente SGBR.",
  },
];

export default function Faq() {
  return (
    <main className="page-shell">
      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div>
          <p className="eyebrow">faq tecnico</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-zinc-50">
            Perguntas frequentes da assistencia.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Uma base clara para atendimento, garantia, prazos, pecas e suporte
            operacional, pronta para virar conteudo de API no futuro.
          </p>
          <div className="mt-6 rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
            <ShieldCheck className="text-orange-400" size={24} />
            <p className="mt-3 text-sm font-semibold text-zinc-50">
              Tudo que vira atendimento deve virar OS, historico e garantia.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {faqs.map((item) => (
            <article
              key={item.question}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-sm shadow-black/20"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-orange-400">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-orange-400">
                    {item.category}
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-zinc-50">
                    {item.question}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
