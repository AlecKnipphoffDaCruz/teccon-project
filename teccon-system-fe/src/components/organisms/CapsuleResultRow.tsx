import React from 'react';
import InputField from '../atoms/InputField';
import SelectField from '../atoms/SelectField';
import Badge from '../atoms/Badge';

export interface CapsuleResult {
  id: string;
  amostraId: string;
  serie: string;
  idadeDias: number;
  cargaKgF: string;
  resistenciaMPa: string;
  tipoPrensa: string;
  dataTeste: string;
  status: 'pendente' | 'preenchido';
}

interface CapsuleResultRowProps {
  result: CapsuleResult;
  fck: number;
  onChange: (updated: CapsuleResult) => void;
}

const CapsuleResultRow: React.FC<CapsuleResultRowProps> = ({ result, fck, onChange }) => {
  const set = (field: keyof CapsuleResult) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const updated = { ...result, [field]: e.target.value };
      // auto-mark as filled if main fields present
      updated.status = updated.cargaKgF && updated.resistenciaMPa ? 'preenchido' : 'pendente';
      onChange(updated);
    };

  const mpa = parseFloat(result.resistenciaMPa);
  const conformity = !isNaN(mpa) && fck > 0
    ? mpa >= fck ? 'Conforme' : 'Não Conforme'
    : null;

  return (
    <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_auto] items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white">
      {/* Série + Dias */}
      <div className="flex flex-col items-center gap-0.5 min-w-[60px]">
        <span className="text-xs font-bold text-[#1A5FAD]">{result.idadeDias}d</span>
        <span className="text-[10px] text-gray-400 font-medium">Série {result.serie}</span>
      </div>

      {/* Carga */}
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Carga (kgf)</p>
        <InputField type="number" placeholder="Ex: 30000" value={result.cargaKgF} onChange={set('cargaKgF')} />
      </div>

      {/* Resistência */}
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Resist. (MPa)</p>
        <InputField type="number" step="0.01" placeholder="Ex: 28.5" value={result.resistenciaMPa} onChange={set('resistenciaMPa')} />
      </div>

      {/* Prensa */}
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Prensa</p>
        <SelectField
          value={result.tipoPrensa}
          onChange={set('tipoPrensa')}
          placeholder="Tipo..."
          options={[
            { label: 'Elétrica', value: 'ELETRICA' },
            { label: 'Manual', value: 'MANUAL' },
          ]}
        />
      </div>

      {/* Data do teste */}
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Data do Teste</p>
        <InputField type="date" value={result.dataTeste} onChange={set('dataTeste')} />
      </div>

      {/* Conformidade */}
      <div className="flex items-center justify-center min-w-[100px]">
        {conformity ? (
          <Badge
            label={conformity}
            variant={conformity === 'Conforme' ? 'green' : 'red'}
          />
        ) : (
          <Badge label="Aguardando" variant="gray" />
        )}
      </div>

      {/* Status dot */}
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${result.status === 'preenchido' ? 'bg-emerald-400' : 'bg-gray-200'}`} />
    </div>
  );
};

export default CapsuleResultRow;