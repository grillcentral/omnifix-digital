import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Edit3, PackagePlus } from "lucide-react";
import {
  createEstoqueItem,
  updateEstoqueItem,
} from "@/api/client.js";
import Input from "@/components/forms/Input.jsx";
import Modal from "@/components/forms/Modal.jsx";
import MoneyInput from "@/components/forms/MoneyInput.jsx";
import Select from "@/components/forms/Select.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { useEstoque } from "@/hooks/useOmnifixData.js";
import { useToast } from "@/hooks/useToast.js";
import { ESTOQUE_CATEGORIAS } from "@/lib/constants.js";
import { formatCurrency } from "@/lib/formatters.js";
import { queryKeys } from "@/lib/queryKeys.js";

const categoriaOptions = ESTOQUE_CATEGORIAS;

const ativoOptions = [
  { value: "true", label: "Ativo" },
  { value: "false", label: "Inativo" },
];

const emptyForm = {
  codigo: "",
  descricao: "",
  categoria: "Pecas",
  quantidade_atual: "",
  quantidade_minima: "",
  valor_custo: "",
  valor_venda: "",
  fornecedor: "",
  localizacao: "",
  ativo: "true",
};

export default function Estoque() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const {
    data: estoque = [],
    isLoading,
    isError,
    error,
  } = useEstoque();
  const [items, setItems] = useState([]);
  const [categoria, setCategoria] = useState("todas");
  const [editing, setEditing] = useState(undefined);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const saveItem = useMutation({
    mutationFn: (payload) =>
      editing
        ? updateEstoqueItem(editing.id, payload)
        : createEstoqueItem(payload),
    onMutate: () =>
      toast.loading("Salvando item", "Atualizando o estoque no Supabase."),
    onSuccess: (saved) => {
      setItems((current) =>
        editing
          ? current.map((item) => (item.id === editing.id ? saved : item))
          : [saved, ...current],
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.estoque });
      queryClient.invalidateQueries({ queryKey: queryKeys.estoqueCritico });
      toast.success("Item salvo", "Estoque atualizado com sucesso.");
      closeModal();
    },
    onError: (mutationError) => {
      toast.error("Erro ao salvar item", mutationError.message);
    },
    onSettled: (...args) => {
      const toastId = args[3];
      if (toastId) toast.dismiss(toastId);
    },
  });

  useEffect(() => {
    setItems(estoque);
  }, [estoque]);

  const categorias = useMemo(
    () => ["todas", ...new Set(items.map((item) => item.categoria))],
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter((item) => categoria === "todas" || item.categoria === categoria),
    [categoria, items],
  );

  const criticos = items.filter(
    (item) => item.quantidade_atual <= item.quantidade_minima,
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      codigo: item.codigo ?? "",
      descricao: item.descricao ?? "",
      categoria: item.categoria ?? "Pecas",
      quantidade_atual: String(item.quantidade_atual ?? ""),
      quantidade_minima: String(item.quantidade_minima ?? ""),
      valor_custo: String(item.valor_custo ?? ""),
      valor_venda: String(item.valor_venda ?? ""),
      fornecedor: item.fornecedor ?? "",
      localizacao: item.localizacao ?? "",
      ativo: item.ativo === false ? "false" : "true",
    });
    setErrors({});
  };

  const closeModal = () => {
    if (saveItem.isPending) return;
    setEditing(undefined);
    setErrors({});
  };

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.codigo.trim()) nextErrors.codigo = "Informe o codigo do item.";
    if (!form.descricao.trim()) nextErrors.descricao = "Informe a descricao.";
    if (!form.categoria.trim()) nextErrors.categoria = "Escolha a categoria.";
    if (!form.quantidade_atual.trim()) {
      nextErrors.quantidade_atual = "Informe a quantidade atual.";
    }
    if (!form.quantidade_minima.trim()) {
      nextErrors.quantidade_minima = "Informe a quantidade minima.";
    }
    if (!form.fornecedor.trim()) nextErrors.fornecedor = "Informe o fornecedor.";
    if (!form.localizacao.trim()) nextErrors.localizacao = "Informe a localizacao.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      item: form.descricao,
      quantidade_atual: Number(form.quantidade_atual),
      quantidade_minima: Number(form.quantidade_minima),
      quantidade: Number(form.quantidade_atual),
      minimo: Number(form.quantidade_minima),
      valor_custo: Number(form.valor_custo || 0),
      valor_venda: Number(form.valor_venda || 0),
      ativo: form.ativo === "true",
    };

    saveItem.mutate(payload);
  };

  return (
    <main className="page-shell space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">crud visual</p>
          <h1 className="mt-2 text-3xl font-black text-zinc-50">Estoque</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Controle visual de pecas, produtos e insumos com alerta de estoque
            critico. Dados persistidos no Supabase via adapter.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex w-fit items-center gap-2 rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-zinc-950 hover:bg-orange-400"
        >
          <PackagePlus size={18} />
          Novo item
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <label className="card grid gap-2 p-4 text-sm text-zinc-400">
          Categoria
          <select
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
          >
            {categorias.map((item) => (
              <option key={item} value={item}>
                {item === "todas" ? "Todas" : item}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-lg border border-orange-500/25 bg-orange-500/10 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-orange-400" size={22} />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-orange-300">
                estoque critico
              </p>
              <p className="text-2xl font-black text-zinc-50">{criticos.length}</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingState label="Carregando estoque..." /> : null}
      {isError ? <ErrorState message={error.message} /> : null}
      {!isLoading && !isError && filtered.length === 0 ? (
        <EmptyState description="Crie um novo item ou ajuste o filtro de categoria." />
      ) : null}

      <section className="grid gap-4 xl:grid-cols-2">
        {!isLoading && !isError && filtered.map((item) => {
          const isCritical = item.quantidade_atual <= item.quantidade_minima;

          return (
            <article
              key={item.id}
              className={`rounded-lg border bg-zinc-900 p-5 shadow-sm shadow-black/20 ${
                isCritical ? "border-orange-500/60" : "border-zinc-800"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                    {item.codigo}
                  </p>
                  <h2 className="mt-2 text-xl font-black text-zinc-50">
                    {item.descricao}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">{item.categoria}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {isCritical ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-orange-200">
                      <AlertTriangle size={13} />
                      Critico
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-200 hover:border-orange-500 hover:text-orange-300"
                  >
                    <Edit3 size={14} />
                    Editar
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 border-t border-zinc-800 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <Info label="Atual" value={item.quantidade_atual} highlight />
                <Info label="Minima" value={item.quantidade_minima} />
                <Info label="Custo" value={formatCurrency(item.valor_custo)} />
                <Info label="Venda" value={formatCurrency(item.valor_venda)} />
              </div>

              <div className="mt-5 grid gap-3 rounded-lg bg-zinc-950 p-4 md:grid-cols-2">
                <Info label="Fornecedor" value={item.fornecedor} />
                <Info label="Localizacao" value={item.localizacao} />
              </div>
            </article>
          );
        })}
      </section>

      <Modal
        open={editing !== undefined}
        title={editing ? "Editar item" : "Novo item"}
        description="Preencha os dados operacionais do estoque."
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
              form="estoque-form"
              disabled={saveItem.isPending}
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveItem.isPending ? "Salvando..." : "Salvar item"}
            </button>
          </>
        }
      >
        <form id="estoque-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Codigo"
              value={form.codigo}
              onChange={(event) => setField("codigo", event.target.value)}
              error={errors.codigo}
              required
            />
            <Select
              label="Categoria"
              value={form.categoria}
              onChange={(event) => setField("categoria", event.target.value)}
              options={categoriaOptions}
              error={errors.categoria}
              required
            />
          </div>
          <Input
            label="Descricao"
            value={form.descricao}
            onChange={(event) => setField("descricao", event.target.value)}
            error={errors.descricao}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Quantidade atual"
              type="number"
              min="0"
              value={form.quantidade_atual}
              onChange={(event) => setField("quantidade_atual", event.target.value)}
              error={errors.quantidade_atual}
              required
            />
            <Input
              label="Quantidade minima"
              type="number"
              min="0"
              value={form.quantidade_minima}
              onChange={(event) => setField("quantidade_minima", event.target.value)}
              error={errors.quantidade_minima}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <MoneyInput
              label="Valor custo"
              value={form.valor_custo}
              onChange={(event) => setField("valor_custo", event.target.value)}
            />
            <MoneyInput
              label="Valor venda"
              value={form.valor_venda}
              onChange={(event) => setField("valor_venda", event.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Fornecedor"
              value={form.fornecedor}
              onChange={(event) => setField("fornecedor", event.target.value)}
              error={errors.fornecedor}
              required
            />
            <Input
              label="Localizacao"
              value={form.localizacao}
              onChange={(event) => setField("localizacao", event.target.value)}
              error={errors.localizacao}
              required
            />
          </div>
          <Select
            label="Status"
            value={form.ativo}
            onChange={(event) => setField("ativo", event.target.value)}
            options={ativoOptions}
          />
        </form>
      </Modal>
    </main>
  );
}

function Info({ label, value, highlight = false }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${
          highlight ? "text-orange-400" : "text-zinc-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
