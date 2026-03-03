import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Sidebar from "../organisms/Sidebar";
import { getClients } from "../../service/api/ClientService";
import { getConstructions } from "../../service/api/ConstructionService";
import { createCollection } from "../../service/api/CollectionService";
import type { Construction } from "../../interfaces/Construction";
import type { Collection } from "../../interfaces/Collection";
import { ConcreteType } from "../../interfaces/enums/ConcreteType";
import { CastingMethod } from "../../interfaces/enums/CastingMethod";
import { CollectionStatus } from "../../interfaces/enums/CollectionStatus";
import type { Sample } from "../../interfaces/Sample";
import { createSample } from "../../service/api/SampleService";
import toLocalDateTimeString from '../../utils/toLocalDateTimeString';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Phase = "obra" | "coleta" | "amostras" | "sucesso";

interface SampleDraft {
  _id: string; // local only
  serialNumber: string;
  capsuleCount: string;
  invoiceNumber: string;
  sealNumber: string;
  loadTime: string;
  moldingTime: string;
  slumpTest: string;
  extraWaterAdded: string;
  volume: string;
  concreteArea: string;
}

const emptySample = (): SampleDraft => ({
  _id: Date.now().toString(),
  serialNumber: "",
  capsuleCount: "",
  invoiceNumber: "",
  sealNumber: "",
  loadTime: "",
  moldingTime: "",
  slumpTest: "",
  extraWaterAdded: "",
  volume: "",
  concreteArea: "",
});

interface CollectionDraft {
  moldingDate: string;
  fckStrength: string;
  concreteType: string;
  concreteSupplier: string;
  hasAdditive: boolean;
  additiveType: string;
  castingMethod: string;
  totalVolume: string;
  notes: string;
}

const emptyCollection = (): CollectionDraft => ({
  moldingDate: "",
  fckStrength: "",
  concreteType: "",
  concreteSupplier: "",
  hasAdditive: false,
  additiveType: "",
  castingMethod: "",
  totalVolume: "",
  notes: "",
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const ColetaTemplate: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("obra");

  // Obra
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [loadingConstructions, setLoadingConstructions] = useState(true);
  const [selectedConstruction, setSelectedConstruction] = useState<Construction | null>(null);
  const [obraSearch, setObraSearch] = useState("");

  // Collection form
  const [collection, setCollection] = useState<CollectionDraft>(emptyCollection());

  // Samples
  const [samples, setSamples] = useState<SampleDraft[]>([]);
  const [sampleDraft, setSampleDraft] = useState<SampleDraft>(emptySample());
  const [editingSampleId, setEditingSampleId] = useState<string | null>(null);

  // Confirm modals
  const [confirmModal, setConfirmModal] = useState<"obra" | "coleta" | "amostras" | null>(null);

  // Save
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      setLoadingConstructions(true);
      const res = await getConstructions();
      if (res.success && res.data) setConstructions(res.data);
      setLoadingConstructions(false);
    }
    load();
  }, []);

  const filtered = constructions.filter((c) =>
    c.name.toLowerCase().includes(obraSearch.toLowerCase())
  );

  // ── Handlers ──

  function handleConfirmObra() {
    if (!selectedConstruction) return;
    setConfirmModal("obra");
  }

  function handleConfirmColeta() {
    if (!collection.moldingDate || !collection.fckStrength || !collection.concreteType || !collection.castingMethod) return;
    setConfirmModal("coleta");
  }

  function handleAddOrUpdateSample() {
    const required = ["serialNumber", "capsuleCount", "loadTime", "moldingTime"] as const;
    for (const field of required) {
      if (!sampleDraft[field]) return;
    }
    if (editingSampleId) {
      setSamples((prev) => prev.map((s) => s._id === editingSampleId ? { ...sampleDraft } : s));
      setEditingSampleId(null);
    } else {
      setSamples((prev) => [...prev, { ...sampleDraft, _id: Date.now().toString() }]);
    }
    setSampleDraft(emptySample());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEditSample(s: SampleDraft) {
    setSampleDraft({ ...s });
    setEditingSampleId(s._id);
  }

  function handleRemoveSample(id: string) {
    setSamples((prev) => prev.filter((s) => s._id !== id));
    if (editingSampleId === id) {
      setEditingSampleId(null);
      setSampleDraft(emptySample());
    }
  }

  async function handleSave() {
    if (!selectedConstruction) return;

    setSaving(true);

    // 1️⃣ Criar Collection
    const collectionPayload = {
      status: CollectionStatus.DRAFT,
      constructionId: selectedConstruction.id,
      clientId: selectedConstruction.id, // ⚠️ use o client correto
      moldingDate: new Date(collection.moldingDate).toISOString(),
      fckStrength: Number(collection.fckStrength),
      concreteType: collection.concreteType,
      concreteSupplier: collection.concreteSupplier || null,
      hasAdditive: collection.hasAdditive,
      additiveType: collection.additiveType || null,
      castingMethod: collection.castingMethod,
      totalVolume: collection.totalVolume
        ? Number(collection.totalVolume)
        : null,
      notes: collection.notes || null,
    };

    const collectionRes = await createCollection(collectionPayload as any);

    if (!collectionRes.success || !collectionRes.data) {
      setSaving(false);
      return;
    }

    const createdCollectionId = (collectionRes.data as any).id;

    // 2️⃣ Criar Samples
    const samplesPayload = samples.map((s) => ({
      collectionId: createdCollectionId,
      serialNumber: s.serialNumber,
      capsuleCount: Number(s.capsuleCount),

      invoiceNumber: s.invoiceNumber
        ? Number(s.invoiceNumber)
        : undefined,

      sealNumber: s.sealNumber
        ? Number(s.sealNumber)
        : undefined,

      loadTime: toLocalDateTimeString(s.loadTime),
      moldingTime: toLocalDateTimeString(s.moldingTime),

      slumpTest: s.slumpTest
        ? Number(s.slumpTest)
        : undefined,

      extraWaterAdded: s.extraWaterAdded
        ? Number(s.extraWaterAdded)
        : undefined,

      volume: s.volume
        ? Number(s.volume)
        : undefined,

      concreteArea: s.concreteArea || undefined,
    }));

    const samplesRes = await createSample(samplesPayload);

    setSaving(false);

    if (!samplesRes.success) return;

    setSavedId(createdCollectionId);
    setPhase("sucesso");
    setConfirmModal(null);
  }

  function resetAll() {
    setPhase("obra");
    setSelectedConstruction(null);
    setObraSearch("");
    setCollection(emptyCollection());
    setSamples([]);
    setSampleDraft(emptySample());
    setEditingSampleId(null);
    setSavedId(null);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Phase indicator
  // ─────────────────────────────────────────────────────────────────────────
  const phases: { key: Phase; label: string }[] = [
    { key: "obra", label: "Obra" },
    { key: "coleta", label: "Dados da Coleta" },
    { key: "amostras", label: "Amostras" },
    { key: "sucesso", label: "Concluído" },
  ];
  const phaseIndex = phases.findIndex((p) => p.key === phase);

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp .3s cubic-bezier(.22,1,.36,1) both; }
            `}</style>

      <div className="flex min-h-screen bg-[#F0F1F5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar activeKey="coleta" />

        <main className="flex-1 ml-[72px] px-6 py-8 overflow-y-auto">

          {/* Header */}
          <div className="mb-7 fade-up">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>Sistema</span><span>/</span>
              <span className="text-[#1A5FAD] font-semibold">Nova Coleta</span>
            </div>
            <h1 className="text-3xl font-black text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>
              Coleta de Corpos de Prova
            </h1>
            <p className="text-base text-gray-400 mt-1">Preencha os dados da coleta realizada em campo.</p>
          </div>

          {/* Progress bar */}
          {phase !== "sucesso" && (
            <div className="bg-white rounded-2xl max-w-6xl mx-auto border shadow-sm px-6 py-4 mb-6">
              <div className="flex items-center">
                {phases.filter(p => p.key !== "sucesso").map((p, i) => {
                  const done = i < phaseIndex;
                  const active = i === phaseIndex;

                  return (
                    <React.Fragment key={p.key}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${done ? "bg-emerald-500 text-white" :
                              active ? "bg-[#1A5FAD] text-white" :
                                "bg-gray-100 text-gray-400"}`}
                        >
                          {done ? "✓" : i + 1}
                        </div>

                        <span
                          className={`text-sm font-semibold
                ${active ? "text-[#1A5FAD]" :
                              done ? "text-emerald-600" :
                                "text-gray-400"}`}
                        >
                          {p.label}
                        </span>
                      </div>

                      {i < 2 && (
                        <div className={`flex-1 h-px mx-4 ${done ? "bg-emerald-300" : "bg-gray-200"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
          {/* ── PHASE: OBRA ── */}
          {phase === "obra" && (
            <div className="fade-up max-w-xl mx-auto">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-7 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1A5FAD]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#1A5FAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>Qual é a obra?</h2>
                      <p className="text-sm text-gray-400 mt-0.5">Selecione a obra desta coleta</p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6">
                  {/* Search */}
                  <div className="relative mb-4">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={obraSearch}
                      onChange={(e) => setObraSearch(e.target.value)}
                      placeholder="Buscar obra..."
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#1A5FAD]/20 focus:border-[#1A5FAD] transition"
                    />
                  </div>

                  {loadingConstructions ? (
                    <div className="flex justify-center py-8">
                      <svg className="w-6 h-6 animate-spin text-[#1A5FAD]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {filtered.length === 0 ? (
                        <p className="text-base text-gray-400 text-center py-6">Nenhuma obra encontrada.</p>
                      ) : filtered.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedConstruction(c)}
                          className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition
                                                        ${selectedConstruction?.id === c.id
                              ? "bg-[#1A5FAD] text-white"
                              : "bg-gray-50 hover:bg-[#1A5FAD]/10 text-gray-700"}`}
                        >
                          <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0
                                                        ${selectedConstruction?.id === c.id ? "bg-white/20" : "bg-[#1A5FAD]/10"}`}>
                            <svg className={`w-6 h-6 ${selectedConstruction?.id === c.id ? "text-white" : "text-[#1A5FAD]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-semibold truncate">{c.name}</p>
                            {c.locationDto && (
                              <p className={`text-sm truncate ${selectedConstruction?.id === c.id ? "text-white/70" : "text-gray-400"}`}>
                                {c.locationDto.city} — {c.locationDto.neighborhood}
                              </p>
                            )}
                            {c.quantityExpected && (
                              <p className={`text-xs mt-0.5 ${selectedConstruction?.id === c.id ? "text-white/60" : "text-gray-300"}`}>
                                {c.quantityExpected} amostras esperadas
                              </p>
                            )}
                          </div>
                          {selectedConstruction?.id === c.id && (
                            <svg className="w-5 h-5 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={handleConfirmObra}
                    disabled={!selectedConstruction}
                    className="w-full py-4 bg-[#1A5FAD] text-white rounded-xl text-base font-bold
                                                   disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#154e8f] transition
                                                   shadow-[0_4px_14px_rgba(26,95,173,0.25)] flex items-center justify-center gap-2"
                  >
                    {selectedConstruction ? `Continuar com "${selectedConstruction.name}"` : "Selecione uma obra para continuar"}
                    {selectedConstruction && <span>→</span>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── PHASE: COLETA ── */}
          {phase === "coleta" && (
            <div className="fade-up max-w-xl mx-auto">
              {/* Obra selecionada badge */}
              <div className="flex items-center gap-2 mb-4 px-1">
                <div className="flex items-center gap-2 bg-[#1A5FAD]/10 text-[#1A5FAD] px-4 py-2 rounded-full text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {selectedConstruction?.name}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-7 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>Dados da Coleta</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Preencha as informações do concreto</p>
                </div>

                <div className="px-8 py-6 space-y-6">
                  <FRow label="Data de Moldagem" required>
                    <input type="date" value={collection.moldingDate}
                      onChange={e => setCollection({ ...collection, moldingDate: e.target.value })}
                      className={iCls} />
                  </FRow>

                  <FRow label="FCK (MPa)" required>
                    <input type="number" step="0.1" placeholder="Ex: 25.0"
                      value={collection.fckStrength}
                      onChange={e => setCollection({ ...collection, fckStrength: e.target.value })}
                      className={iCls} />
                  </FRow>

                  <FRow label="Tipo de Concreto" required>
                    <select value={collection.concreteType}
                      onChange={e => setCollection({ ...collection, concreteType: e.target.value })}
                      className={iCls}>
                      <option value="">Selecione...</option>
                      <option value={ConcreteType.READY_MIX}>Usinado</option>
                      <option value={ConcreteType.SITE_MIX}>Feito na Obra</option>
                    </select>
                  </FRow>

                  {collection.concreteType === ConcreteType.READY_MIX && (
                    <FRow label="Fornecedor do Concreto">
                      <input type="text" placeholder="Ex: Concretex"
                        value={collection.concreteSupplier}
                        onChange={e => setCollection({ ...collection, concreteSupplier: e.target.value })}
                        className={iCls} />
                    </FRow>
                  )}

                  <FRow label="Método de Lançamento" required>
                    <select value={collection.castingMethod}
                      onChange={e => setCollection({ ...collection, castingMethod: e.target.value })}
                      className={iCls}>
                      <option value="">Selecione...</option>
                      <option value={CastingMethod.PUMPED}>Bombeado</option>
                      <option value={CastingMethod.CONVENTIONAL}>Convencional</option>
                    </select>
                  </FRow>

                  <FRow label="Volume Total (m³)">
                    <input type="number" step="0.01" placeholder="Ex: 12.5"
                      value={collection.totalVolume}
                      onChange={e => setCollection({ ...collection, totalVolume: e.target.value })}
                      className={iCls} />
                  </FRow>

                  {/* Aditivo toggle */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4">
                    <div>
                      <p className="text-base font-semibold text-gray-700">Possui Aditivo?</p>
                      <p className="text-sm text-gray-400 mt-0.5">Marque caso o concreto possua aditivo</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollection({ ...collection, hasAdditive: !collection.hasAdditive })}
                      className={`w-12 h-7 rounded-full flex items-center px-1 transition-all flex-shrink-0
                                                ${collection.hasAdditive ? "bg-[#1A5FAD] justify-end" : "bg-gray-300 justify-start"}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>

                  {collection.hasAdditive && (
                    <FRow label="Tipo de Aditivo">
                      <input type="text" placeholder="Ex: Plastificante"
                        value={collection.additiveType}
                        onChange={e => setCollection({ ...collection, additiveType: e.target.value })}
                        className={iCls} />
                    </FRow>
                  )}

                  <FRow label="Observações">
                    <textarea rows={3} placeholder="Observações gerais sobre a coleta..."
                      value={collection.notes}
                      onChange={e => setCollection({ ...collection, notes: e.target.value })}
                      className={`${iCls} resize-none`} />
                  </FRow>
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                  <button onClick={() => setPhase("obra")}
                    className="px-6 py-4 rounded-xl text-base font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition">
                    ← Voltar
                  </button>
                  <button onClick={handleConfirmColeta}
                    disabled={!collection.moldingDate || !collection.fckStrength || !collection.concreteType || !collection.castingMethod}
                    className="flex-1 py-4 bg-[#1A5FAD] text-white rounded-xl text-base font-bold
                                                   disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#154e8f] transition
                                                   shadow-[0_4px_14px_rgba(26,95,173,0.25)]">
                    Revisar dados →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── PHASE: AMOSTRAS ── */}
          {phase === "amostras" && (
            <div className="fade-up">
              {/* Header badges */}
              <div className="flex items-center gap-2 mb-4 px-1 flex-wrap">
                <div className="flex items-center gap-2 bg-[#1A5FAD]/10 text-[#1A5FAD] px-4 py-2 rounded-full text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {selectedConstruction?.name}
                </div>
                {selectedConstruction?.quantityExpected && (
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full text-sm font-semibold">
                    Meta: {selectedConstruction.quantityExpected} amostras
                    {samples.length > 0 && ` · ${samples.length} adicionada${samples.length > 1 ? "s" : ""}`}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">

                {/* Form de nova amostra */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {editingSampleId ? "✏️ Editando Amostra" : "Nova Amostra"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">Preencha os dados da amostra moldada</p>
                  </div>

                  <div className="px-6 py-5 space-y-5">
                    <FRow label="Número de Série" required>
                      <input type="text" placeholder="Ex: SN-001"
                        value={sampleDraft.serialNumber}
                        onChange={e => setSampleDraft({ ...sampleDraft, serialNumber: e.target.value })}
                        className={iCls} />
                    </FRow>
                    <FRow label="Nº de Cápsulas" required>
                      <input type="number" placeholder="Ex: 4"
                        value={sampleDraft.capsuleCount}
                        onChange={e => setSampleDraft({ ...sampleDraft, capsuleCount: e.target.value })}
                        className={iCls} />
                    </FRow>
                    <FRow label="Nº da Nota Fiscal">
                      <input type="text" placeholder="Ex: 12345"
                        value={sampleDraft.invoiceNumber}
                        onChange={e => setSampleDraft({ ...sampleDraft, invoiceNumber: e.target.value })}
                        className={iCls} />
                    </FRow>
                    <FRow label="Nº do Lacre">
                      <input type="text" placeholder="Ex: L-00099"
                        value={sampleDraft.sealNumber}
                        onChange={e => setSampleDraft({ ...sampleDraft, sealNumber: e.target.value })}
                        className={iCls} />
                    </FRow>
                    <FRow label="Hora da Carga" required>
                      <input type="time"
                        value={sampleDraft.loadTime}
                        onChange={e => setSampleDraft({ ...sampleDraft, loadTime: e.target.value })}
                        className={iCls} />
                    </FRow>
                    <FRow label="Hora da Moldagem" required>
                      <input type="time"
                        value={sampleDraft.moldingTime}
                        onChange={e => setSampleDraft({ ...sampleDraft, moldingTime: e.target.value })}
                        className={iCls} />
                    </FRow>
                    <FRow label="Slump Teste (cm)">
                      <input type="number" step="0.5" placeholder="Ex: 10"
                        value={sampleDraft.slumpTest}
                        onChange={e => setSampleDraft({ ...sampleDraft, slumpTest: e.target.value })}
                        className={iCls} />
                    </FRow>
                    <FRow label="Água Adicionada (L)">
                      <input type="number" step="0.1" placeholder="Ex: 0"
                        value={sampleDraft.extraWaterAdded}
                        onChange={e => setSampleDraft({ ...sampleDraft, extraWaterAdded: e.target.value })}
                        className={iCls} />
                    </FRow>
                    <FRow label="Volume (m³)">
                      <input type="number" step="0.01" placeholder="Ex: 0.5"
                        value={sampleDraft.volume}
                        onChange={e => setSampleDraft({ ...sampleDraft, volume: e.target.value })}
                        className={iCls} />
                    </FRow>
                    <FRow label="Área Concretada (Opcional)">
                      <input type="text" placeholder="Ex: Laje do 2º andar"
                        value={sampleDraft.concreteArea}
                        onChange={e => setSampleDraft({ ...sampleDraft, concreteArea: e.target.value })}
                        className={iCls} />
                    </FRow>
                  </div>

                  <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex gap-2">
                    {editingSampleId && (
                      <button onClick={() => { setEditingSampleId(null); setSampleDraft(emptySample()); }}
                        className="px-5 py-3.5 rounded-xl text-base font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition">
                        Cancelar
                      </button>
                    )}
                    <button
                      onClick={handleAddOrUpdateSample}
                      disabled={!sampleDraft.serialNumber || !sampleDraft.capsuleCount || !sampleDraft.loadTime || !sampleDraft.moldingTime}
                      className="flex-1 py-3.5 bg-[#1A5FAD] text-white rounded-xl text-base font-bold
                                                       disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#154e8f] transition
                                                       flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      {editingSampleId ? "Salvar Edição" : "Adicionar Amostra"}
                    </button>
                  </div>
                </div>

                {/* Lista de amostras */}
                <div className="flex flex-col gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Amostras Registradas
                      </h2>
                      <span className={`text-sm font-bold px-3 py-1.5 rounded-full
                                                ${samples.length === 0 ? "bg-gray-100 text-gray-400" : "bg-[#1A5FAD]/10 text-[#1A5FAD]"}`}>
                        {samples.length}
                      </span>
                    </div>

                    {samples.length === 0 ? (
                      <div className="flex flex-col items-center py-12 text-gray-300">
                        <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                        </svg>
                        <p className="text-base">Nenhuma amostra ainda</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                        {samples.map((s, i) => (
                          <div key={s._id}
                            className={`rounded-xl border px-5 py-4 transition
                                                            ${editingSampleId === s._id
                                ? "border-[#1A5FAD] bg-[#1A5FAD]/5"
                                : "border-gray-100 bg-gray-50"}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-base font-bold text-gray-800">
                                  #{i + 1} — {s.serialNumber}
                                </p>
                                <p className="text-sm text-gray-400 mt-0.5">
                                  {s.capsuleCount} cápsula{Number(s.capsuleCount) !== 1 ? "s" : ""}
                                  {s.concreteArea && ` · ${s.concreteArea}`}
                                </p>
                                <p className="text-sm text-gray-400">
                                  Carga: {s.loadTime} · Moldagem: {s.moldingTime}
                                  {s.slumpTest && ` · Slump: ${s.slumpTest}cm`}
                                </p>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => handleEditSample(s)}
                                  className="w-8 h-8 rounded-lg bg-[#1A5FAD]/10 hover:bg-[#1A5FAD]/20 flex items-center justify-center transition">
                                  <svg className="w-4 h-4 text-[#1A5FAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button onClick={() => handleRemoveSample(s._id)}
                                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition">
                                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setPhase("coleta")}
                      className="px-6 py-4 rounded-xl text-base font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition">
                      ← Voltar
                    </button>
                    <button
                      onClick={() => samples.length > 0 && setConfirmModal("amostras")}
                      disabled={samples.length === 0}
                      className="flex-1 py-4 bg-[#1A5FAD] text-white rounded-xl text-base font-bold
                                                       disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#154e8f] transition
                                                       shadow-[0_4px_14px_rgba(26,95,173,0.25)]">
                      Revisar e Finalizar →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PHASE: SUCESSO ── */}
          {phase === "sucesso" && (
            <div className="fade-up max-w-lg mx-auto">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-gray-800 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Coleta registrada!
                </h2>
                <p className="text-sm text-gray-400 max-w-xs">
                  A coleta foi salva com sucesso e está aguardando análise laboratorial.
                </p>
                {savedId && (
                  <p className="text-xs text-gray-300 mt-1">ID: #{savedId}</p>
                )}
                <div className="flex gap-3 mt-8">
                  <button onClick={resetAll}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                    Nova Coleta
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MODAL: Confirmar Obra ── */}
      {confirmModal === "obra" && selectedConstruction && ReactDOM.createPortal(
        <ConfirmModal
          title="Confirmar Obra"
          subtitle="Os dados estão corretos?"
          onCancel={() => setConfirmModal(null)}
          onConfirm={() => { setConfirmModal(null); setPhase("coleta"); }}
        >
          <InfoRow label="Obra" value={selectedConstruction.name} />
          {selectedConstruction.locationDto && (
            <InfoRow label="Localização"
              value={`${selectedConstruction.locationDto.city} — ${selectedConstruction.locationDto.neighborhood}`} />
          )}
          {selectedConstruction.quantityExpected && (
            <InfoRow label="Amostras Esperadas" value={String(selectedConstruction.quantityExpected)} />
          )}
        </ConfirmModal>,
        document.body
      )}

      {/* ── MODAL: Confirmar Coleta ── */}
      {confirmModal === "coleta" && ReactDOM.createPortal(
        <ConfirmModal
          title="Confirmar Dados da Coleta"
          subtitle="Verifique as informações antes de continuar"
          onCancel={() => setConfirmModal(null)}
          onConfirm={() => { setConfirmModal(null); setPhase("amostras"); }}
        >
          <InfoRow label="Data de Moldagem" value={collection.moldingDate} />
          <InfoRow label="FCK" value={`${collection.fckStrength} MPa`} />
          <InfoRow label="Tipo de Concreto" value={collection.concreteType === ConcreteType.READY_MIX ? "Usinado" : "Feito na Obra"} />
          {collection.concreteSupplier && <InfoRow label="Fornecedor" value={collection.concreteSupplier} />}
          <InfoRow label="Método de Lançamento" value={collection.castingMethod === CastingMethod.PUMPED ? "Bombeado" : "Convencional"} />
          {collection.totalVolume && <InfoRow label="Volume Total" value={`${collection.totalVolume} m³`} />}
          <InfoRow label="Possui Aditivo" value={collection.hasAdditive ? `Sim — ${collection.additiveType}` : "Não"} />
          {collection.notes && <InfoRow label="Observações" value={collection.notes} />}
        </ConfirmModal>,
        document.body
      )}

      {/* ── MODAL: Confirmar Amostras + Salvar ── */}
      {confirmModal === "amostras" && ReactDOM.createPortal(
        <ConfirmModal
          title="Confirmar e Salvar"
          subtitle={`${samples.length} amostra${samples.length > 1 ? "s" : ""} registrada${samples.length > 1 ? "s" : ""}. Está tudo certo?`}
          onCancel={() => setConfirmModal(null)}
          onConfirm={handleSave}
          confirmLabel={saving ? "Salvando..." : "Salvar Coleta"}
          confirmDisabled={saving}
        >
          {samples.map((s, i) => (
            <div key={s._id} className="bg-gray-50 rounded-xl px-4 py-3 mb-2">
              <p className="text-xs font-bold text-gray-700">#{i + 1} — {s.serialNumber}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {s.capsuleCount} cápsulas · Carga: {s.loadTime} · Moldagem: {s.moldingTime}
                {s.concreteArea && ` · ${s.concreteArea}`}
              </p>
            </div>
          ))}
        </ConfirmModal>,
        document.body
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────────────

const iCls =
  "w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base " +
  "focus:outline-none focus:ring-2 focus:ring-[#1A5FAD]/20 focus:border-[#1A5FAD] " +
  "placeholder:text-gray-300 transition";

const FRow: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div>
    <label className="block text-base font-semibold text-gray-600 mb-2">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-400 font-medium">{label}</span>
    <span className="text-sm text-gray-800 font-semibold text-right max-w-[60%]">{value}</span>
  </div>
);

interface ConfirmModalProps {
  title: string;
  subtitle: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  children?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title, subtitle, onCancel, onConfirm,
  confirmLabel = "Confirmar e Continuar",
  confirmDisabled = false,
  children
}) => (
  <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <div
      className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
      style={{ animation: "fadeUp .25s cubic-bezier(.22,1,.36,1) both" }}
    >
      <button onClick={onCancel}
        className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#1A5FAD]/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-[#1A5FAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>{title}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="mb-6 max-h-72 overflow-y-auto">{children}</div>

      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-3.5 rounded-xl text-base font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
          Corrigir
        </button>
        <button
          onClick={onConfirm}
          disabled={confirmDisabled}
          className="flex-1 py-3.5 rounded-xl text-base font-bold text-white bg-[#1A5FAD]
                               hover:bg-[#154e8f] disabled:opacity-60 transition
                               shadow-[0_4px_14px_rgba(26,95,173,0.2)] flex items-center justify-center gap-2"
        >
          {confirmDisabled && (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ColetaTemplate;