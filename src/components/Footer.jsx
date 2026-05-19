import { Instagram, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { appConfig } from "@/lib/appConfig.js";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black text-zinc-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <p className="font-black uppercase tracking-wide">Viatec</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Informatica, celulares e automacao. Assistencia tecnica
            especializada em Forquilhinha, SC.
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-orange-400">
            Navegacao
          </p>
          <div className="mt-3 grid gap-2 text-sm text-zinc-400">
            <Link to="/produtos">Produtos</Link>
            <Link to="/assistencia">Assistencia</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/os">Ordens de servico</Link>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-orange-400">
            Contato
          </p>
          <div className="mt-3 space-y-3 text-sm text-zinc-400">
            <p className="flex gap-2">
              <MapPin size={16} /> Av. 25 de Julho, 2537
            </p>
            <p className="flex gap-2">
              <Phone size={16} /> (48) 99971-2206
            </p>
            <p className="flex gap-2">
              <Instagram size={16} /> @viatecinformatica
            </p>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-orange-400">
            Status
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-orange-300">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Aberto agora
          </div>
          <p className="mt-2 text-xs text-zinc-500">Seg-Sab: 08:30 - 18:00</p>
        </div>
      </div>
      <div className="border-t border-zinc-900 px-4 py-3">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {appConfig.appName} v{appConfig.version} / {appConfig.environment}
          </span>
          <Link to="/status" className="text-orange-500 hover:text-orange-300">
            status tecnico
          </Link>
        </div>
      </div>
    </footer>
  );
}
