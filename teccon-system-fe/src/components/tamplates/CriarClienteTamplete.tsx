import React, { useState } from "react";
import Sidebar from "../organisms/Sidebar";
import CriarClienteOrganism from "../organisms/CriarClienteOrganism";
import GerenciarClientesOrganism from "../organisms/GerenciarClientesOrganism";

type Tab = "criar" | "gerenciar";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
        key: "criar",
        label: "Criar Cliente",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        ),
    },
    {
        key: "gerenciar",
        label: "Gerenciar Clientes",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        ),
    },
];

const ClientesTemplate: React.FC = () => {
    const [tab, setTab] = useState<Tab>("criar");

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
                <Sidebar activeKey="clientes" />

                <main className="flex-1 ml-[72px] px-6 py-8 overflow-y-auto">

                    {/* ── Cabeçalho ── */}
                    <div className="mb-7 fade-up">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <span>Sistema</span><span>/</span>
                            <span className="text-[#1A5FAD] font-semibold">Clientes</span>
                        </div>
                                <h1 className="text-3xl font-black text-gray-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Gerenciamento de Clientes
                        </h1>
                        <p className="text-base text-gray-400 mt-1">Preencha os dados da coleta realizada em campo.</p>

                    </div>

                    {/* ── Abas + Conteúdo centralizados ── */}
                    <div className="flex flex-col items-center">

                        <div className="flex gap-2 mb-6 w-full max-w-2xl">
                            {TABS.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                                        ${tab === t.key
                                            ? "bg-[#1A5FAD] text-white shadow-[0_4px_14px_rgba(26,95,173,0.25)]"
                                            : "bg-white text-gray-500 border border-gray-200 hover:border-[#1A5FAD]/40 hover:text-[#1A5FAD]"
                                        }`}
                                >
                                    {t.icon}
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div key={tab} className="fade-up w-full flex justify-center">
                            {tab === "criar" && <CriarClienteOrganism onSuccess={() => setTab("gerenciar")} />}
                            {tab === "gerenciar" && <GerenciarClientesOrganism />}
                        </div>

                    </div>

                </main>
            </div>
        </>
    );
};

export default ClientesTemplate;