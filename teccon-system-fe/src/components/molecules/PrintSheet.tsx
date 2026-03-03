import React from 'react';

interface PrintSheetProps {
  coleta: {
    obra: string;
    cliente: string;
    local: string;
    dataMoldagem: string;
    fck: string;
    diasEsperados: number[];
    amostras: { numeroSerie: string; numeroCapsulas: string }[];
  };
  coletaId: string;
}

const PrintSheet: React.FC<PrintSheetProps> = ({ coleta, coletaId }) => {
  // QR Code via API pública (sem dependência extra)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    `${window.location.origin}/analise/${coletaId}`
  )}`;

  return (
    <div
      id="print-sheet"
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="bg-[#1A5FAD] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-white font-black text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>
            TECCON
          </p>
          <p className="text-white/60 text-xs tracking-widest uppercase">Engenharia e Tecnologia</p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-xs">Protocolo</p>
          <p className="text-white font-bold text-sm">#{coletaId}</p>
        </div>
      </div>

      <div className="p-6 flex gap-6">
        {/* Left — data */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cliente</p>
              <p className="font-semibold text-gray-800">{coleta.cliente || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Obra</p>
              <p className="font-semibold text-gray-800">{coleta.obra || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Local</p>
              <p className="font-semibold text-gray-800">{coleta.local || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data de Moldagem</p>
              <p className="font-semibold text-gray-800">{coleta.dataMoldagem || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FCK</p>
              <p className="font-semibold text-gray-800">{coleta.fck ? `${coleta.fck} MPa` : '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amostras</p>
              <p className="font-semibold text-gray-800">{coleta.amostras.length}</p>
            </div>
          </div>

          {/* Dias esperados */}
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Dias de Análise
            </p>
            <div className="flex flex-wrap gap-2">
              {coleta.diasEsperados.map((d) => (
                <div
                  key={d}
                  className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5"
                >
                  <div className="w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center flex-shrink-0">
                    {/* checkbox físico — o operador marca na folha impressa */}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{d} dias</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amostras resumo */}
          {coleta.amostras.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Amostras Moldadas
              </p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-1.5 text-xs font-bold text-gray-500 rounded-l-lg">Série</th>
                    <th className="text-left px-3 py-1.5 text-xs font-bold text-gray-500 rounded-r-lg">Cápsulas</th>
                  </tr>
                </thead>
                <tbody>
                  {coleta.amostras.map((a, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-1.5 text-gray-700">{a.numeroSerie || `Série ${i + 1}`}</td>
                      <td className="px-3 py-1.5 text-gray-700">{a.numeroCapsulas || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right — QR Code */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-2">
            <img
              src={qrUrl}
              alt="QR Code para análise"
              className="w-32 h-32"
            />
          </div>
          <p className="text-[10px] text-center text-gray-400 max-w-[140px] leading-snug">
            Escaneie para ir direto à etapa de análise
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintSheet;