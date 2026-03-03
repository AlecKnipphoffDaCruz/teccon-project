import React, { useState } from 'react';
import InputField from '../atoms/InputField';
import FormRow from './FormRow';

export interface AmostraData {
  id: string;
  numeroSerie: string;
  numeroCapsulas: string;
  numeroNotaFiscal: string;
  numeroLacre: string;
  horaCarga: string;
  horaMoldagem: string;
  slumpTeste: string;
  aguaAdicionada: string;
  volume: string;
  areaConcretada: string;
}

interface AmostraAccordionProps {
  index: number;
  data: AmostraData;
  onChange: (data: AmostraData) => void;
  onRemove: () => void;
}

const AmostraAccordion: React.FC<AmostraAccordionProps> = ({ index, data, onChange, onRemove }) => {
  const [open, setOpen] = useState(index === 0);

  const set = (field: keyof AmostraData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [field]: e.target.value });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#1A5FAD]/10 flex items-center justify-center">
            <span className="text-xs font-bold text-[#1A5FAD]">{index + 1}</span>
          </div>
          <span className="text-sm font-semibold text-gray-700">
            Amostra {index + 1}
            {data.numeroSerie && (
              <span className="ml-2 text-gray-400 font-normal">— Série {data.numeroSerie}</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-gray-300 hover:text-red-400 transition-colors p-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </button>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 py-5 grid gap-4">
          <FormRow fields={[
            { id: `serie-${data.id}`, label: 'Nº de Série', children: <InputField type="text" placeholder="Ex: 001" value={data.numeroSerie} onChange={set('numeroSerie')} /> },
            { id: `capsulas-${data.id}`, label: 'Qtd. Cápsulas', children: <InputField type="number" placeholder="Ex: 3" value={data.numeroCapsulas} onChange={set('numeroCapsulas')} /> },
          ]} />
          <FormRow fields={[
            { id: `nf-${data.id}`, label: 'Nº Nota Fiscal', children: <InputField type="text" placeholder="Ex: 123456" value={data.numeroNotaFiscal} onChange={set('numeroNotaFiscal')} /> },
            { id: `lacre-${data.id}`, label: 'Nº Lacre', children: <InputField type="text" placeholder="Ex: 789" value={data.numeroLacre} onChange={set('numeroLacre')} /> },
          ]} />
          <FormRow fields={[
            { id: `hcarga-${data.id}`, label: 'Hora da Carga', children: <InputField type="time" value={data.horaCarga} onChange={set('horaCarga')} /> },
            { id: `hmoldagem-${data.id}`, label: 'Hora da Moldagem', children: <InputField type="time" value={data.horaMoldagem} onChange={set('horaMoldagem')} /> },
          ]} />
          <FormRow fields={[
            { id: `slump-${data.id}`, label: 'Slump-test (cm)', children: <InputField type="number" step="0.1" placeholder="Ex: 8.0" value={data.slumpTeste} onChange={set('slumpTeste')} /> },
            { id: `agua-${data.id}`, label: 'Água Adicional (L)', children: <InputField type="number" step="0.1" placeholder="Ex: 0.0" value={data.aguaAdicionada} onChange={set('aguaAdicionada')} /> },
          ]} />
          <FormRow fields={[
            { id: `volume-${data.id}`, label: 'Volume (m³)', children: <InputField type="number" step="0.01" placeholder="Ex: 0.5" value={data.volume} onChange={set('volume')} /> },
            { id: `area-${data.id}`, label: 'Área Concretada (opcional)', children: <InputField type="text" placeholder="Ex: Pilar P1" value={data.areaConcretada} onChange={set('areaConcretada')} /> },
          ]} />
        </div>
      )}
    </div>
  );
};

export default AmostraAccordion;