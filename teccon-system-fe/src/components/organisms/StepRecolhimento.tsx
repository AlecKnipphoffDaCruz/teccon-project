import React from 'react';
import SectionCard from '../molecules/SectionCard';
import PrintSheet from '../molecules/PrintSheet';
import Button from '../atoms/Button';
import type { ColetaFormData } from './StepMoldagem';

interface StepRecolhimentoProps {
  data: ColetaFormData;
  coletaId: string;
  diasEsperados: number[];
  onConfirm: () => void;
  onBack: () => void;
}

const StepRecolhimento: React.FC<StepRecolhimentoProps> = ({
  data, coletaId, diasEsperados, onConfirm, onBack,
}) => {
  const handlePrint = () => {
    const printContent = document.getElementById('print-sheet');
    if (!printContent) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>TECCON — Protocolo #${coletaId}</title>
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
          <style>
            body { margin: 0; padding: 24px; font-family: 'DM Sans', sans-serif; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Confirmation card */}
      <SectionCard
        title="Recolhimento das Cápsulas"
        subtitle="Confirme que os corpos de prova foram recolhidos da obra"
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Obra', value: data.obra || '—' },
            { label: 'Cliente', value: data.cliente || '—' },
            { label: 'Amostras', value: String(data.amostras.length) },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Checklist de cápsulas por amostra */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Confirmação de Recolhimento
          </p>
          {data.amostras.map((a, i) => (
            <div
              key={a.id}
              className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Amostra {i + 1} {a.numeroSerie && `— Série ${a.numeroSerie}`}
                  </p>
                  <p className="text-xs text-gray-400">{a.numeroCapsulas || '?'} cápsulas</p>
                </div>
              </div>
            </div>
          ))}
          {data.amostras.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Nenhuma amostra registrada.</p>
          )}
        </div>
      </SectionCard>

      {/* Print Sheet Preview */}
      <SectionCard
        title="Folha de Campo"
        subtitle="Imprima para levar à obra — o QR code leva direto para a análise"
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
        }
      >
        <PrintSheet
          coleta={{
            obra: data.obra,
            cliente: data.cliente,
            local: data.local,
            dataMoldagem: data.dataMoldagem,
            fck: data.fck,
            diasEsperados,
            amostras: data.amostras,
          }}
          coletaId={coletaId}
        />

        <button
          type="button"
          onClick={handlePrint}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#1A5FAD] hover:underline"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Imprimir folha de campo
        </button>
      </SectionCard>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" className="!w-auto px-6" onClick={onBack}>
          ← Voltar
        </Button>
        <Button className="!w-auto px-8" onClick={onConfirm}>
          Recolhimento Confirmado ✓
        </Button>
      </div>
    </div>
  );
};

export default StepRecolhimento;