import { motion } from "framer-motion";
import { ArrowRight, PackageSearch, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const MotionDiv = motion.div;

export default function HeroSection() {
  return (
    <section className="border-b border-zinc-800 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.20),transparent_34%),linear-gradient(135deg,#09090b,#18181b_55%,#000)]">
      <div className="page-shell grid min-h-[620px] items-stretch gap-4 py-8 lg:grid-cols-2">
        <MotionDiv
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 p-6 md:p-8"
        >
          <div>
            <p className="eyebrow">loja tecnica</p>
            <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight text-zinc-50 md:text-6xl">
              Produtos certos para manter a rotina funcionando.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-400">
              Catalogo premium para cabos, carregadores, peliculas, capinhas e
              eletronicos com curadoria tecnica.
            </p>
          </div>
          <Link
            to="/produtos"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-zinc-950 hover:bg-orange-400"
          >
            <PackageSearch size={18} />
            Ver produtos
            <ArrowRight size={16} />
          </Link>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="flex flex-col justify-between rounded-lg border border-orange-500/25 bg-gradient-to-br from-zinc-900 to-black p-6 md:p-8"
        >
          <div>
            <p className="eyebrow">assistencia tecnica</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight text-zinc-50 md:text-6xl">
              Diagnostico, OS e atendimento com padrao SaaS.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-400">
              Base preparada para ordens de servico, agenda, leads, estoque e
              backend REST futuro.
            </p>
          </div>
          <Link
            to="/assistencia"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-md border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-100 hover:border-orange-500 hover:bg-zinc-900"
          >
            <Wrench size={18} />
            Solicitar assistencia
            <ArrowRight size={16} />
          </Link>
        </MotionDiv>
      </div>
    </section>
  );
}
