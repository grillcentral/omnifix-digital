import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  LogIn,
  LogOut,
  PackageSearch,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth.js";
import { useToast } from "@/hooks/useToast.js";

const publicLinks = [
  { to: "/", label: "Inicio" },
  { to: "/produtos", label: "Produtos" },
  { to: "/assistencia", label: "Assistencia" },
  { to: "/faq", label: "FAQ" },
  { to: "/blog", label: "Blog" },
  { to: "/agendamentos", label: "Agenda" },
];

const adminLinks = [
  { to: "/os", label: "OS" },
  { to: "/crm", label: "CRM" },
  { to: "/calendario", label: "Calendario" },
  { to: "/estoque", label: "Estoque" },
  { to: "/leads", label: "Leads" },
];

export default function Navbar() {
  const { isAuthenticated, profile, signOut, user } = useAuth();
  const toast = useToast();
  const links = isAuthenticated ? [...publicLinks, ...adminLinks] : publicLinks;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sessao encerrada", "Logout realizado com sucesso.");
    } catch (error) {
      toast.error("Erro ao sair", error.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#FF5E00]/30 bg-zinc-900 text-[#FF5E00] shadow-lg shadow-[#FF5E00]/10">
            <Wrench size={20} />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-sm bg-[#FF5E00]" />
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-sm font-black uppercase tracking-wide text-zinc-50">
              OmniFix
            </strong>
            <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Viatec Digital
            </span>
          </span>
        </NavLink>

        <nav className="hidden items-center rounded-md border border-zinc-800 bg-zinc-900/65 p-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-[#FF5E00] text-zinc-950"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-xs text-zinc-300">
              <UserRound size={15} className="text-[#FF5E00]" />
              <span className="max-w-36 truncate">
                {profile?.nome ?? user?.email}
              </span>
            </div>
          ) : null}
          <NavLink
            to="/agendamentos"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm font-bold text-zinc-200 hover:border-[#FF5E00]/70 hover:bg-zinc-900"
          >
            <CalendarDays size={16} />
            Agendar
          </NavLink>
          <NavLink
            to="/produtos"
            className="inline-flex items-center gap-2 rounded-md bg-[#FF5E00] px-3 py-2 text-sm font-black text-zinc-950 shadow-lg shadow-[#FF5E00]/20 hover:bg-[#ff7a2b]"
          >
            <PackageSearch size={16} />
            Catalogo
          </NavLink>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900"
            >
              <LogOut size={16} />
              Sair
            </button>
          ) : (
            <NavLink
              to="/login"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm font-bold text-zinc-200 hover:border-[#FF5E00]/70 hover:bg-zinc-900"
            >
              <LogIn size={16} />
              Entrar
            </NavLink>
          )}
        </div>
      </div>
      <div className="border-t border-zinc-900 lg:hidden">
        <div className="flex gap-2 overflow-x-auto px-4 py-2">
          <NavLink
            to="/agendamentos"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#FF5E00] px-3 py-2 text-sm font-black text-zinc-950"
          >
            <CalendarDays size={15} />
            Agendar
          </NavLink>
          <NavLink
            to="/produtos"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm font-bold text-zinc-200"
          >
            <PackageSearch size={15} />
            Catalogo
          </NavLink>
          <NavLink
            to={isAuthenticated ? "/" : "/login"}
            onClick={isAuthenticated ? handleLogout : undefined}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm font-bold text-zinc-200"
          >
            {isAuthenticated ? <LogOut size={15} /> : <ShieldCheck size={15} />}
            {isAuthenticated ? "Sair" : "Entrar"}
          </NavLink>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `shrink-0 rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-widest ${
                  isActive ? "bg-zinc-800 text-[#FF5E00]" : "text-zinc-500"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
