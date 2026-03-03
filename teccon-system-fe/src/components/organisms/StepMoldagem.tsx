import React from 'react';
import SectionCard from '../molecules/SectionCard';
import FormRow from '../molecules/FormRow';
import AmostraAccordion from '../molecules/AmostraAccordion';
import type { AmostraData } from '../molecules/AmostraAccordion';
import InputField from '../atoms/InputField';
import SelectField from '../atoms/SelectField';
import TextareaField from '../atoms/TextareaField';
import ToggleSwitch from '../atoms/ToggleSwitch';
import Label from '../atoms/Label';
import Button from '../atoms/Button';

export interface ColetaFormData {
    obra: string;
    cliente: string;
    local: string;
    dataMoldagem: string;
    fck: string;
    tipoConcreto: string;
    fornecedorConcreto: string;
    possuiAditivo: boolean;
    tipoAditivo: string;
    metodoLancamento: string;
    volumeTotal: string;
    observacoes: string;
    amostras: AmostraData[];
}

interface StepMoldagemProps {
    data: ColetaFormData;
    onChange: (data: ColetaFormData) => void;
    onNext: () => void;
}

const newAmostra = (id: string): AmostraData => ({
    id, numeroSerie: '', numeroCapsulas: '', numeroNotaFiscal: '',
    numeroLacre: '', horaCarga: '', horaMoldagem: '', slumpTeste: '',
    aguaAdicionada: '', volume: '', areaConcretada: '',
});

const ConcreteIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const SampleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
    </svg>
);

const StepMoldagem: React.FC<StepMoldagemProps> = ({ data, onChange, onNext }) => {
    const set = (field: keyof ColetaFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => onChange({ ...data, [field]: e.target.value });

    const addAmostra = () => {
        const id = Date.now().toString();
        onChange({ ...data, amostras: [...data.amostras, newAmostra(id)] });
    };

    const updateAmostra = (index: number, updated: AmostraData) => {
        const amostras = [...data.amostras];
        amostras[index] = updated;
        onChange({ ...data, amostras });
    };

    const removeAmostra = (index: number) => {
        onChange({ ...data, amostras: data.amostras.filter((_, i) => i !== index) });
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Dados da Coleta */}
            <SectionCard title="Dados da Coleta" subtitle="Informações gerais da obra e do concreto" icon={<ConcreteIcon />}>
                <div className="grid gap-4">
                    <FormRow fields={[
                        { id: 'obra', label: 'Nome da Obra', children: <InputField id="obra" type="text" placeholder="Ex: Residencial Aurora" value={data.obra} onChange={set('obra')} /> },
                        { id: 'cliente', label: 'Cliente', children: <InputField id="cliente" type="text" placeholder="Ex: Construtora ABC" value={data.cliente} onChange={set('cliente')} /> },
                    ]} />
                    <FormRow fields={[
                        { id: 'local', label: 'Local / Endereço', children: <InputField id="local" type="text" placeholder="Ex: Rua das Flores, 100 — Porto Alegre" value={data.local} onChange={set('local')} /> },
                        { id: 'dataMoldagem', label: 'Data de Moldagem', children: <InputField id="dataMoldagem" type="date" value={data.dataMoldagem} onChange={set('dataMoldagem')} /> },
                    ]} />
                    <FormRow fields={[
                        { id: 'fck', label: 'FCK (MPa)', children: <InputField id="fck" type="number" step="0.1" placeholder="Ex: 25.0" value={data.fck} onChange={set('fck')} /> },
                        {
                            id: 'tipoConcreto', label: 'Tipo de Concreto', children: (
                                <SelectField
                                    id="tipoConcreto"
                                    value={data.tipoConcreto}
                                    onChange={set('tipoConcreto')}
                                    placeholder="Selecione..."
                                    options={[
                                        { label: 'Usinado', value: 'USINADO' },
                                        { label: 'Feito na Obra', value: 'OBRA' },
                                    ]}
                                />
                            )
                        },
                    ]} />

                    {data.tipoConcreto === 'USINADO' && (
                        <FormRow fields={[
                            { id: 'fornecedor', label: 'Fornecedor do Concreto', children: <InputField id="fornecedor" type="text" placeholder="Ex: Concretex" value={data.fornecedorConcreto} onChange={set('fornecedorConcreto')} /> },
                        ]} />
                    )}

                    <FormRow fields={[
                        {
                            id: 'metodoLancamento', label: 'Método de Lançamento', children: (
                                <SelectField
                                    id="metodoLancamento"
                                    value={data.metodoLancamento}
                                    onChange={set('metodoLancamento')}
                                    placeholder="Selecione..."
                                    options={[
                                        { label: 'Bombeado', value: 'BOMBEADO' },
                                        { label: 'Convencional', value: 'CONVENCIONAL' },
                                    ]}
                                />
                            )
                        },
                        { id: 'volumeTotal', label: 'Volume Total (m³)', children: <InputField id="volumeTotal" type="number" step="0.01" placeholder="Ex: 12.5" value={data.volumeTotal} onChange={set('volumeTotal')} /> },
                    ]} />

                    {/* Aditivo */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Possui Aditivo?</p>
                            <p className="text-xs text-gray-400 mt-0.5">Marque caso o concreto possua aditivo</p>
                        </div>
                        <ToggleSwitch
                            checked={data.possuiAditivo}
                            onChange={(v) => onChange({ ...data, possuiAditivo: v })}
                        />
                    </div>

                    {data.possuiAditivo && (
                        <div>
                            <Label htmlFor="tipoAditivo">Tipo de Aditivo</Label>
                            <InputField id="tipoAditivo" type="text" placeholder="Ex: Plastificante" value={data.tipoAditivo} onChange={set('tipoAditivo')} />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="observacoes">Observações (opcional)</Label>
                        <TextareaField id="observacoes" placeholder="Observações gerais sobre a coleta..." value={data.observacoes} onChange={set('observacoes')} />
                    </div>
                </div>
            </SectionCard>

            {/* Amostras */}
            <SectionCard
                title="Amostras"
                subtitle="Adicione as amostras moldadas nesta coleta"
                icon={<SampleIcon />}
            >
                <div className="flex flex-col gap-3">
                    {data.amostras.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                            <svg className="w-10 h-10 mb-2 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                            </svg>
                            <p className="text-sm">Nenhuma amostra adicionada</p>
                        </div>
                    )}

                    {data.amostras.map((amostra, i) => (
                        <AmostraAccordion
                            key={amostra.id}
                            index={i}
                            data={amostra}
                            onChange={(updated) => updateAmostra(i, updated)}
                            onRemove={() => removeAmostra(i)}
                        />
                    ))}

                    <button
                        type="button"
                        onClick={addAmostra}
                        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-400 hover:border-[#1A5FAD] hover:text-[#1A5FAD] hover:bg-blue-50/30 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Adicionar Amostra
                    </button>
                </div>
            </SectionCard>

            <div className="flex justify-end pt-2">
                <Button className="!w-auto px-8" onClick={onNext}>
                    Avançar para Recolhimento →
                </Button>
            </div>
        </div>
    );
};

export default StepMoldagem;