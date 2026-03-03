import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { createConstruction } from "../../service/api/ConstructionService";
import { getClients } from "../../service/api/ClientService";
import type { ConstructionRequestPayload } from "../../interfaces/ConstructionRequestPayload";
import type { Client } from "../../interfaces/Client";

interface Props {
    onSuccess?: () => void;
}

const emptyLocation = () => ({
    city: "",
    state: "",
    neighborhood: "",
    street: "",
    number: 0,
});

const emptyForm = () => ({
    name: "",
    curingAgesExpected: [] as number[],
    quantityExpected: 0,
    obs: "",
});

const CriarObraOrganism: React.FC<Props> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [curingInput, setCuringInput] = useState("");

    const [form, setForm] = useState(emptyForm());
    const [location, setLocation] = useState(emptyLocation());

    // ── Clientes ──
    const [clients, setClients] = useState<Client[]>([]);
    const [clientsLoading, setClientsLoading] = useState(true);
    const [noClients, setNoClients] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [clientSearch, setClientSearch] = useState("");

    useEffect(() => {
        async function fetchClients() {
            setClientsLoading(true);
            const response = await getClients();
            if (response.success && response.data) {
                if (response.data.length === 0) {
                    setNoClients(true);
                } else {
                    setClients(response.data.filter((c) => c.isActive));
                }
            }
            setClientsLoading(false);
        }
        fetchClients();
    }, []);

    const filteredClients = clients.filter((c) =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.contact?.toLowerCase().includes(clientSearch.toLowerCase())
    );

    const curingTags = curingInput
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "" && !isNaN(Number(v)) && Number(v) > 0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedClient) return;

        setLoading(true);
        setSuccess(false);

        const parsedCuring = curingInput
            .split(",")
            .map((v) => Number(v.trim()))
            .filter((v) => !isNaN(v) && v > 0);

        const payload: ConstructionRequestPayload = {
            clientId: selectedClient.id,
            location: {
                id: null,
                state: location.state,
                city: location.city,
                neighborhood: location.neighborhood,
                street: location.street,
                number: location.number,
            },
            name: form.name,
            curingAgesExpected: parsedCuring,
            quantityExpected: form.quantityExpected,
            obs: form.obs,
        };

        const response = await createConstruction(payload);

        if (response.success) {
            setSuccess(true);
            setForm(emptyForm());
            setLocation(emptyLocation());
            setCuringInput("");
            setSelectedClient(null);
            setTimeout(() => onSuccess?.(), 1200);
        }

        setLoading(false);
    }

    // ── Sem clientes: redireciona ──
    if (!clientsLoading && noClients) {
        return (
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                        <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800 mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Nenhum cliente cadastrado
                        </h3>
                        <p className="text-sm text-gray-400 max-w-xs">
                            Para criar uma obra, é necessário ter ao menos um cliente ativo no sistema.
                        </p>
                    </div>
                    <a
                        href="/clientes"
                        className="mt-2 flex items-center gap-2 px-6 py-3 bg-[#1A5FAD] text-white rounded-xl text-sm font-bold
                                   hover:bg-[#154e8f] transition shadow-[0_4px_14px_rgba(26,95,173,0.25)]"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Cadastrar Cliente
                    </a>
                </div>
            </div>
        );
    }

    return (
        <>
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
                                <p className="text-sm font-semibold text-emerald-700">Obra criada com sucesso!</p>
                                <p className="text-xs text-emerald-500 mt-0.5">Redirecionando para a lista de obras...</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="divide-y divide-gray-100">

                        {/* SEÇÃO 1 — Identificação */}
                        <div className="px-8 py-7">
                            <SectionTitle number={1} label="Identificação" />
                            <div className="mt-5 space-y-4">
                                <Field label="Nome da Obra" required>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                        placeholder="Ex: Residencial das Acácias, Bloco B"
                                        className={inputCls}
                                    />
                                </Field>

                                {/* Seletor de cliente */}
                                <Field label="Cliente" required>
                                    {clientsLoading ? (
                                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                                            <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            <span className="text-sm text-gray-400">Carregando clientes...</span>
                                        </div>
                                    ) : selectedClient ? (
                                        /* Cliente selecionado */
                                        <div className="flex items-center justify-between px-4 py-3 bg-[#1A5FAD]/5 border border-[#1A5FAD]/20 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#1A5FAD]/15 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-bold text-[#1A5FAD]">
                                                        {selectedClient.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{selectedClient.name}</p>
                                                    {selectedClient.contact && (
                                                        <p className="text-xs text-gray-400">{selectedClient.contact}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowClientModal(true)}
                                                className="text-xs text-[#1A5FAD] font-semibold hover:underline"
                                            >
                                                Trocar
                                            </button>
                                        </div>
                                    ) : (
                                        /* Nenhum cliente selecionado */
                                        <button
                                            type="button"
                                            onClick={() => setShowClientModal(true)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200
                                                       rounded-xl text-sm text-gray-400 hover:border-[#1A5FAD]/40 hover:text-[#1A5FAD] transition"
                                        >
                                            <span>Selecionar cliente...</span>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    )}
                                </Field>
                            </div>
                        </div>

                        {/* SEÇÃO 2 — Localização */}
                        <div className="px-8 py-7">
                            <SectionTitle number={2} label="Localização da Obra" />
                            <div className="mt-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Cidade" required>
                                        <input
                                            type="text"
                                            value={location.city}
                                            onChange={(e) => setLocation({ ...location, city: e.target.value })}
                                            required
                                            placeholder="Ex: Porto Alegre"
                                            className={inputCls}
                                        />
                                    </Field>
                                    <Field label="Estado" required>
                                        <input
                                            type="text"
                                            value={location.state}
                                            onChange={(e) => setLocation({ ...location, state: e.target.value })}
                                            required
                                            maxLength={2}
                                            placeholder="Ex: RS"
                                            className={inputCls}
                                        />
                                    </Field>
                                </div>
                                <Field label="Bairro" required>
                                    <input
                                        type="text"
                                        value={location.neighborhood}
                                        onChange={(e) => setLocation({ ...location, neighborhood: e.target.value })}
                                        required
                                        placeholder="Ex: Centro"
                                        className={inputCls}
                                    />
                                </Field>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <Field label="Rua / Avenida" required>
                                            <input
                                                type="text"
                                                value={location.street}
                                                onChange={(e) => setLocation({ ...location, street: e.target.value })}
                                                required
                                                placeholder="Ex: Av. Borges de Medeiros"
                                                className={inputCls}
                                            />
                                        </Field>
                                    </div>
                                    <Field label="Número" required>
                                        <input
                                            type="number"
                                            value={location.number || ""}
                                            onChange={(e) => setLocation({ ...location, number: Number(e.target.value) })}
                                            required
                                            placeholder="0"
                                            className={inputCls}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO 3 — Dados de Coleta */}
                        <div className="px-8 py-7">
                            <SectionTitle number={3} label="Dados de Coleta" />
                            <div className="mt-5 space-y-5">
                                <Field
                                    label="Idades de Cura (dias)"
                                    hint="Digite os dias separados por vírgula — Ex: 7, 14, 28"
                                >
                                    <input
                                        type="text"
                                        value={curingInput}
                                        onChange={(e) => setCuringInput(e.target.value)}
                                        placeholder="7, 14, 28"
                                        className={inputCls}
                                    />
                                    {curingTags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {curingTags.map((tag) => (
                                                <span key={tag} className="inline-flex items-center px-3 py-1 bg-[#1A5FAD]/10 text-[#1A5FAD] text-xs font-semibold rounded-full">
                                                    {tag} dias
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </Field>

                                <Field label="Quantidade Esperada de Corpos de Prova" required>
                                    <input
                                        type="number"
                                        min={1}
                                        value={form.quantityExpected || ""}
                                        onChange={(e) => setForm({ ...form, quantityExpected: Number(e.target.value) })}
                                        required
                                        placeholder="Ex: 12"
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* SEÇÃO 4 — Observações */}
                        <div className="px-8 py-7">
                            <SectionTitle number={4} label="Observações" optional />
                            <div className="mt-5">
                                <textarea
                                    rows={3}
                                    value={form.obs}
                                    onChange={(e) => setForm({ ...form, obs: e.target.value })}
                                    placeholder="Anotações adicionais sobre esta obra..."
                                    className={`${inputCls} resize-none`}
                                />
                            </div>
                        </div>

                        {/* Botão */}
                        <div className="px-8 py-6 bg-gray-50">
                            <button
                                type="submit"
                                disabled={loading || !selectedClient}
                                className="w-full py-3.5 bg-[#1A5FAD] text-white rounded-xl text-sm font-bold
                                           hover:bg-[#154e8f] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed
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
                                        {selectedClient ? "Criar Obra" : "Selecione um cliente para continuar"}
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* ── Modal seleção de cliente ── */}
            {showClientModal && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowClientModal(false)}
                    />
                    <div
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                        style={{ animation: "fadeUp .25s cubic-bezier(.22,1,.36,1) both" }}
                    >
                        {/* Header do modal */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-base font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                                    Selecionar Cliente
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">Escolha o cliente vinculado a esta obra</p>
                            </div>
                            <button
                                onClick={() => setShowClientModal(false)}
                                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                            >
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Busca */}
                        <div className="relative mb-4">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                placeholder="Buscar por nome ou contato..."
                                autoFocus
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                                           focus:outline-none focus:ring-2 focus:ring-[#1A5FAD]/20 focus:border-[#1A5FAD] transition"
                            />
                        </div>

                        {/* Lista */}
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {filteredClients.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">Nenhum cliente encontrado.</p>
                            ) : (
                                filteredClients.map((client) => (
                                    <button
                                        key={client.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedClient(client);
                                            setShowClientModal(false);
                                            setClientSearch("");
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition
                                            ${selectedClient?.id === client.id
                                                ? "bg-[#1A5FAD] text-white"
                                                : "bg-gray-50 hover:bg-[#1A5FAD]/10 text-gray-700"
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold
                                            ${selectedClient?.id === client.id ? "bg-white/20 text-white" : "bg-[#1A5FAD]/10 text-[#1A5FAD]"}`}>
                                            {client.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate">{client.name}</p>
                                            {client.contact && (
                                                <p className={`text-xs truncate ${selectedClient?.id === client.id ? "text-white/70" : "text-gray-400"}`}>
                                                    {client.contact}
                                                </p>
                                            )}
                                        </div>
                                        {selectedClient?.id === client.id && (
                                            <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Link para criar novo cliente */}
                        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                            <a
                                href="/clientes"
                                className="text-xs text-[#1A5FAD] font-semibold hover:underline"
                            >
                                + Cadastrar novo cliente
                            </a>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
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

export default CriarObraOrganism;