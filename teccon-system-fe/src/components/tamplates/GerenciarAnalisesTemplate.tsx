import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../organisms/Sidebar";
import { getCollections } from "../../service/api/CollectionService";
import { CollectionStatus } from "../../interfaces/enums/CollectionStatus";
import { ConcreteType } from "../../interfaces/enums/ConcreteType";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CollectionItem {
    id: number;
    status: string;
    constructionId: number;
    constructionName: string;
    clientId: number;
    moldingDate: string;
    fckStrength: number;
    concreteType: string;
    concreteSupplier: string;
    hasAdditive: boolean;
    additiveType: string;
    castingMethod: string;
    totalVolume: number;
    notes: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    [CollectionStatus.DRAFT]:       { label: "Rascunho",    color: "text-gray-500",   bg: "bg-gray-100",    dot: "bg-gray-400" },
    [CollectionStatus.IN_ANALYSIS]: { label: "Em Análise",  color: "text-blue-600",   bg: "bg-blue-50",     dot: "bg-blue-500" },
    [CollectionStatus.APPROVED]:    { label: "Aprovado",    color: "text-emerald-600",bg: "bg-emerald-50",  dot: "bg-emerald-500" },
    [CollectionStatus.REJECTED]:    { label: "Reprovado",   color: "text-red-600",    bg: "bg-red-50",      dot: "bg-red-500" },
    [CollectionStatus.FINISHED]:    { label: "Finalizado",  color: "text-purple-600", bg: "bg-purple-50",   dot: "bg-purple-500" },
};

function formatDate(dateStr: string) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getStatusCfg(status: string) {
    return STATUS_CONFIG[status] ?? { label: status, color: "text-gray-500", bg: "bg-gray-100", dot: "bg-gray-400" };
}

// ─── Component ────────────────────────────────────────────────────────────────

const GerenciarAnalisesTemplate: React.FC = () => {
    const navigate = useNavigate();

    const [collections, setCollections] = useState<CollectionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "fck_desc">("date_desc");

    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await getCollections();
            if (res.success && res.data) {
                setCollections(res.data as unknown as CollectionItem[]);
            } else {
                setError(res.message ?? "Erro ao carregar coletas.");
            }
            setLoading(false);
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        let list = [...collections];

        // Busca: obra, cliente ou ID
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (c) =>
                    c.constructionName?.toLowerCase().includes(q) ||
                    String(c.id).includes(q) ||
                    c.concreteSupplier?.toLowerCase().includes(q)
            );
        }

        // Filtro de status
        if (filterStatus) {
            list = list.filter((c) => c.status === filterStatus);
        }

        // Filtro de data (mês/ano)
        if (filterDate) {
            list = list.filter((c) => c.moldingDate?.startsWith(filterDate));
        }

        // Ordenação
        list.sort((a, b) => {
            if (sortBy === "date_desc") return new Date(b.moldingDate).getTime() - new Date(a.moldingDate).getTime();
            if (sortBy === "date_asc")  return new Date(a.moldingDate).getTime() - new Date(b.moldingDate).getTime();
            if (sortBy === "fck_desc")  return (b.fckStrength ?? 0) - (a.fckStrength ?? 0);
            return 0;
        });

        return list;
    }, [collections, search, filterStatus, filterDate, sortBy]);

    const hasFilters = search || filterStatus || filterDate;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp .3s cubic-bezier(.22,1,.36,1) both; }
                .card-hover { transition: box-shadow .18s, transform .18s; }
                .card-hover:hover { box-shadow: 0 8px 32px rgba(26,95,173,0.10); transform: translateY(-1px); }
            `}</style>

            <div className="flex min-h-screen bg-[#F0F1F5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Sidebar activeKey="analise" />

                <main className="flex-1 ml-[72px] px-6 py-8 overflow-y-auto">

                    {/* Header */}
                    <div className="mb-7 fade-up">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <span>Sistema</span><span>/</span>
                            <span className="text-[#1A5FAD] font-semibold">Análises</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-3xl font-black text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                                    Análise de Coletas
                                </h1>
                                <p className="text-base text-gray-400 mt-1">
                                    Selecione uma coleta para registrar os resultados dos ensaios.
                                </p>
                            </div>
                            {!loading && (
                                <div className="flex items-center gap-2 bg-[#1A5FAD]/10 text-[#1A5FAD] px-4 py-2 rounded-full text-sm font-bold flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    {filtered.length} coleta{filtered.length !== 1 ? "s" : ""}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-6 fade-up" style={{ animationDelay: ".05s" }}>
                        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-end">

                            {/* Busca */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Buscar</label>
                                <div className="relative">
                                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Nome da obra, ID ou fornecedor..."
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5FAD]/20 focus:border-[#1A5FAD] transition"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5FAD]/20 focus:border-[#1A5FAD] transition min-w-[160px]"
                                >
                                    <option value="">Todos os status</option>
                                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                        <option key={key} value={key}>{cfg.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Data */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mês / Ano</label>
                                <input
                                    type="month"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5FAD]/20 focus:border-[#1A5FAD] transition"
                                />
                            </div>

                            {/* Ordenar */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ordenar</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5FAD]/20 focus:border-[#1A5FAD] transition"
                                >
                                    <option value="date_desc">Mais recentes</option>
                                    <option value="date_asc">Mais antigas</option>
                                    <option value="fck_desc">Maior FCK</option>
                                </select>
                            </div>
                        </div>

                        {/* Limpar filtros */}
                        {hasFilters && (
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                                <span className="text-xs text-gray-400">Filtros ativos:</span>
                                {search && <FilterTag label={`"${search}"`} onRemove={() => setSearch("")} />}
                                {filterStatus && <FilterTag label={getStatusCfg(filterStatus).label} onRemove={() => setFilterStatus("")} />}
                                {filterDate && <FilterTag label={filterDate} onRemove={() => setFilterDate("")} />}
                                <button onClick={() => { setSearch(""); setFilterStatus(""); setFilterDate(""); }}
                                    className="ml-auto text-xs text-red-400 hover:text-red-600 font-semibold transition">
                                    Limpar tudo
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Estado: loading */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <div className="flex flex-col items-center gap-3">
                                <svg className="w-8 h-8 animate-spin text-[#1A5FAD]" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <p className="text-sm text-gray-400">Carregando coletas...</p>
                            </div>
                        </div>
                    )}

                    {/* Estado: erro */}
                    {!loading && error && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-5 text-sm text-red-500 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Estado: vazio */}
                    {!loading && !error && filtered.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-gray-300">
                            <svg className="w-14 h-14 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-base font-semibold text-gray-400">Nenhuma coleta encontrada</p>
                            <p className="text-sm text-gray-300 mt-1">Tente ajustar os filtros ou realizar uma nova coleta</p>
                            {hasFilters && (
                                <button onClick={() => { setSearch(""); setFilterStatus(""); setFilterDate(""); }}
                                    className="mt-4 px-5 py-2.5 bg-[#1A5FAD]/10 text-[#1A5FAD] rounded-xl text-sm font-semibold hover:bg-[#1A5FAD]/20 transition">
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    )}

                    {/* Lista de coletas */}
                    {!loading && !error && filtered.length > 0 && (
                        <div className="flex flex-col gap-3">
                            {filtered.map((c, i) => {
                                const cfg = getStatusCfg(c.status);
                                const canAnalyze = c.status === CollectionStatus.DRAFT || c.status === CollectionStatus.IN_ANALYSIS;

                                return (
                                    <div
                                        key={c.id}
                                        className="fade-up bg-white rounded-2xl border border-gray-100 shadow-sm card-hover overflow-hidden"
                                        style={{ animationDelay: `${i * 0.04}s` }}
                                    >
                                        <div className="px-6 py-5 flex items-center gap-5">

                                            {/* Ícone prédio */}
                                            <div className="w-12 h-12 rounded-xl bg-[#1A5FAD]/10 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-[#1A5FAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>

                                            {/* Info principal */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                    <h3 className="text-base font-bold text-gray-800 truncate" style={{ fontFamily: "'Sora', sans-serif" }}>
                                                        {c.constructionName || "—"}
                                                    </h3>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 flex-wrap">
                                                    <InfoChip icon={
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    } label={formatDate(c.moldingDate)} />
                                                    <InfoChip icon={
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                    } label={`FCK ${c.fckStrength ?? "—"} MPa`} />
                                                    <InfoChip icon={
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
                                                        </svg>
                                                    } label={`#${c.id}`} />
                                                    {c.concreteType && (
                                                        <InfoChip icon={
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        } label={c.concreteType === ConcreteType.READY_MIX ? "Usinado" : "Obra"} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Ação */}
                                            <div className="flex-shrink-0">
                                                <button
                                                    onClick={() => navigate(`/analise/${c.id}`)}
                                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition
                                                        ${canAnalyze
                                                            ? "bg-[#1A5FAD] text-white hover:bg-[#154e8f] shadow-[0_4px_14px_rgba(26,95,173,0.2)]"
                                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {canAnalyze ? (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Analisar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Visualizar
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Barra colorida de status na base */}
                                        <div className={`h-0.5 w-full ${cfg.dot}`} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const InfoChip: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
        <span className="text-gray-300">{icon}</span>
        {label}
    </span>
);

const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1A5FAD]/10 text-[#1A5FAD] rounded-full text-xs font-semibold">
        {label}
        <button onClick={onRemove} className="hover:text-red-400 transition">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </span>
);

export default GerenciarAnalisesTemplate;