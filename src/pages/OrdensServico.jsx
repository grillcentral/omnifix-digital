import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, Plus, SlidersHorizontal } from "lucide-react";
import { createOrdemServico, updateOrdemServico } from "@/api/client.js";
import AdminDashboard from "@/components/admin/AdminDashboard.jsx";
import Input from "@/components/forms/Input.jsx";
import Modal from "@/components/forms/Modal.jsx";
import MoneyInput from "@/components/forms/MoneyInput.jsx";
import Select from "@/components/forms/Select.jsx";
import Textarea from "@/components/forms/Textarea.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { useOrdensServico } from "@/hooks/useOmnifixData.js";
import { useToast } from "@/hooks/useToast.js";
import { OS_PRIORIDADES, OS_STATUS } from "@/lib/constants.js";
import { queryKeys } from "@/lib/queryKeys.js";

const situacoes = [
  { value: "todas", label: "Todas" },
  ...OS_STATUS,
];

const formSituacoes = situacoes.filter((item) => item.value !== "todas");

const prioridades = [
  { value: "todas", label: "Todas" },
  ...OS_PRIORIDADES,
];

const formPrioridades = prioridades.filter((item) => item.value !== "todas");

const priorityStyles = {
  alta: "border-red-500/30 bg-red-500/10 text-red-200",
  media: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  baixa: "border-zinc-600 bg-zinc-800 text-zinc-300",
};

const emptyForm = {
  cliente_nome: "",
  cliente_telefone: "",
  cliente_email: "",
  cliente_cpf_cnpj: "",
  situacao: "diagnostico",
  prioridade: "media",
  tecnico_responsavel: "",
  defeito_reclamacao: "",
  observacoes: "",
  laudo_tecnico: "",
  adiantamento: "",
  desconto: "",
  valor_deslocamento: "",
  valor_outros: "",
};

export default function OrdensServico() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const {
    data: ordens = [],
    isLoading,
    isError,
    error,
  } = useOrdensServico();
  const [items, setItems] = useState([]);
  const [situacao, setSituacao] = useState("todas");
  const [prioridade, setPrioridade] = useState("todas");
  const [editing, setEditing] = useState(undefined);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const saveOrdem = useMutation({
    mutationFn: (payload) =>
      editing
        ? updateOrdemServico(editing.id, payload)
        : createOrdemServico(payload),
    onMutate: () => {
      return toast.loading("Salvando OS", "Enviando dados para o Supabase.");
    },
    onSuccess: (saved) => {
      setItems((current) =>
        editing
          ? current.map((item) => (item.id === editing.id ? saved : item))
          : [saved, ...current],
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.ordensServico });
      toast.success("OS salva", "Registro atualizado com sucesso.");
      closeModal();
    },
    onError: (mutationError) => {
      toast.error("Erro ao salvar OS", mutationError.message);
    },
    onSettled: (...args) => {
      const toastId = args[3];
      if (toastId) toast.dismiss(toastId);
    },
  });

  useEffect(() => {
    setItems(ordens);
  }, [ordens]);

  const filtered = useMemo(
    () =>
      items.filter((ordem) => {
        const matchSituacao = situacao === "todas" || ordem.situacao === situacao;
        const matchPrioridade =
          prioridade === "todas" || ordem.prioridade === prioridade;
        return matchSituacao && matchPrioridade;
      }),
    [items, prioridade, situacao],
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
  };

  const openEdit = (ordem) => {
    setEditing(ordem);
    setForm({
      ...emptyForm,
      ...ordem,
      cliente_email: ordem.cliente_email ?? "",
      cliente_cpf_cnpj: ordem.cliente_cpf_cnpj ?? "",
      observacoes: ordem.observacoes ?? "",
      laudo_tecnico: ordem.laudo_tecnico ?? "",
      adiantamento: ordem.adiantamento ?? "",
      desconto: ordem.desconto ?? "",
      valor_deslocamento: ordem.valor_deslocamento ?? "",
      valor_outros: ordem.valor_outros ?? "",
    });
    setErrors({});
  };

  const closeModal = () => {
    setEditing(undefined);
    setForm(emptyForm);
    setErrors({});
  };

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.cliente_nome.trim()) nextErrors.cliente_nome = "Informe o cliente.";
    if (!form.cliente_telefone.trim()) {
      nextErrors.cliente_telefone = "Informe o telefone.";
    }
    if (!form.tecnico_responsavel.trim()) {
      nextErrors.tecnico_responsavel = "Informe o tecnico responsavel.";
    }
    if (!form.defeito_reclamacao.trim()) {
      nextErrors.defeito_reclamacao = "Descreva o defeito reclamado.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      numero: editing?.numero ?? `OS-${String(items.length + 1043).padStart(4, "0")}`,
      cliente: form.cliente_nome,
      cliente_nome: form.cliente_nome,
      cliente_telefone: form.cliente_telefone,
      status: formSituacoes.find((item) => item.value === form.situacao)?.label,
      tecnico: form.tecnico_responsavel,
      entrada: editing?.entrada ?? new Date().toISOString().slice(0, 10),
      data_entrada: editing?.data_entrada ?? new Date().toISOString().slice(0, 10),
      defeito_reclamacao: form.defeito_reclamacao,
      adiantamento: Number(form.adiantamento || 0),
      desconto: Number(form.desconto || 0),
      valor_deslocamento: Number(form.valor_deslocamento || 0),
      valor_outros: Number(form.valor_outros || 0),
      entregue: form.situacao === "entregue",
    };

    saveOrdem.mutate(payload);
  };

  return (
    <main className="page-shell space-y-8">
      <AdminDashboard />

      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">crud visual</p>
            <h1 className="mt-2 text-3xl font-black text-zinc-50">
              Ordens de servico
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Listagem, filtros, criacao e edicao simuladas em estado local.
            </p>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex w-fit items-center gap-2 rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-zinc-950 hover:bg-orange-400"
          >
            <Plus size={18} />
            Nova OS
          </button>
        </div>

        <div className="card grid gap-3 p-4 md:grid-cols-[auto_1fr_1fr] md:items-center">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <SlidersHorizontal size={16} />
            Filtros
          </div>
          <Select
            label="Situacao"
            value={situacao}
            onChange={(event) => setSituacao(event.target.value)}
            options={situacoes}
          />
          <Select
            label="Prioridade"
            value={prioridade}
            onChange={(event) => setPrioridade(event.target.value)}
            options={prioridades}
          />
        </div>

        {isLoading ? <LoadingState label="Carregando ordens de servico..." /> : null}
        {isError ? <ErrorState message={error.message} /> : null}
        {!isLoading && !isError && filtered.length === 0 ? (
          <EmptyState description="Crie uma nova OS ou ajuste os filtros atuais." />
        ) : null}

        <div className="grid gap-4 xl:grid-cols-2">
          {!isLoading && !isError && filtered.map((ordem) => (
            <article key={ordem.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                    {ordem.numero}
                  </p>
                  <h2 className="mt-2 text-xl font-black text-zinc-50">
                    {ordem.cliente_nome}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {ordem.cliente_telefone}
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(ordem)}
                    className="inline-flex items-center gap-1 rounded-md border border-zinc-700 px-3 py-1 text-xs font-semibold text-zinc-200 hover:border-orange-500"
                  >
                    <Edit3 size={13} />
                    Editar
                  </button>
                  <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-orange-200">
                    {ordem.situacao.replace("_", " ")}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
                      priorityStyles[ordem.prioridade]
                    }`}
                  >
                    {ordem.prioridade}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 border-t border-zinc-800 pt-4 md:grid-cols-3">
                <Info label="Tecnico" value={ordem.tecnico_responsavel} />
                <Info label="Entrada" value={ordem.data_entrada} />
                <Info label="Equipamento" value={ordem.equipamento ?? "Nao informado"} />
              </div>

              <p className="mt-4 rounded-lg bg-zinc-950 p-4 text-sm leading-relaxed text-zinc-400">
                {ordem.defeito_reclamacao}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Modal
        open={editing !== undefined}
        title={editing ? `Editar ${editing.numero}` : "Nova OS"}
        description="Simulacao local preparada para futura persistencia via API REST."
        onClose={closeModal}
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-zinc-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="os-form"
              disabled={saveOrdem.isPending}
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400"
            >
              {saveOrdem.isPending ? "Salvando..." : "Salvar OS"}
            </button>
          </>
        }
      >
        <form id="os-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Cliente" value={form.cliente_nome} error={errors.cliente_nome} onChange={(event) => setField("cliente_nome", event.target.value)} />
            <Input label="Telefone" value={form.cliente_telefone} error={errors.cliente_telefone} onChange={(event) => setField("cliente_telefone", event.target.value)} />
            <Input label="E-mail" type="email" value={form.cliente_email} onChange={(event) => setField("cliente_email", event.target.value)} />
            <Input label="CPF/CNPJ" value={form.cliente_cpf_cnpj} onChange={(event) => setField("cliente_cpf_cnpj", event.target.value)} />
            <Select label="Situacao" value={form.situacao} options={formSituacoes} onChange={(event) => setField("situacao", event.target.value)} />
            <Select label="Prioridade" value={form.prioridade} options={formPrioridades} onChange={(event) => setField("prioridade", event.target.value)} />
            <Input label="Tecnico responsavel" value={form.tecnico_responsavel} error={errors.tecnico_responsavel} onChange={(event) => setField("tecnico_responsavel", event.target.value)} />
          </div>
          <Textarea label="Defeito reclamado" value={form.defeito_reclamacao} error={errors.defeito_reclamacao} onChange={(event) => setField("defeito_reclamacao", event.target.value)} />
          <Textarea label="Observacoes" value={form.observacoes} onChange={(event) => setField("observacoes", event.target.value)} />
          <Textarea label="Laudo tecnico" value={form.laudo_tecnico} onChange={(event) => setField("laudo_tecnico", event.target.value)} />
          <div className="grid gap-4 md:grid-cols-4">
            <MoneyInput label="Adiantamento" value={form.adiantamento} onChange={(event) => setField("adiantamento", event.target.value)} />
            <MoneyInput label="Desconto" value={form.desconto} onChange={(event) => setField("desconto", event.target.value)} />
            <MoneyInput label="Deslocamento" value={form.valor_deslocamento} onChange={(event) => setField("valor_deslocamento", event.target.value)} />
            <MoneyInput label="Outros" value={form.valor_outros} onChange={(event) => setField("valor_outros", event.target.value)} />
          </div>
        </form>
      </Modal>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
