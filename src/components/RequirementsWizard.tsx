import { useState, useMemo } from 'react';
import { ArrowRight, RotateCcw, FileDown, CheckCircle2 } from 'lucide-react';
import type { CategoriaPersonale, RicorsoOperativo } from '../data/ricorsi';
import { exportCatalogSummaryPDF } from '../utils/pdfExport';

interface RequirementsWizardProps {
  ricorsi: RicorsoOperativo[];
  checkedDocs: Record<string, boolean>;
  onOpenRicorso: (ricorso: RicorsoOperativo) => void;
}

type ContrattoScelta = 'Determinato' | 'Indeterminato' | 'Aspirante';

interface EsigenzaOption {
  id: string;
  label: string;
  descrizione: string;
  matchIds: string[];
}

const ESIGENZE_OPTIONS: EsigenzaOption[] = [
  {
    id: 'indennita-accessorie',
    label: 'Emolumenti e Bonus Non Erogati',
    descrizione: 'Carta Docente 500 €, RPD su supplenze brevi, CIA ATA o Bonus Formazione ATA.',
    matchIds: ['carta-docente-precari', 'rpd-supplenze-brevi', 'cia-ata-supplenze', 'bonus-formazione-ata'],
  },
  {
    id: 'ferie-tfr',
    label: 'Ferie Non Godute e Trattenuta TFR 2,5%',
    descrizione: 'Monetizzazione ferie al 30 giugno e rimborso trattenuta previdenziale su contratti a termine.',
    matchIds: ['ferie-non-godute', 'restituzione-tfr-precari'],
  },
  {
    id: 'carriera-ruolo',
    label: 'Ricostruzione di Carriera, Anno 2013 o DSGA',
    descrizione: 'Valutazione integrale servizio pre-ruolo, recupero 2013 e temporizzazione DSGA.',
    matchIds: ['ricostruzione-carriera-integrale', 'recupero-anno-2013', 'temporizzazione-dsga'],
  },
  {
    id: 'precariato-36',
    label: 'Reiterazione Contratti Oltre 36 Mesi',
    descrizione: 'Indennità per successione di supplenze su posto vacante e disponibile.',
    matchIds: ['abuso-contratti-termine'],
  },
  {
    id: 'graduatorie-concorsi',
    label: 'GPS, Mobilità e Concorsi Dirigenti',
    descrizione: 'Errori algoritmo supplenze, punteggi trasferimenti e valutazione titoli concorsuali.',
    matchIds: ['algoritmo-gps-supplenze', 'mobilita-trasferimenti', 'concorso-dirigenti-titoli'],
  },
];

export function RequirementsWizard({
  ricorsi,
  checkedDocs,
  onOpenRicorso,
}: RequirementsWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [ruolo, setRuolo] = useState<CategoriaPersonale | null>(null);
  const [contratto, setContratto] = useState<ContrattoScelta | null>(null);
  const [esigenze, setEsigenze] = useState<string[]>([]);

  const toggleEsigenza = (id: string) => {
    setEsigenze((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetWizard = () => {
    setStep(1);
    setRuolo(null);
    setContratto(null);
    setEsigenze([]);
  };

  const matchedRicorsi = useMemo(() => {
    if (!ruolo || !contratto) return [];
    const selectedMatchIds = new Set(
      ESIGENZE_OPTIONS.filter((e) => esigenze.includes(e.id)).flatMap((e) => e.matchIds)
    );

    return ricorsi.filter((r) => {
      const roleOk = r.categoriaPersonale.includes(ruolo);
      const contractOk = r.tipoContrattoTarget.includes(contratto);
      const needOk = selectedMatchIds.size === 0 || selectedMatchIds.has(r.id);
      return roleOk && contractOk && needOk;
    });
  }, [ricorsi, ruolo, contratto, esigenze]);

  return (
    <section
      id="verifica-requisiti"
      className="py-14 border-t border-[#CBD5E1] dark:border-[#28354D] bg-[#F1F5F9] dark:bg-[#070A10]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Colonna sinistra: Introduzione e Avanzamento */}
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-bold tracking-wider uppercase text-[#0F2147] dark:text-[#E5C17B]">
              Simulatore Guidato
            </p>
            <h2 className="text-3xl font-bold text-balance text-[#0A1530] dark:text-[#FFFFFF]">
              Verifica Requisiti Operativi
            </h2>
            <p className="text-sm leading-relaxed text-[#1E293B] dark:text-[#CBD5E1]">
              Rispondi a tre domande rapide sul tuo inquadramento professionale e sulla tua
              situazione lavorativa per individuare le procedure compatibili e ottenere la checklist
              documentale dedicata.
            </p>

            {/* Indicatore Passi */}
            <div className="pt-2 space-y-2.5">
              {[
                { num: 1, title: 'Profilo professionale', value: ruolo },
                { num: 2, title: 'Tipologia contrattuale', value: contratto },
                {
                  num: 3,
                  title: 'Ambiti di verifica',
                  value: esigenze.length > 0 ? `${esigenze.length} selezionati` : null,
                },
                {
                  num: 4,
                  title: 'Risultati compatibili',
                  value: step === 4 ? `${matchedRicorsi.length} procedure` : null,
                },
              ].map((s) => {
                const isCurrent = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    disabled={s.num > step && !(s.num === 4 && ruolo && contratto)}
                    onClick={() => {
                      if (s.num <= step || (s.num === 4 && ruolo && contratto)) {
                        setStep(s.num as 1 | 2 | 3 | 4);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md border text-left transition-colors ${
                      isCurrent
                        ? 'border-[#0F2147] bg-[#0F2147] text-[#FFFFFF] dark:border-[#E5C17B] dark:bg-[#1B2538] dark:text-[#FFFFFF]'
                        : isCompleted
                        ? 'border-[#94A3B8] bg-[#FFFFFF] text-[#0A1530] dark:border-[#3A4B6B] dark:bg-[#131B29] dark:text-[#FFFFFF] cursor-pointer hover:border-[#0F2147] dark:hover:border-[#E5C17B]/70'
                        : 'border-[#CBD5E1] bg-[#FFFFFF]/70 text-[#475569] dark:border-[#28354D] dark:bg-[#0D121C] dark:text-[#94A3B8] opacity-65 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono-tabular text-xs font-bold ${
                          isCurrent
                            ? 'text-[#E5C17B]'
                            : 'text-[#0F2147] dark:text-[#E5C17B]'
                        }`}
                      >
                        0{s.num}
                      </span>
                      <span className="text-sm font-semibold">{s.title}</span>
                    </div>
                    {s.value && (
                      <span
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-[#E5C17B]'
                            : 'text-[#334155] dark:text-[#CBD5E1]'
                        }`}
                      >
                        {s.value}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colonna destra: Pannello Interattivo Step */}
          <div className="lg:col-span-8 bg-[#FFFFFF] dark:bg-[#0D121C] border border-[#94A3B8] dark:border-[#28354D] rounded-lg p-6 sm:p-8 shadow-xs">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono-tabular font-semibold text-[#334155] dark:text-[#CBD5E1]">
                    Passaggio 1 di 3
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                    Qual è la tua categoria di personale scolastico?
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(
                    [
                      {
                        id: 'Docenti' as CategoriaPersonale,
                        desc: 'Insegnanti di ogni ordine e grado, sostegno, IRC, educatori.',
                      },
                      {
                        id: 'ATA' as CategoriaPersonale,
                        desc: 'Collaboratori scolastici, Assistenti amministrativi/tecnici, DSGA.',
                      },
                      {
                        id: 'Dirigenti' as CategoriaPersonale,
                        desc: 'Dirigenti Scolastici in servizio o candidati ai concorsi DS.',
                      },
                    ] as const
                  ).map((item) => {
                    const active = ruolo === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setRuolo(item.id);
                          setStep(2);
                        }}
                        className={`p-4 rounded-md border text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-[#0F2147] bg-[#E5C17B]/25 dark:border-[#E5C17B] dark:bg-[#1B2538]'
                            : 'border-[#94A3B8] bg-[#F8FAFC] hover:border-[#0F2147] hover:bg-[#E5C17B]/20 dark:border-[#2E3C57] dark:bg-[#131B29] dark:hover:border-[#E5C17B] dark:hover:bg-[#1B2538]'
                        }`}
                      >
                        <div className="text-base font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                          {item.id}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#334155] dark:text-[#CBD5E1]">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono-tabular font-semibold text-[#334155] dark:text-[#CBD5E1]">
                    Passaggio 2 di 3 · Profilo:{' '}
                    <strong className="text-[#0F2147] dark:text-[#E5C17B]">{ruolo}</strong>
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                    Qual è la tua situazione contrattuale prevalente?
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(
                    [
                      {
                        id: 'Determinato' as ContrattoScelta,
                        title: 'Tempo Determinato',
                        desc: 'Supplenze annuali (31/08), fino al termine delle attività (30/06) o brevi.',
                      },
                      {
                        id: 'Indeterminato' as ContrattoScelta,
                        title: 'Tempo Indeterminato (Ruolo)',
                        desc: 'Personale già immesso in ruolo (anche con pre-ruolo pregresso).',
                      },
                      {
                        id: 'Aspirante' as ContrattoScelta,
                        title: 'Aspirante / Concorsista',
                        desc: 'Iscritti GPS o partecipanti a procedure concorsuali e graduatorie.',
                      },
                    ] as const
                  ).map((item) => {
                    const active = contratto === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setContratto(item.id);
                          setStep(3);
                        }}
                        className={`p-4 rounded-md border text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-[#0F2147] bg-[#E5C17B]/25 dark:border-[#E5C17B] dark:bg-[#1B2538]'
                            : 'border-[#94A3B8] bg-[#F8FAFC] hover:border-[#0F2147] hover:bg-[#E5C17B]/20 dark:border-[#2E3C57] dark:bg-[#131B29] dark:hover:border-[#E5C17B] dark:hover:bg-[#1B2538]'
                        }`}
                      >
                        <div className="text-base font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                          {item.title}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#334155] dark:text-[#CBD5E1]">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-semibold text-[#0F2147] dark:text-[#CBD5E1] hover:underline cursor-pointer"
                  >
                    Torna al profilo
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono-tabular font-semibold text-[#334155] dark:text-[#CBD5E1]">
                    Passaggio 3 di 3 ·{' '}
                    <strong className="text-[#0F2147] dark:text-[#E5C17B]">{ruolo}</strong> ·{' '}
                    {contratto}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                    Seleziona uno o più ambiti operativi di interesse
                  </h3>
                  <p className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1]">
                    Puoi lasciare vuoto per visualizzare tutte le procedure compatibili con il tuo profilo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ESIGENZE_OPTIONS.map((opt) => {
                    const selected = esigenze.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleEsigenza(opt.id)}
                        className={`p-3.5 rounded-md border text-left transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#0F2147] bg-[#E5C17B]/30 dark:border-[#E5C17B] dark:bg-[#1B2538]'
                            : 'border-[#94A3B8] bg-[#F8FAFC] hover:border-[#0F2147] hover:bg-[#E2E8F0]/60 dark:border-[#2E3C57] dark:bg-[#131B29] dark:hover:border-[#3A4B6B] dark:hover:bg-[#1B2538]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                            {opt.label}
                          </span>
                          {selected && (
                            <CheckCircle2 className="w-4 h-4 text-[#0F2147] dark:text-[#E5C17B] shrink-0 mt-0.5" />
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1]">
                          {opt.descrizione}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-sm font-semibold text-[#0F2147] dark:text-[#CBD5E1] hover:underline cursor-pointer"
                  >
                    Indietro
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-md bg-[#0F2147] hover:bg-[#193266] text-[#E5C17B] dark:bg-[#E5C17B] dark:hover:bg-[#F0D294] dark:text-[#070A10] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Visualizza Ricorsi Compatibili
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#CBD5E1] dark:border-[#28354D] pb-4">
                  <div>
                    <span className="text-xs font-mono-tabular font-bold text-[#0F2147] dark:text-[#E5C17B]">
                      Esito Verifica · {ruolo} · {contratto}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-[#0A1530] dark:text-[#FFFFFF] tabular-nums">
                      {matchedRicorsi.length}{' '}
                      {matchedRicorsi.length === 1 ? 'procedura compatibile' : 'procedure compatibili'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetWizard}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-[#94A3B8] dark:border-[#3A4B6B] bg-[#F8FAFC] dark:bg-[#131B29] text-[#0A1530] dark:text-[#F8F7F4] hover:bg-[#E2E8F0] dark:hover:bg-[#1B2538] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Nuova verifica
                    </button>
                    {matchedRicorsi.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          exportCatalogSummaryPDF(
                            matchedRicorsi,
                            `Verifica Requisiti: ${ruolo} (${contratto})`,
                            checkedDocs
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-md bg-[#0F2147] hover:bg-[#193266] text-[#E5C17B] dark:bg-[#E5C17B] dark:hover:bg-[#F0D294] dark:text-[#070A10] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        Esporta Esito PDF
                      </button>
                    )}
                  </div>
                </div>

                {matchedRicorsi.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-sm text-[#334155] dark:text-[#CBD5E1]">
                      Nessuna procedura attiva corrisponde esattamente alla combinazione selezionata.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEsigenze([]);
                        setStep(3);
                      }}
                      className="px-4 py-2 text-xs font-semibold rounded-md border border-[#94A3B8] dark:border-[#3A4B6B] bg-[#F8FAFC] dark:bg-[#131B29] text-[#0A1530] dark:text-[#FFFFFF] hover:bg-[#E2E8F0] dark:hover:bg-[#1B2538] cursor-pointer"
                    >
                      Modifica ambiti di verifica
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#CBD5E1] dark:divide-[#28354D]">
                    {matchedRicorsi.map((r) => {
                      const pronti = r.documentiNecessari.filter((d) => checkedDocs[d.id]).length;
                      return (
                        <div
                          key={r.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                              <span className="font-mono-tabular font-bold text-[#0F2147] dark:text-[#E5C17B]">
                                {r.codice}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-medium">Stato: {r.stato}</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums font-medium">
                                Documenti: {pronti}/{r.documentiNecessari.length}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                              {r.titolo}
                            </h4>
                            <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                              Scadenza: {r.scadenza}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onOpenRicorso(r)}
                            className="shrink-0 px-3.5 py-2 text-xs font-bold rounded-md border border-[#0F2147] text-[#0F2147] hover:bg-[#0F2147] hover:text-[#E5C17B] dark:border-[#E5C17B] dark:text-[#E5C17B] dark:hover:bg-[#E5C17B] dark:hover:text-[#070A10] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Apri Checklist
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
