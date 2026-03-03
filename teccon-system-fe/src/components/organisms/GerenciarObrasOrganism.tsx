import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getConstructions, updateConstruction, deleteConstruction } from "../../service/api/ConstructionService";
import type { Construction } from "../../interfaces/Construction";

const GerenciarObrasOrganism: React.FC = () => {
    const [obras, setObras] = useState<Construction[]>([]);
    const [loading, setLoading] = useState(true);

    const [editTarget, setEditTarget] = useState<Construction | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Construction | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => { fetchObras(); }, []);

    async function fetchObras() {
        setLoading(true);
        const response = await getConstructions();
        if (response.success && response.data) setObras(response.data);
        setLoading(false);
    }

    async function handleSaveEdit() {
        if (!editTarget?.id) return;
        setSaving(true);
        const response = await updateConstruction(String(editTarget.id), editTarget);
        if (response.success && response.data) {
            setObras((prev) => prev.map((o) => (o.id === editTarget.id ? response.data! : o)));
            setEditTarget(null);
        }
        setSaving(false);
    }

    async function handleConfirmDelete() {
        if (!deleteTarget?.id) return;
        setDeleting(true);
        const response = await deleteConstruction(String(deleteTarget.id));
        if (response.success) {
            setObras((prev) => prev.filter((o) => o.id !== deleteTarget.id));
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
                    <p className="text-sm text-gray-400">Carregando obras...</p>
                </div>
            </div>
        );
    }

    if (obras.length === 0) {
        return (
            <div className="w-full max-w-3xl">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">Nenhuma obra cadastrada</p>
                    <p className="text-xs text-gray-400">Vá até a aba "Criar Obra" para adicionar a primeira.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-3xl">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-400">
                        <span className="font-semibold text-gray-700">{obras.length}</span> obra{obras.length !== 1 ? "s" : ""} cadastrada{obras.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <div className="space-y-3">
                    {obras.map((obra) => (
                        <div
                            key={obra.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5
                                       flex items-center justify-between gap-4 hover:border-[#1A5FAD]/20 transition"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-[#1A5FAD]/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-[#1A5FAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{obra.name}</p>
                                    {obra.locationDto && (
                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {obra.locationDto.city} — {obra.locationDto.neighborhood}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => setEditTarget({ ...obra })}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                                               text-[#1A5FAD] bg-[#1A5FAD]/10 hover:bg-[#1A5FAD]/20 transition"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(obra)}
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
                            <h2 className="text-base font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>Editar Obra</h2>
                            <p className="text-xs text-gray-400">Altere os dados e salve.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <ModalField label="Nome da Obra">
                            <input
                                type="text"
                                value={editTarget.name}
                                onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })}
                                className={inputCls}
                            />
                        </ModalField>
                        <ModalField label="Idades de Cura (dias)" hint="Separados por vírgula — Ex: 7, 14, 28">
                            <input
                                type="text"
                                value={editTarget.curingAgesExpected?.join(", ") ?? ""}
                                onChange={(e) => {
                                    const parsed = e.target.value
                                        .split(",")
                                        .map((v) => Number(v.trim()))
                                        .filter((v) => !isNaN(v) && v > 0);
                                    setEditTarget({ ...editTarget, curingAgesExpected: parsed });
                                }}
                                className={inputCls}
                            />
                        </ModalField>
                        <ModalField label="Quantidade Esperada">
                            <input
                                type="number"
                                value={editTarget.quantityExpected || ""}
                                onChange={(e) => setEditTarget({ ...editTarget, quantityExpected: Number(e.target.value) })}
                                className={inputCls}
                            />
                        </ModalField>
                        <ModalField label="Observações">
                            <textarea
                                rows={3}
                                value={editTarget.obs ?? ""}
                                onChange={(e) => setEditTarget({ ...editTarget, obs: e.target.value })}
                                className={`${inputCls} resize-none`}
                            />
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
                        <h2 className="text-base font-bold text-gray-800 mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>Excluir obra?</h2>
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

export default GerenciarObrasOrganism;