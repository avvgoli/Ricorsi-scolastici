import { useEffect } from 'react';
import { X, FileDown, Check, Square, CheckSquare, RotateCcw } from 'lucide-react';
import type { RicorsoOperativo } from '../data/ricorsi';
import { exportSingleRicorsoPDF } from '../utils/pdfExport';

interface AppealModalProps {
  ricorso: RicorsoOperativo | null;
  checkedDocs: Record<string, boolean>;
  onToggleDoc: (docId: string) => void;
  onSetMultipleDocs: (docIds: string[], value: boolean) => void;
  onClose: () => void;
}

export function AppealModal({
  ricorso,
  checkedDocs,
  onToggleDoc,
  onSetMultipleDocs,
  onClose,
}: AppealModalProps) {
  useEffect(() => {
    if (!ricorso) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [ricorso, onClose]);

  if (!ricorso) return null;

  const totalDocs = ricorso.documentiNecessari.length;
  const readyDocs = ricorso.documentiNecessari.filter((d) => checkedDocs[d.id]).length;
  const progressPct = totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 0;
  const allDocIds = ricorso.documentiNecessari.map((d) => d.id);

  const statusTone =
    ricorso.stato === 'Aperto'
      ? 'text-[#14532D] dark:text-[#4ADE80]'
      : ricorso.stato === 'In scadenza'
      ? 'text-[#92400E] dark:text-[#FBBF24]'
      : ricorso.stato === 'Preadesione'
      ? 'text-[#0F2147] dark:text-[#93C5FD]'
      : 'text-[#334155] dark:text-[#94A3B8]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1530]/75 dark:bg-black/80 backdrop-blur-[2px] p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-appeal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-[#FFFFFF] dark:bg-[#0D121C] border border-[#94A3B8] dark:border-[#2E3C57] shadow-2xl text-[#0A1530] dark:text-[#F8F7F4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Intestazione modale */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 py-5 bg-[#F1F5F9] dark:bg-[#070A10] border-b border-[#CBD5E1] dark:border-[#28354D]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-[#334155] dark:text-[#CBD5E1]">
              <span className="font-mono-tabular text-[#0F2147] dark:text-[#E5C17B] font-bold">
                {ricorso.codice}
              </span>
              <span aria-hidden="true">·</span>
              <span>{ricorso.categoriaPersonale.join(' / ')}</span>
              <span aria-hidden="true">·</span>
              <span>{ricorso.tipologia}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-bold ${statusTone}`}>Stato: {ricorso.stato}</span>
            </div>
            <h2
              id="modal-appeal-title"
              className="mt-1.5 text-2xl sm:text-3xl font-bold leading-tight text-balance text-[#0A1530] dark:text-[#FFFFFF]"
            >
              {ricorso.titolo}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi scheda ricorso"
            className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-md border border-[#94A3B8] dark:border-[#3A4B6B] bg-[#FFFFFF] dark:bg-[#131B29] text-[#0A1530] dark:text-[#F8F7F4] hover:bg-[#E2E8F0] dark:hover:bg-[#1B2538] hover:border-[#0F2147] dark:hover:border-[#E5C17B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo scheda operativa */}
        <div className="px-6 py-6 space-y-8">
          {/* Riepilogo Dati Chiave */}
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-md bg-[#F8FAFC] dark:bg-[#131B29] border border-[#CBD5E1] dark:border-[#28354D]">
            <div>
              <dt className="text-xs font-semibold text-[#334155] dark:text-[#94A3B8]">
                Scadenza operativa
              </dt>
              <dd className="mt-1 text-sm font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                {ricorso.scadenza}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[#334155] dark:text-[#94A3B8]">
                Valore indicativo
              </dt>
              <dd className="mt-1 text-sm font-bold tabular-nums text-[#9A6700] dark:text-[#E5C17B]">
                {ricorso.valoreIndicativo}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[#334155] dark:text-[#94A3B8]">
                Canale procedurale
              </dt>
              <dd className="mt-1 text-sm font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                {ricorso.canaleProcedurale}
              </dd>
            </div>
          </dl>

          {/* Destinatari e Sintesi */}
          <section className="space-y-2.5">
            <h3 className="text-sm font-bold tracking-wide text-[#0F2147] dark:text-[#E5C17B]">
              Destinatari e Ambito Operativo
            </h3>
            <p className="text-sm leading-relaxed text-[#1E293B] dark:text-[#E2E8F0]">
              <strong className="font-bold text-[#0A1530] dark:text-[#FFFFFF]">Destinatari: </strong>
              {ricorso.destinatari}
            </p>
            <p className="text-sm leading-relaxed text-[#334155] dark:text-[#CBD5E1]">
              {ricorso.sintesiOperativa}
            </p>
          </section>

          <hr className="border-[#CBD5E1] dark:border-[#28354D]" />

          {/* Requisiti */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold tracking-wide text-[#0F2147] dark:text-[#E5C17B]">
              Requisiti di Accesso
            </h3>
            <ul className="space-y-2">
              {ricorso.requisiti.map((req, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[#1E293B] dark:text-[#E2E8F0]"
                >
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B47B10] dark:bg-[#E5C17B] shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-[#CBD5E1] dark:border-[#28354D]" />

          {/* Checklist Interattiva Documenti */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold tracking-wide text-[#0F2147] dark:text-[#E5C17B]">
                  Checklist Documentazione Necessaria
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[#334155] dark:text-[#CBD5E1] tabular-nums">
                  Stato preparazione fascicolo: {readyDocs} di {totalDocs} documenti pronti ({progressPct}%)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSetMultipleDocs(allDocIds, true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[#94A3B8] dark:border-[#3A4B6B] bg-[#F8FAFC] dark:bg-[#131B29] text-[#0A1530] dark:text-[#F8F7F4] hover:border-[#0F2147] dark:hover:border-[#E5C17B] hover:bg-[#E2E8F0] dark:hover:bg-[#1B2538] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-[#0F2147] dark:text-[#E5C17B]" />
                  Segna tutti
                </button>
                <button
                  type="button"
                  onClick={() => onSetMultipleDocs(allDocIds, false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[#CBD5E1] dark:border-[#28354D] bg-[#FFFFFF] dark:bg-[#131B29] text-[#334155] dark:text-[#CBD5E1] hover:border-[#94A3B8] dark:hover:border-[#3A4B6B] hover:text-[#0A1530] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Azzera
                </button>
              </div>
            </div>

            {/* Barra avanzamento ad alto contrasto */}
            <div className="w-full h-2.5 bg-[#E2E8F0] dark:bg-[#1B2538] rounded-full overflow-hidden border border-[#CBD5E1] dark:border-[#28354D]">
              <div
                className="h-full bg-[#0F2147] dark:bg-[#E5C17B] transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="divide-y divide-[#CBD5E1] dark:divide-[#28354D] border border-[#94A3B8] dark:border-[#28354D] rounded-md overflow-hidden">
              {ricorso.documentiNecessari.map((doc) => {
                const isChecked = Boolean(checkedDocs[doc.id]);
                return (
                  <label
                    key={doc.id}
                    className={`flex items-start gap-3.5 p-3.5 min-h-[44px] cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#EEF2F6] dark:bg-[#172133]'
                        : 'bg-[#FFFFFF] dark:bg-[#131B29] hover:bg-[#F8FAFC] dark:hover:bg-[#1B2538]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleDoc(doc.id)}
                      className="sr-only"
                    />
                    <span
                      className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded border shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-[#0F2147] border-[#0F2147] text-[#E5C17B] dark:bg-[#E5C17B] dark:border-[#E5C17B] dark:text-[#070A10]'
                          : 'border-[#64748B] bg-[#FFFFFF] dark:bg-[#0D121C] text-transparent'
                      }`}
                      aria-hidden="true"
                    >
                      {isChecked ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isChecked
                              ? 'line-through text-[#475569] dark:text-[#94A3B8]'
                              : 'text-[#0A1530] dark:text-[#FFFFFF]'
                          }`}
                        >
                          {doc.nome}
                        </span>
                        <span
                          className={`text-xs font-bold shrink-0 ${
                            doc.obbligatorio
                              ? 'text-[#9A6700] dark:text-[#E5C17B]'
                              : 'text-[#475569] dark:text-[#94A3B8]'
                          }`}
                        >
                          {doc.obbligatorio ? 'Obbligatorio' : 'Facoltativo'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1]">
                        {doc.note}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          <hr className="border-[#CBD5E1] dark:border-[#28354D]" />

          {/* Fasi Operative */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold tracking-wide text-[#0F2147] dark:text-[#E5C17B]">
              Iter Procedurale e Fasi Operative
            </h3>
            <ol className="space-y-2.5">
              {ricorso.fasiOperative.map((fase, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#1E293B] dark:text-[#E2E8F0]">
                  <span className="font-mono-tabular text-xs font-bold text-[#0F2147] dark:text-[#E5C17B] mt-0.5 shrink-0">
                    0{idx + 1}.
                  </span>
                  <span className="leading-relaxed">{fase}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Footer Azioni Modale */}
        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#F1F5F9] dark:bg-[#070A10] border-t border-[#CBD5E1] dark:border-[#28354D]">
          <span className="text-xs font-medium text-[#334155] dark:text-[#CBD5E1]">
            Lo stato della checklist viene salvato automaticamente nel browser.
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-md border border-[#94A3B8] dark:border-[#3A4B6B] bg-[#FFFFFF] dark:bg-[#131B29] text-[#0A1530] dark:text-[#F8F7F4] hover:bg-[#E2E8F0] dark:hover:bg-[#1B2538] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Chiudi
            </button>
            <button
              type="button"
              onClick={() => exportSingleRicorsoPDF(ricorso, checkedDocs)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md bg-[#0F2147] hover:bg-[#193266] text-[#E5C17B] dark:bg-[#E5C17B] dark:hover:bg-[#F0D294] dark:text-[#070A10] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              Esporta Scheda PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
