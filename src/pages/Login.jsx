import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import Input from "@/components/forms/Input.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { useToast } from "@/hooks/useToast.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname ?? "/os";

  if (isAuthenticated && !isLoading) {
    return <Navigate to={from} replace />;
  }

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Informe seu email.";
    if (!form.password.trim()) nextErrors.password = "Informe sua senha.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Entrando", "Validando credenciais.");
    try {
      await signIn(form);
      toast.dismiss(toastId);
      toast.success("Login realizado", "Sessao recuperada com sucesso.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Falha no login", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell grid min-h-[calc(100vh-220px)] place-items-center">
      <section className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/30">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500 text-zinc-950">
            <LockKeyhole size={22} />
          </span>
          <div>
            <p className="eyebrow">acesso interno</p>
            <h1 className="text-2xl font-black text-zinc-50">Entrar</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            error={errors.email}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => setField("password", event.target.value)}
            error={errors.password}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-zinc-950 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Acessar sistema"}
          </button>
        </form>
      </section>
    </main>
  );
}
