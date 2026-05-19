import Modal from "@/components/forms/Modal.jsx";

export default function ConfirmDialog({
  open,
  title = "Confirmar acao",
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 hover:border-zinc-500"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400"
          >
            {confirmLabel}
          </button>
        </>
      }
    />
  );
}
