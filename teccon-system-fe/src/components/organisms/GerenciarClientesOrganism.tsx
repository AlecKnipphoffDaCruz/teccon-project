import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getClients, updateClient, deleteClient } from "../../service/api/ClientService";
import type { Client } from "../../interfaces/Client";
import type { ClientRequest } from "../../interfaces/ClientRequest";

const GerenciarClientesOrganism: React.FC = () => {
    const [clientes, setClientes] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    const [editTarget, setEditTarget] = useState<Client | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => { fetchClientes(); }, []);

    async function fetchClientes() {
        setLoading(true);
        const response = await getClients();
        if (response.success && response.data) setClientes(response.data);
        setLoading(false);
    }

    async function handleSaveEdit() {
        if (!editTarget) return;
        setSaving(true);
        const payload: ClientRequest = {
            name: editTarget.name,
            contact: editTarget.contact,
            isActive: editTarget.isActive,
        };
        const response = await updateClient(editTarget.id, payload);
        if (response.success && response.data) {
            setClientes((prev) => prev.map((c) => (c.id === editTarget.id ? response.data! : c)));
            setEditTarget(null);
        }
        setSaving(false);
    }

    async function handleConfirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        const response = await deleteClient(deleteTarget.id);
        if (response.success) {
            setClientes((prev) => prev.filter((c) => c.id !== deleteTarget.id));
            setDeleteTarget(null);
        }
        setDeleting(false);
    }

    if (loading) {
        return (
            <div className="w-full max-w-3xl">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-3">
                    <svg className="w-6 h-6 animate-spin text-[#1A5FAD]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm text-gray-400">Carregando clientes...</p>
                </div>
            </div>
        );
    }

    if (clientes.length === 0) {
        return (
            <div className="w-full max-w-3xl">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">Nenhum cliente cadastrado</p>
                    <p className="text-xs text-gray-400">Vá até a aba "Criar Cliente" para adicionar o primeiro.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-3xl">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-400">
                        <span className="font-semibold text-gray-700">{clientes.length}</span> cliente{clientes.length !== 1 ? "s" : ""} cadastrado{clientes.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <div className="space-y-3">
                    {clientes.map((cliente) => (
                        <div
                            key={cliente.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5
                                       flex items-center justify-between gap-4 hover:border-[#1A5FAD]/20 transition"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-[#1A5FAD]/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-[#1A5FAD]">
                                        {cliente.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{cliente.name}</p>
                                        <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                                            ${cliente.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                                            {cliente.isActive ? "Ativo" : "Inativo"}
                                        </span>
                                    </div>
                                    {cliente.contact && (
                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 truncate">
                                            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {cliente.contact}
                                        </p>
                                    )}
                                    {cliente.listConstructions?.length > 0 && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {cliente.listConstructions.length} obra{cliente.listConstructions.length !== 1 ? "s" : ""} vinculada{cliente.listConstructions.length !== 1 ? "s" : ""}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => setEditTarget({ ...cliente })}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                                               text-[#1A5FAD] bg-[#1A5FAD]/10 hover:bg-[#1A5FAD]/20 transition"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(cliente)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                                               text-red-500 bg-red-50 hover:bg-red-100 transition"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Modal Editar ── */}
            {editTarget && (
                <Modal onClose={() => setEditTarget(null)}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-[#1A5FAD]/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#1A5FAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>Editar Cliente</h2>
                            <p className="text-xs text-gray-400">Altere os dados e salve.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <ModalField label="Nome do Cliente">
                            <input
                                type="text"
                                value={editTarget.name}
                                onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })}
                                className={inputCls}
                            />
                        </ModalField>
                        <ModalField label="Contato" hint="E-mail ou telefone">
                            <input
                                type="text"
                                value={editTarget.contact ?? ""}
                                onChange={(e) => setEditTarget({ ...editTarget, contact: e.target.value })}
                                placeholder="Ex: contato@empresa.com"
                                className={inputCls}
                            />
                        </ModalField>
                        <ModalField label="Status">
                            <button
                                type="button"
                                onClick={() => setEditTarget({ ...editTarget, isActive: !editTarget.isActive })}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all w-full
                                    ${editTarget.isActive
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                        : "bg-gray-50 border-gray-200 text-gray-500"}`}
                            >
                                <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-all flex-shrink-0
                                    ${editTarget.isActive ? "bg-emerald-500 justify-end" : "bg-gray-300 justify-start"}`}>
                                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                </div>
                                <span className="font-semibold">{editTarget.isActive ? "Ativo" : "Inativo"}</span>
                            </button>
                        </ModalField>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button onClick={() => setEditTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1A5FAD]
                                       hover:bg-[#154e8f] disabled:opacity-60 transition flex items-center justify-center gap-2
                                       shadow-[0_4px_14px_rgba(26,95,173,0.2)]"
                        >
                            {saving ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Salvando...
                                </>
                            ) : "Salvar Alterações"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── Modal Excluir ── */}
            {deleteTarget && (
                <Modal onClose={() => setDeleteTarget(null)}>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h2 className="text-base font-bold text-gray-800 mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>Excluir cliente?</h2>
                        <p className="text-sm text-gray-500 mb-1">Você está prestes a excluir</p>
                        <p className="text-sm font-semibold text-gray-800 mb-2">"{deleteTarget.name}"</p>
                        <p className="text-xs text-red-400 mb-6">Esta ação não pode ser desfeita.</p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500
                                           hover:bg-red-600 disabled:opacity-60 transition flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Excluindo...
                                    </>
                                ) : "Sim, excluir"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

// ── Sub-componentes ──────────────────────────────────────────────────────────

const inputCls =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#1A5FAD]/20 focus:border-[#1A5FAD] " +
    "placeholder:text-gray-300 transition";

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) =>
    ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-28 p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-7"
                style={{ animation: "fadeUp .25s cubic-bezier(.22,1,.36,1) both" }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                >
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {children}
            </div>
        </div>,
        document.body
    );

interface ModalFieldProps { label: string; hint?: string; children: React.ReactNode; }
const ModalField: React.FC<ModalFieldProps> = ({ label, hint, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
        {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
        {children}
    </div>
);

export default GerenciarClientesOrganism;