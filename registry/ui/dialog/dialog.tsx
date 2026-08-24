/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
};

type PromptOptions = {
  title: string;
  message?: string;
  label: string;
  initialValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  required?: boolean;
};

type DialogRequest =
  | ({ id: number; kind: "confirm" } & ConfirmOptions)
  | ({ id: number; kind: "prompt" } & PromptOptions);

type DialogResult = boolean | string | null;

export function useDialog() {
  const [request, setRequest] = useState<DialogRequest | null>(null);
  const resolver = useRef<((result: DialogResult) => void) | null>(null);
  const nextId = useRef(0);

  const settle = useCallback((result: DialogResult) => {
    resolver.current?.(result);
    resolver.current = null;
    setRequest(null);
  }, []);

  const confirmDialog = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        resolver.current = (result) => resolve(result === true);
        setRequest({ ...options, id: ++nextId.current, kind: "confirm" });
      }),
    []
  );

  const promptDialog = useCallback(
    (options: PromptOptions) =>
      new Promise<string | null>((resolve) => {
        resolver.current = (result) =>
          resolve(typeof result === "string" ? result : null);
        setRequest({ ...options, id: ++nextId.current, kind: "prompt" });
      }),
    []
  );

  return {
    confirmDialog,
    promptDialog,
    dialog: request ? (
      <Dialog key={request.id} request={request} onSettle={settle} />
    ) : null,
  };
}

function Dialog({
  request,
  onSettle,
}: {
  request: DialogRequest;
  onSettle: (result: DialogResult) => void;
}) {
  const [value, setValue] = useState(
    request.kind === "prompt" ? request.initialValue ?? "" : ""
  );
  const [error, setError] = useState("");
  const primaryRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const frame = requestAnimationFrame(() => {
      if (request.kind === "prompt") inputRef.current?.focus();
      else primaryRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      previousFocus.current?.focus();
    };
  }, [request.kind]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onSettle(request.kind === "confirm" ? false : null);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onSettle, request.kind]);

  function cancel() {
    onSettle(request.kind === "confirm" ? false : null);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (request.kind === "confirm") return onSettle(true);
    const trimmed = value.trim();
    if (request.required !== false && !trimmed) {
      setError("Este campo no puede quedar vacío.");
      inputRef.current?.focus();
      return;
    }
    onSettle(value);
  }

  const titleId = `dialog-title-${request.id}`;
  const messageId = `dialog-message-${request.id}`;
  const esDestructivo = request.kind === "confirm" && request.destructive;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) cancel();
      }}
    >
      <form
        className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={
          "message" in request && request.message ? messageId : undefined
        }
        onSubmit={submit}
      >
        <div
          className={`mb-4 flex size-10 items-center justify-center rounded-full text-lg font-bold ${
            esDestructivo
              ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
              : "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400"
          }`}
          aria-hidden="true"
        >
          {request.kind === "confirm" ? (esDestructivo ? "!" : "?") : "Aa"}
        </div>

        <h2
          id={titleId}
          className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
        >
          {request.title}
        </h2>

        {"message" in request && request.message && (
          <p
            id={messageId}
            className="mt-2 text-sm text-neutral-600 dark:text-neutral-400"
          >
            {request.message}
          </p>
        )}

        {request.kind === "prompt" && (
          <label className="mt-4 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {request.label}
            <input
              ref={inputRef}
              value={value}
              placeholder={request.placeholder}
              onChange={(event) => {
                setValue(event.target.value);
                setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={
                error ? `dialog-error-${request.id}` : undefined
              }
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 aria-[invalid=true]:border-red-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>
        )}

        {error && (
          <div
            className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
            id={`dialog-error-${request.id}`}
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={cancel}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancelar
          </button>
          <button
            ref={primaryRef}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
              esDestructivo
                ? "bg-red-600 hover:bg-red-700"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {request.confirmLabel ??
              (request.kind === "confirm" ? "Aceptar" : "Guardar")}
          </button>
        </div>
      </form>
    </div>
  );
}