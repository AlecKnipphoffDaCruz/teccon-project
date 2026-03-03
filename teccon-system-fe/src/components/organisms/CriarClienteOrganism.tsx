import React, { useState } from "react";
import { createClient } from "../../service/api/ClientService";
import type { ClientRequest } from "../../interfaces/ClientRequest";

interface Props {
    onSuccess?: () => void;
}

const emptyForm = (): ClientRequest => ({
    name: "",
    contact: "",
    isActive: true,
});

const CriarClienteOrganism: React.FC<Props> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<ClientRequest>(emptyForm());

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        const response = await createClient(form);

        if (response.success) {
            setSuccess(true);
            setForm(emptyForm());
            setTimeout(() => onSuccess?.(), 1200);
        } else {
            setError(response.message ?? "Erro ao criar cliente.");
        }

        setLoading(false);
    }

    return (
        <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {success && (
                    <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-emerald-700">Cliente criado com sucesso!</p>
                            <p className="text-xs text-emerald-500 mt-0.5">Redirecionando para a lista de clientes...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="divide-y divide-gray-100">

                    {/* SEÇÃO 1 — Identificação */}
                    <div className="px-8 py-7">
                        <SectionTitle number={1} label="Dados do Cliente" />
                        <div className="mt-5 space-y-4">

                            <Field label="Nome do Cliente" required>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    placeholder="Ex: Construtora Horizonte Ltda"
                                    className={inputCls}
                                />
                            </Field>

                            <Field
                                label="Contato"
                                hint="E-mail ou telefone do cliente"
                            >
                                <input
                                    type="text"
                                    value={form.contact ?? ""}
                                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                                    placeholder="Ex: contato@horizonte.com ou (51) 99999-0000"
                                    className={inputCls}
                                />
                            </Field>
                        </div>
                    </div>
                    {/* Botão */}
                    <div className="px-8 py-6 bg-gray-50">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#1A5FAD] text-white rounded-xl text-sm font-bold
                                       hover:bg-[#154e8f] active:scale-[0.99] disabled:opacity-60
                                       transition-all flex items-center justify-center gap-2
                                       shadow-[0_4px_14px_rgba(26,95,173,0.25)]"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Criar Cliente
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

// ── Sub-componentes ──────────────────────────────────────────────────────────

const inputCls =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#1A5FAD]/20 focus:border-[#1A5FAD] " +
    "placeholder:text-gray-300 transition";

interface SectionTitleProps { number: number; label: string; optional?: boolean; }
const SectionTitle: React.FC<SectionTitleProps> = ({ number, label, optional }) => (
    <div className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full bg-[#1A5FAD] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {number}
        </span>
        <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Sora', sans-serif" }}>
            {label}
        </span>
        {optional && <span className="text-xs text-gray-400 font-normal">— opcional</span>}
    </div>
);

interface FieldProps { label: string; required?: boolean; hint?: string; children: React.ReactNode; }
const Field: React.FC<FieldProps> = ({ label, required, hint, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
        {children}
    </div>
);

export default CriarClienteOrganism;