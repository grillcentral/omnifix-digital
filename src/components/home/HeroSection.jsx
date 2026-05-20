import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CircuitBoard,
  PackageCheck,
  PackageSearch,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

const MotionDiv = motion.div;

const dropOffLabel = "Ponto de Drop-off Shopee Xpress";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-92px)] overflow-hidden border-b border-zinc-800 bg-zinc-950">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.032)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.032)_1px,transparent_1px)] bg-[size:52px_52px] opacity-35" />
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#FF5E00]/20 blur-3xl" />

      <div className="page-shell relative flex min-h-[calc(100vh-92px)] flex-col py-5 sm:py-6 lg:py-8">
        <MotionDiv
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 flex flex-col justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/85 p-4 shadow-2xl shadow-black/20 md:flex-row md:items-center"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#FF5E00] text-zinc-950">
              <Truck size={20} />
            </span>
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#FF5E00]">
                Atendimento integrado
              </p>
              <strong className="text-sm font-black text-zinc-50">{dropOffLabel}</strong>
            </div>
          </div>
          <Link
            to="/agendamentos"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-[#FF5E00]/45 px-4 py-3 text-sm font-bold text-zinc-100 transition hover:bg-[#FF5E00] hover:text-zinc-950"
          >
            <CalendarDays size={17} />
            Agendar atendimento
            <ArrowRight size={16} />
          </Link>
        </MotionDiv>

        <div className="flex flex-1 flex-col gap-4 lg:min-h-[640px] lg:flex-row">
          <MotionDiv
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="group relative flex min-h-[520px] flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/30 transition-[flex,border-color,transform] duration-500 ease-out lg:hover:flex-[1.35] lg:hover:border-[#FF5E00]/70"
          >
            {/* TODO: trocar o gradiente por imagem local em public/ quando houver asset bom de acessorios. */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.24),transparent_18%),radial-gradient(circle_at_74%_78%,rgba(255,94,0,0.26),transparent_30%),linear-gradient(135deg,#2a2a2f,#09090b_64%,#000)]" />
            <div className="absolute inset-0 bg-black/45 transition duration-500 group-hover:bg-black/30" />
            <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(140deg,transparent_0%,transparent_42%,rgba(255,255,255,0.22)_43%,transparent_44%),linear-gradient(28deg,transparent_0%,transparent_52%,rgba(255,255,255,0.12)_53%,transparent_54%)]" />
            <div className="absolute right-8 top-10 h-40 w-40 rounded-[2rem] border border-zinc-500/40 bg-zinc-950/80 shadow-2xl shadow-black/60 transition duration-500 group-hover:-translate-y-2 group-hover:rotate-2" />
            <div className="absolute right-16 top-20 h-24 w-24 rounded-2xl border border-zinc-300/30 bg-gradient-to-br from-zinc-700 to-black" />

            <div className="relative z-10 mt-auto w-full p-6 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-md bg-[#FF5E00] px-4 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-[#FF5E00]/20">
                <PackageCheck size={18} />
                {dropOffLabel}
              </span>
              <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.45em] text-[#FF5E00]">
                module 01 // loja
              </p>
              <h1 className="mt-4 max-w-lg text-5xl font-black leading-none text-zinc-50 sm:text-6xl lg:text-7xl">
                Acessorios Premium
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-300">
                Capinhas, peliculas, cabos, carregadores e acessorios com curadoria
                tecnica para uso diario.
              </p>
              <Link
                to="/produtos"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-zinc-50 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-[#FF5E00]"
              >
                <PackageSearch size={18} />
                Abrir catalogo
                <ArrowRight size={16} />
              </Link>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="group relative flex min-h-[520px] flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-black shadow-2xl shadow-black/30 transition-[flex,border-color,transform] duration-500 ease-out lg:hover:flex-[1.35] lg:hover:border-[#FF5E00]/70"
          >
            {/* TODO: trocar o gradiente por imagem local em public/ quando houver asset bom de assistencia tecnica. */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.24),transparent_16%),radial-gradient(circle_at_30%_72%,rgba(255,94,0,0.24),transparent_30%),linear-gradient(135deg,#0f172a,#18181b_52%,#000)]" />
            <div className="absolute inset-0 bg-black/48 transition duration-500 group-hover:bg-black/32" />
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
            <CircuitBoard
              className="absolute right-8 top-8 text-zinc-300/20 transition duration-500 group-hover:scale-105"
              size={220}
            />
            <div className="absolute right-12 top-20 h-56 w-3 rotate-45 rounded-full bg-zinc-200/60 shadow-2xl shadow-white/20" />

            <div className="relative z-10 mt-auto w-full p-6 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-md border border-[#FF5E00]/45 bg-zinc-950/80 px-4 py-3 text-sm font-black text-[#FF5E00]">
                <ShieldCheck size={18} />
                Diagnostico com garantia
              </span>
              <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.45em] text-[#FF5E00]">
                module 02 // servicos
              </p>
              <h2 className="mt-4 max-w-lg text-5xl font-black leading-none text-zinc-50 sm:text-6xl lg:text-7xl">
                Assistencia Tecnica
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-300">
                Reparo de celulares, notebooks e computadores com OS, laudo e
                atendimento organizado.
              </p>
              <Link
                to="/assistencia"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#FF5E00] px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-[#ff7a2b]"
              >
                <Wrench size={18} />
                Solicitar assistencia
                <ArrowRight size={16} />
              </Link>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
