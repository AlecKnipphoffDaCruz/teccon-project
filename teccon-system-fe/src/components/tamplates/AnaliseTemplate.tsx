import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';
import CapsuleResultRow from '../organisms/CapsuleResultRow';
import type { CapsuleResult } from '../organisms/CapsuleResultRow';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import { getCollectionById } from '../../service/api/CollectionService';
import { getSamplesByCollection } from '../../service/api/SampleService';
import type { Collection } from '../../interfaces/Collection';
import type { Sample } from '../../interfaces/Sample';
import { CollectionStatus } from '../../interfaces/enums/CollectionStatus';

const statusLabel: Record<string, string> = {
    [CollectionStatus.IN_ANALYSIS]: 'Em Análise',
    [CollectionStatus.APPROVED]:    'Aprovado',
    [CollectionStatus.REJECTED]:    'Reprovado',
    [CollectionStatus.FINISHED]:    'Finalizado',
    [CollectionStatus.DRAFT]:       'Rascunho',
};

const AnaliseTemplate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [coleta, setColeta]     = useState<Collection | null>(null);
    const [samples, setSamples]   = useState<Sample[]>([]);   // ← estado separado para amostras
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [results, setResults]   = useState<CapsuleResult[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted]   = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Buscar coleta
                const collectionResp = await getCollectionById(id);
                if (!collectionResp.success || !collectionResp.data) {
                    setError(collectionResp.message ?? 'Erro ao carregar coleta.');
                    return;
                }
                setColeta(collectionResp.data);

                // 2. Buscar amostras separadamente e salvar em estado
                const samplesResp = await getSamplesByCollection(collectionResp.data.id);
                if (!samplesResp.success || !samplesResp.data) {
                    setError(samplesResp.message ?? 'Erro ao carregar amostras.');
                    return;
                }
                setSamples(samplesResp.data);   // ← salva em estado

                // 3. Montar results das cápsulas existentes
                const initialResults: CapsuleResult[] = samplesResp.data.flatMap(sample =>
                    (sample.capsulesResults ?? []).map(cr => ({
                        id: String(cr.id),
                        amostraId: String(sample.id),
                        serie: sample.serialNumber,
                        idadeDias: cr.curingAgeDays,
                        cargaKgF: cr.failureLoadKgf != null ? String(cr.failureLoadKgf) : '',
                        resistenciaMPa: cr.compressiveStrengthMpa != null ? String(cr.compressiveStrengthMpa) : '',
                        tipoPrensa: cr.pressType ?? '',
                        dataTeste: cr.testedAt ? new Date(cr.testedAt).toISOString().split('T')[0] : '',
                        status: cr.failureLoadKgf != null ? 'preenchido' : 'pendente',
                    }))
                );
                setResults(initialResults);

            } catch (err: any) {
                setError(err.message ?? 'Erro inesperado.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const updateResult = (resultId: string, updated: CapsuleResult) =>
        setResults(prev => prev.map(r => r.id === resultId ? updated : r));

    const filled   = results.filter(r => r.status === 'preenchido').length;
    const total    = results.length;
    const progress = total > 0 ? Math.round((filled / total) * 100) : 0;

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    if (loading) return (
        <div className="flex min-h-screen bg-[#F0F1F5]">
            <Sidebar activeKey="analise" />
            <main className="flex-1 ml-[72px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#1A5FAD] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-400">Carregando coleta...</p>
                </div>
            </main>
        </div>
    );

    if (error || !coleta) return (
        <div className="flex min-h-screen bg-[#F0F1F5]">
            <Sidebar activeKey="analise" />
            <main className="flex-1 ml-[72px] flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center max-w-sm">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2 className="text-base font-black text-gray-800 mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>Erro ao carregar</h2>
                    <p className="text-sm text-gray-400">{error ?? 'Coleta não encontrada.'}</p>
                    <button onClick={() => navigate('/analise')}
                        className="mt-6 px-6 py-2.5 bg-[#1A5FAD] text-white rounded-xl text-sm font-semibold hover:bg-[#124080] transition-colors">
                        ← Voltar às Análises
                    </button>
                </div>
            </main>
        </div>
    );

    if (submitted) return (
        <div className="flex min-h-screen bg-[#F0F1F5]">
            <Sidebar activeKey="analise" />
            <main className="flex-1 ml-[72px] flex items-center justify-center px-8 py-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 flex flex-col items-center text-center max-w-md">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black text-gray-800 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Análise enviada!</h2>
                    <p className="text-sm text-gray-400">Os resultados foram registrados e encaminhados para aprovação do <strong>Engenheiro</strong>.</p>
                    <div className="mt-8 flex flex-col gap-2 w-full">
                        <button onClick={() => navigate('/analise')}
                            className="px-6 py-3 bg-[#1A5FAD] text-white rounded-xl text-sm font-semibold hover:bg-[#124080] transition-colors">
                            ← Voltar às Análises
                        </button>
                        <button onClick={() => navigate('/coleta')}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                            Nova Coleta
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );

    // ← byAmostra agora usa o estado `samples`, não coleta.listSamples
    const byAmostra = samples.map(sample => ({
        ...sample,
        results: results.filter(r => r.amostraId === String(sample.id)),
    }));

    return (
        <div className="flex min-h-screen bg-[#F0F1F5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Sidebar activeKey="analise" />
            <main className="flex-1 ml-[72px] px-6 py-8 overflow-y-auto">

                {/* Header */}
                <div className="mb-7">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span>Sistema</span><span>/</span>
                        <button onClick={() => navigate('/analise')} className="hover:text-[#1A5FAD] transition font-medium">Análises</button>
                        <span>/</span>
                        <span className="text-[#1A5FAD] font-semibold">#{id}</span>
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                                Análise de Corpos de Prova
                            </h1>
                            <p className="text-base text-gray-400 mt-1">Insira os resultados dos ensaios de resistência das cápsulas.</p>
                        </div>
                        <Badge label={statusLabel[coleta.status] ?? coleta.status} variant="blue" />
                    </div>
                </div>

                {/* Meta card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-5 grid grid-cols-4 gap-4">
                    {[
                        { label: 'Protocolo', value: `#${coleta.id}` },
                        { label: 'Obra',      value: coleta.constructionName ?? '—' },
                        { label: 'Cliente',   value: `#${coleta.clientId}` },
                        { label: 'FCK',       value: `${coleta.fckStrength} MPa` },
                    ].map(item => (
                        <div key={item.label}>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-base font-semibold text-gray-800 mt-0.5">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Progresso geral */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Progresso Geral</p>
                        <span className="text-sm font-bold text-[#1A5FAD]">{filled}/{total} cápsulas preenchidas</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1A5FAD] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Idades de cura */}
                {coleta.curingAgesExpected && coleta.curingAgesExpected.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Idades de Cura</p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            {[...coleta.curingAgesExpected].sort((a, b) => a - b).map(days => {
                                const moldingDate = coleta.moldingDate ? new Date(coleta.moldingDate) : null;
                                const testDate = moldingDate
                                    ? new Date(moldingDate.getTime() + days * 24 * 60 * 60 * 1000)
                                    : null;
                                const today = new Date();
                                const isPast = testDate ? testDate <= today : false;
                                const isDue = testDate
                                    ? !isPast && Math.abs(testDate.getTime() - today.getTime()) < 3 * 24 * 60 * 60 * 1000
                                    : false;

                                return (
                                    <div key={days} className={`flex flex-col items-center px-5 py-3 rounded-xl border min-w-[80px]
                                        ${isPast
                                            ? 'bg-emerald-50 border-emerald-100'
                                            : isDue
                                                ? 'bg-red-50 border-red-100'
                                                : 'bg-gray-50 border-gray-100'
                                        }`}>
                                        <span className={`text-lg font-black
                                            ${isPast ? 'text-emerald-700' : isDue ? 'text-red-600' : 'text-gray-700'}`}>
                                            {days}d
                                        </span>
                                        {testDate && (
                                            <span className={`text-xs font-medium mt-0.5
                                                ${isPast ? 'text-emerald-500' : isDue ? 'text-red-400' : 'text-gray-400'}`}>
                                                {testDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                            </span>
                                        )}
                                        <span className={`text-[10px] font-semibold mt-1
                                            ${isPast ? 'text-emerald-400' : isDue ? 'text-red-300' : 'text-gray-300'}`}>
                                            {isPast ? 'Vencido' : isDue ? 'Urgente' : 'Aguardando'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Amostras sem cápsulas ainda */}
                {samples.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-16 text-gray-300">
                        <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                        </svg>
                        <p className="text-base font-semibold text-gray-400">Nenhuma amostra registrada</p>
                        <p className="text-sm text-gray-300 mt-1">As amostras devem ser registradas na etapa de coleta.</p>
                    </div>
                )}

                {/* Cards por amostra */}
                <div className="flex flex-col gap-5">
                    {byAmostra.map(sample => {
                        const pendentes    = sample.results.filter(r => r.status === 'pendente').length;
                        const preenchidos  = sample.results.filter(r => r.status === 'preenchido').length;

                        return (
                            <div key={sample.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Header da amostra */}
                                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#1A5FAD]/10 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-[#1A5FAD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                                                Amostra {sample.serialNumber}
                                                {sample.concreteArea && <span className="text-gray-400 font-normal"> — {sample.concreteArea}</span>}
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-0.5">
                                                {sample.capsuleCount} cápsula{sample.capsuleCount !== 1 ? 's' : ''}
                                                {sample.slumpTest != null && ` · Slump: ${sample.slumpTest} cm`}
                                                {sample.loadTime && ` · Carga: ${new Date(sample.loadTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {preenchidos > 0 && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                {preenchidos} preenchida{preenchidos !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                        {pendentes > 0 && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                {pendentes} pendente{pendentes !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Cápsulas */}
                                <div className="px-6 py-4">
                                    {sample.results.length === 0 ? (
                                        <div className="flex flex-col gap-2">
                                            {[...(coleta.curingAgesExpected ?? [])].sort((a, b) => a - b).map(days => {
                                                const moldingDate = coleta.moldingDate ? new Date(coleta.moldingDate) : null;
                                                const testDate = moldingDate
                                                    ? new Date(moldingDate.getTime() + days * 24 * 60 * 60 * 1000)
                                                    : null;
                                                const today = new Date();
                                                const daysLeft = testDate
                                                    ? Math.ceil((testDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
                                                    : null;
                                                const isReady = daysLeft !== null && daysLeft <= 0;

                                                return (
                                                    <div key={days} className={`flex items-center justify-between px-4 py-3 rounded-xl border
                                                        ${isReady ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-dashed border-gray-200'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                                                ${isReady ? 'bg-[#1A5FAD]/10' : 'bg-gray-100'}`}>
                                                                <svg className={`w-4 h-4 ${isReady ? 'text-[#1A5FAD]' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-bold ${isReady ? 'text-gray-700' : 'text-gray-400'}`}>
                                                                    Cápsula {days} dias
                                                                </p>
                                                                <p className="text-xs text-gray-400">
                                                                    {testDate?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full
                                                            ${isReady
                                                                ? 'bg-[#1A5FAD]/10 text-[#1A5FAD]'
                                                                : 'bg-gray-100 text-gray-400'
                                                            }`}>
                                                            {isReady
                                                                ? 'Pronta para ensaio'
                                                                : daysLeft === 1
                                                                    ? 'Falta 1 dia'
                                                                    : `Faltam ${daysLeft} dias`}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {sample.results.map(r => (
                                                <CapsuleResultRow
                                                    key={r.id}
                                                    result={r}
                                                    fck={coleta.fckStrength}
                                                    onChange={updated => updateResult(r.id, updated)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-6 pb-4">
                    <button onClick={() => navigate('/analise')}
                        className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition">
                        ← Voltar
                    </button>
                    <Button className="!w-auto px-10" loading={submitting} disabled={filled === 0} onClick={handleSubmit}>
                        Enviar para Aprovação
                    </Button>
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
            `}</style>
        </div>
    );
};

export default AnaliseTemplate;