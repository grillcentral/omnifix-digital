import { NavLink } from "react-router-dom";
import { CalendarDays, LogIn, LogOut, PackageSearch, UserRound, Wrench } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-zinc-950">
            <Wrench size={20} />
          </span>
          <span>
            <strong className="block text-sm font-black uppercase tracking-wide">
              OmniFix Digital
            </strong>
            <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Viatec Assistencia
            </span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-500 text-zinc-950"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
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
              <UserRound size={15} className="text-orange-400" />
              <span className="max-w-36 truncate">
                {profile?.nome ?? user?.email}
              </span>
            </div>
          ) : null}
          <NavLink
            to="/agendamentos"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900"
          >
            <CalendarDays size={16} />
            Agendar
          </NavLink>
          <NavLink
            to="/produtos"
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-400"
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
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900"
            >
              <LogIn size={16} />
              Entrar
            </NavLink>
          )}
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-zinc-900 px-4 py-2 lg:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `shrink-0 rounded-md px-3 py-2 text-sm ${
                isActive ? "bg-orange-500 text-zinc-950" : "text-zinc-400"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
