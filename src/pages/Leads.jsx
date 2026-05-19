import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, Mail, Phone, Plus, Search } from "lucide-react";
import { createLead, updateLead } from "@/api/client.js";
import Input from "@/components/forms/Input.jsx";
import Modal from "@/components/forms/Modal.jsx";
import MoneyInput from "@/components/forms/MoneyInput.jsx";
import Select from "@/components/forms/Select.jsx";
import Textarea from "@/components/forms/Textarea.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { useLeads } from "@/hooks/useOmnifixData.js";
import { useToast } from "@/hooks/useToast.js";
import { LEAD_ESTAGIOS, LEAD_ORIGENS, LEAD_TIPOS } from "@/lib/constants.js";
import { formatCurrency } from "@/lib/formatters.js";
import { queryKeys } from "@/lib/queryKeys.js";

const options = {
  estagio: ["todos", ...LEAD_ESTAGIOS.map((item) => item.value)],
  tipo: ["todos", ...LEAD_TIPOS.map((item) => item.value)],
  origem: ["todos", ...LEAD_ORIGENS.map((item) => item.value)],
};

const stageOptions = LEAD_ESTAGIOS;
const typeOptions = LEAD_TIPOS;
const originOptions = LEAD_ORIGENS;

const emptyForm = {
  nome: "",
  telefone: "",
  email: "",
  tipo: "Celular",
  estagio: "novo",
  dispositivo: "",
  problema: "",
  valor_estimado: "",
  origem: "WhatsApp",
  notas: "",
};

export default function Leads() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const {
    data: leads = [],
    isLoading,
    isError,
    error,
  } = useLeads();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    estagio: "todos",
    tipo: "todos",
    origem: "todos",
  });
  const [editing, setEditing] = useState(undefined);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const saveLead = useMutation({
    mutationFn: (payload) =>
      editing ? updateLead(editing.id, payload) : createLead(payload),
    onMutate: () => toast.loading("Salvando lead", "Enviando dados ao Supabase."),
    onSuccess: (saved) => {
      setItems((current) =>
        editing
          ? current.map((lead) => (lead.id === editing.id ? saved : lead))
          : [saved, ...current],
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      toast.success("Lead salvo", "Registro comercial atualizado.");
      closeModal();
    },
    onError: (mutationError) => {
      toast.error("Erro ao salvar lead", mutationError.message);
    },
    onSettled: (...args) => {
      const toastId = args[3];
      if (toastId) toast.dismiss(toastId);
    },
  });

  useEffect(() => {
    setItems(leads);
  }, [leads]);

  const filtered = useMemo(
    () =>
      items.filter((lead) => {
        const matchStage =
          filters.estagio === "todos" || lead.estagio === filters.estagio;
        const matchType = filters.tipo === "todos" || lead.tipo === filters.tipo;
        const matchOrigin =
          filters.origem === "todos" || lead.origem === filters.origem;
        return matchStage && matchType && matchOrigin;
      }),
    [filters, items],
  );

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
  };

  const openEdit = (lead) => {
    setEditing(lead);
    setForm({
      nome: lead.nome ?? "",
      telefone: lead.telefone ?? "",
      email: lead.email ?? "",
      tipo: lead.tipo ?? "Celular",
      estagio: lead.estagio ?? "novo",
      dispositivo: lead.dispositivo ?? "",
      problema: lead.problema ?? "",
      valor_estimado: String(lead.valor_estimado ?? ""),
      origem: lead.origem ?? "WhatsApp",
      notas: lead.notas ?? "",
    });
    setErrors({});
  };

  const closeModal = () => {
    if (saveLead.isPending) return;
    setEditing(undefined);
    setErrors({});
  };

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.nome.trim()) nextErrors.nome = "Informe o nome do lead.";
    if (!form.telefone.trim()) nextErrors.telefone = "Informe o telefone.";
    if (!form.email.trim()) nextErrors.email = "Informe o email.";
    if (!form.tipo.trim()) nextErrors.tipo = "Escolha o tipo.";
    if (!form.estagio.trim()) nextErrors.estagio = "Escolha o estagio.";
    if (!form.dispositivo.trim()) {
      nextErrors.dispositivo = "Informe o dispositivo.";
    }
    if (!form.problema.trim()) nextErrors.problema = "Descreva o problema.";
    if (!form.origem.trim()) nextErrors.origem = "Escolha a origem.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      valor_estimado: Number(form.valor_estimado || 0),
      canal: form.origem,
      interesse: form.problema,
      status: form.estagio,
    };

    saveLead.mutate(payload);
  };

  return (
    <main className="page-shell space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">crud visual</p>
          <h1 className="mt-2 text-3xl font-black text-zinc-50">Leads</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Base comercial persistida para triagem, orcamento e conversao em OS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="card flex items-center gap-3 p-4">
            <Search className="text-orange-400" size={20} />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                filtrados
              </p>
              <p className="text-xl font-black text-zinc-50">{filtered.length}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-zinc-950 hover:bg-orange-400"
          >
            <Plus size={18} />
            Novo Lead
          </button>
        </div>
      </div>

      <section className="card grid gap-3 p-4 md:grid-cols-3">
        <Filter
          label="Estagio"
          value={filters.estagio}
          items={options.estagio}
          onChange={(value) => updateFilter("estagio", value)}
        />
        <Filter
          label="Tipo"
          value={filters.tipo}
          items={options.tipo}
          onChange={(value) => updateFilter("tipo", value)}
        />
        <Filter
          label="Origem"
          value={filters.origem}
          items={options.origem}
          onChange={(value) => updateFilter("origem", value)}
        />
      </section>

      {isLoading ? <LoadingState label="Carregando leads..." /> : null}
      {isError ? <ErrorState message={error.message} /> : null}
      {!isLoading && !isError && filtered.length === 0 ? (
        <EmptyState description="Crie um novo lead ou ajuste os filtros comerciais." />
      ) : null}

      <section className="grid gap-4 xl:grid-cols-2">
        {!isLoading && !isError && filtered.map((lead) => (
          <article key={lead.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-orange-400">
                  {lead.origem}
                </p>
                <h2 className="mt-2 text-xl font-black text-zinc-50">
                  {lead.nome}
                </h2>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Phone size={13} />
                    {lead.telefone}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Mail size={13} />
                    {lead.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-zinc-950 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-300">
                  {lead.tipo}
                </span>
                <span className="rounded-full bg-orange-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-orange-300">
                  {lead.estagio}
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(lead)}
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-200 hover:border-orange-500 hover:text-orange-300"
                >
                  <Edit3 size={14} />
                  Editar
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 border-t border-zinc-800 pt-4 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-semibold text-zinc-100">{lead.dispositivo}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {lead.problema}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-950 p-4 md:min-w-40">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  estimado
                </p>
                <p className="mt-1 text-lg font-black text-orange-400">
                  {formatCurrency(lead.valor_estimado)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <Modal
        open={editing !== undefined}
        title={editing ? "Editar lead" : "Novo lead"}
        description="Registre oportunidades para triagem comercial e futura conversao em OS."
        onClose={closeModal}
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 hover:border-zinc-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="lead-form"
              disabled={saveLead.isPending}
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveLead.isPending ? "Salvando..." : "Salvar lead"}
            </button>
          </>
        }
      >
        <form id="lead-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nome"
              value={form.nome}
              onChange={(event) => setField("nome", event.target.value)}
              error={errors.nome}
              required
            />
            <Input
              label="Telefone"
              value={form.telefone}
              onChange={(event) => setField("telefone", event.target.value)}
              error={errors.telefone}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            error={errors.email}
            required
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Select
              label="Tipo"
              value={form.tipo}
              onChange={(event) => setField("tipo", event.target.value)}
              options={typeOptions}
              error={errors.tipo}
              required
            />
            <Select
              label="Estagio"
              value={form.estagio}
              onChange={(event) => setField("estagio", event.target.value)}
              options={stageOptions}
              error={errors.estagio}
              required
            />
            <Select
              label="Origem"
              value={form.origem}
              onChange={(event) => setField("origem", event.target.value)}
              options={originOptions}
              error={errors.origem}
              required
            />
          </div>
          <Input
            label="Dispositivo"
            value={form.dispositivo}
            onChange={(event) => setField("dispositivo", event.target.value)}
            error={errors.dispositivo}
            required
          />
          <Textarea
            label="Problema"
            rows={4}
            value={form.problema}
            onChange={(event) => setField("problema", event.target.value)}
            error={errors.problema}
            required
          />
          <MoneyInput
            label="Valor estimado"
            value={form.valor_estimado}
            onChange={(event) => setField("valor_estimado", event.target.value)}
          />
          <Textarea
            label="Notas"
            rows={3}
            value={form.notas}
            onChange={(event) => setField("notas", event.target.value)}
          />
        </form>
      </Modal>
    </main>
  );
}

function Filter({ label, value, items, onChange }) {
  return (
    <label className="grid gap-2 text-sm text-zinc-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
      >
        {items.map((item) => (
          <option key={item} value={item}>
            {item === "todos" ? "Todos" : item}
          </option>
        ))}
      </select>
    </label>
  );
}
