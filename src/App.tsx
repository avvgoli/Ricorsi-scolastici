import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  FileDown,
  RotateCcw,
  ChevronRight,
  CheckSquare,
  LayoutGrid,
  List,
} from 'lucide-react';
import {
  RICORSI_DATA,
  type CategoriaPersonale,
  type TipologiaRicorso,
  type StatoRicorso,
  type RicorsoOperativo,
} from './data/ricorsi';
import { exportCatalogSummaryPDF, exportSingleRicorsoPDF } from './utils/pdfExport';
import { AppealModal } from './components/AppealModal';
import { RequirementsWizard } from './components/RequirementsWizard';

const STORAGE_DOCS_KEY = 'ricorsi_scuola_checklist_v1';
const STORAGE_THEME_KEY = 'ricorsi_scuola_theme_v2';

const CATEGORIE: ('Tutte' | CategoriaPersonale)[] = ['Tutte', 'Docenti', 'ATA', 'Dirigenti'];
const TIPOLOGIE: ('Tutte' | TipologiaRicorso)[] = [
  'Tutte',
  'Retribuzione e Indennità',
  'Carriera e Anzianità',
  'Graduatorie e Reclutamento',
  'Tutela Contrattuale',
];
const STATI: ('Tutti' | StatoRicorso)[] = ['Tutti', 'Aperto', 'In scadenza', 'Preadesione', 'Chiuso'];

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<'Tutte' | CategoriaPersonale>('Tutte');
  const [selectedTipologia, setSelectedTipologia] = useState<'Tutte' | TipologiaRicorso>('Tutte');
  const [selectedStato, setSelectedStato] = useState<'Tutti' | StatoRicorso>('Tutti');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [activeRicorso, setActiveRicorso] = useState<RicorsoOperativo | null>(null);

  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DOCS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_THEME_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // ignore storage quota errors
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(checkedDocs));
    } catch {
      // ignore storage quota errors
    }
  }, [checkedDocs]);

  const handleToggleDoc = (docId: string) => {
    setCheckedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleSetMultipleDocs = (docIds: string[], value: boolean) => {
    setCheckedDocs((prev) => {
      const next = { ...prev };
      docIds.forEach((id) => {
        next[id] = value;
      });
      return next;
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategoria('Tutte');
    setSelectedTipologia('Tutte');
    setSelectedStato('Tutti');
  };

  const filteredRicorsi = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return RICORSI_DATA.filter((r) => {
      const matchCat =
        selectedCategoria === 'Tutte' || r.categoriaPersonale.includes(selectedCategoria);
      const matchTip = selectedTipologia === 'Tutte' || r.tipologia === selectedTipologia;
      const matchStato = selectedStato === 'Tutti' || r.stato === selectedStato;
      const matchQuery =
        q === '' ||
        r.titolo.toLowerCase().includes(q) ||
        r.codice.toLowerCase().includes(q) ||
        r.sintesiOperativa.toLowerCase().includes(q) ||
        r.destinatari.toLowerCase().includes(q) ||
        r.tipologia.toLowerCase().includes(q) ||
        r.documentiNecessari.some((d) => d.nome.toLowerCase().includes(q));
      return matchCat && matchTip && matchStato && matchQuery;
    });
  }, [searchQuery, selectedCategoria, selectedTipologia, selectedStato]);

  const activeFiltersCount =
    (selectedCategoria !== 'Tutte' ? 1 : 0) +
    (selectedTipologia !== 'Tutte' ? 1 : 0) +
    (selectedStato !== 'Tutti' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const getStatusTextClass = (stato: StatoRicorso) => {
    if (stato === 'Aperto') return 'text-[#14532D] dark:text-[#4ADE80]';
    if (stato === 'In scadenza') return 'text-[#92400E] dark:text-[#FBBF24]';
    if (stato === 'Preadesione') return 'text-[#0F2147] dark:text-[#93C5FD]';
    return 'text-[#475569] dark:text-[#94A3B8]';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] text-[#0A1530] dark:bg-[#070A10] dark:text-[#F8F7F4] transition-colors duration-200">
      {/* Top Bar Contract: esattamente 3 zone separate da gap-8 */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 dark:bg-[#070A10]/95 backdrop-blur-sm border-b border-[#94A3B8] dark:border-[#28354D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zona 1: Logo allegato e scritta Studio legale Golinelli */}
          <a
            href="#top"
            className="inline-flex items-center gap-3 whitespace-nowrap shrink-0"
          >
            <span className="inline-flex items-center justify-center bg-white rounded-md p-1 border border-[#CBD5E1] dark:border-transparent shrink-0">
              <img
                src="/assets/aistudio/logo_piccolo_fc815523.png"
                alt="Logo Studio legale Golinelli"
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-[#0F2147] dark:text-[#E5C17B]">
              Studio legale Golinelli
            </span>
          </a>

          {/* Zona 2: 4 link di navigazione concisi */}
          <nav
            aria-label="Navigazione principale"
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#1E293B] dark:text-[#CBD5E1]"
          >
            <a
              href="#catalogo"
              className="hover:text-[#0F2147] dark:hover:text-[#E5C17B] transition-colors whitespace-nowrap shrink-0"
            >
              Catalogo Ricorsi
            </a>
            <a
              href="#verifica-requisiti"
              className="hover:text-[#0F2147] dark:hover:text-[#E5C17B] transition-colors whitespace-nowrap shrink-0"
            >
              Verifica Requisiti
            </a>
            <a
              href="#documentazione"
              className="hover:text-[#0F2147] dark:hover:text-[#E5C17B] transition-colors whitespace-nowrap shrink-0"
            >
              Documentazione
            </a>
            <a
              href="#esportazione"
              className="hover:text-[#0F2147] dark:hover:text-[#E5C17B] transition-colors whitespace-nowrap shrink-0"
            >
              Esportazione PDF
            </a>
          </nav>

          {/* Zona 3: 1 azione primaria */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() =>
                exportCatalogSummaryPDF(
                  filteredRicorsi,
                  'Dossier Operativo Ricorsi Scolastici',
                  checkedDocs
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-md bg-[#0F2147] hover:bg-[#193266] text-[#E5C17B] dark:bg-[#E5C17B] dark:hover:bg-[#F0D294] dark:text-[#070A10] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              Esporta PDF
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero Editoriale Istituzionale */}
        <section className="border-b border-[#94A3B8] dark:border-[#28354D] bg-[#FFFFFF] dark:bg-[#0D121C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-4xl flex flex-col justify-center space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-balance text-[#0A1530] dark:text-[#FFFFFF]">
                Portale operativo Ricorsi Scolastici
              </h1>
              <p className="text-base leading-relaxed max-w-2xl text-[#1E293B] dark:text-[#CBD5E1]">
                Scopri quali tutele puoi attivare, controlla i requisiti, raccogli i documenti
                giusti e scarica il dossier PDF pronto per l'istruttoria. Uno spazio operativo per
                Docenti, ATA e Dirigenti.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#verifica-requisiti"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-md bg-[#E5C17B] hover:bg-[#D9B160] text-[#0A1530] border border-[#B47B10] dark:border-transparent dark:bg-[#E5C17B] dark:hover:bg-[#F0D294] dark:text-[#070A10] transition-colors whitespace-nowrap shrink-0"
                >
                  Avvia Verifica Requisiti
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Sezione Catalogo Operativo */}
        <section id="catalogo" className="py-12 bg-[#F1F5F9] dark:bg-[#070A10]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Barra Controlli Workspace: Ricerca, Vista e Selettore Tema */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#CBD5E1] dark:border-[#28354D]">
              <div className="relative flex-1 max-w-xl">
                <Search className="w-4 h-4 text-[#334155] dark:text-[#CBD5E1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca per parola chiave, codice, documento o categoria..."
                  aria-label="Cerca ricorso per parola chiave"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-md bg-[#FFFFFF] dark:bg-[#131B29] border border-[#94A3B8] dark:border-[#3A4B6B] text-[#0A1530] dark:text-[#FFFFFF] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F2147] dark:focus:ring-[#E5C17B]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Toggle Vista Schede / Tabella */}
                <div className="inline-flex items-center p-1 rounded-md bg-[#E2E8F0] dark:bg-[#131B29] border border-[#94A3B8] dark:border-[#28354D]">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-[#0F2147] text-[#E5C17B] dark:bg-[#E5C17B] dark:text-[#070A10]'
                        : 'text-[#1E293B] dark:text-[#CBD5E1] hover:text-[#0A1530] dark:hover:text-[#FFFFFF]'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Schede
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-[#0F2147] text-[#E5C17B] dark:bg-[#E5C17B] dark:text-[#070A10]'
                        : 'text-[#1E293B] dark:text-[#CBD5E1] hover:text-[#0A1530] dark:hover:text-[#FFFFFF]'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    Tabella
                  </button>
                </div>

                {/* Selettore Tema Chiaro / Scuro */}
                <button
                  type="button"
                  onClick={() => setDarkMode((prev) => !prev)}
                  aria-label={darkMode ? 'Attiva tema chiaro' : 'Attiva tema scuro'}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-md border border-[#94A3B8] dark:border-[#3A4B6B] bg-[#FFFFFF] dark:bg-[#131B29] text-[#0F2147] dark:text-[#F8F7F4] hover:border-[#0F2147] dark:hover:border-[#E5C17B] hover:bg-[#E2E8F0] dark:hover:bg-[#1B2538] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {darkMode ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#E5C17B]" />
                      Tema Chiaro
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#0F2147]" />
                      Tema Scuro
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Filtri Dinamici Combinabili */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FFFFFF] dark:bg-[#0D121C] border border-[#94A3B8] dark:border-[#28354D] rounded-lg p-4">
              {/* Filtro Categoria Personale */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-[#1E293B] dark:text-[#CBD5E1]">
                  Categoria di personale
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIE.map((cat) => {
                    const active = selectedCategoria === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoria(cat)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-[#0F2147] border-[#0F2147] text-[#E5C17B] dark:bg-[#E5C17B] dark:border-[#E5C17B] dark:text-[#070A10]'
                            : 'bg-[#F8FAFC] border-[#94A3B8] text-[#0A1530] hover:border-[#0F2147] dark:bg-[#131B29] dark:border-[#2E3C57] dark:text-[#E2E8F0] dark:hover:border-[#E5C17B]/70'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtro Tipologia Ricorso */}
              <div className="space-y-2">
                <label
                  htmlFor="filter-tipologia"
                  className="block text-xs font-bold text-[#1E293B] dark:text-[#CBD5E1]"
                >
                  Tipologia di ricorso
                </label>
                <select
                  id="filter-tipologia"
                  value={selectedTipologia}
                  onChange={(e) => setSelectedTipologia(e.target.value as 'Tutte' | TipologiaRicorso)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-md border border-[#94A3B8] dark:border-[#3A4B6B] bg-[#F8FAFC] dark:bg-[#131B29] text-[#0A1530] dark:text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#0F2147] dark:focus:ring-[#E5C17B]"
                >
                  {TIPOLOGIE.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Stato / Scadenza */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-[#1E293B] dark:text-[#CBD5E1]">
                  Stato procedura
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {STATI.map((st) => {
                    const active = selectedStato === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStato(st)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-[#E5C17B] border-[#B47B10] text-[#0A1530] dark:bg-[#E5C17B] dark:border-[#E5C17B] dark:text-[#070A10]'
                            : 'bg-[#F8FAFC] border-[#94A3B8] text-[#0A1530] hover:border-[#0F2147] dark:bg-[#131B29] dark:border-[#2E3C57] dark:text-[#E2E8F0] dark:hover:border-[#E5C17B]/70'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Riepilogo Risultati e Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#334155] dark:text-[#CBD5E1]">
              <p className="tabular-nums font-medium">
                Visualizzazione di{' '}
                <strong className="font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                  {filteredRicorsi.length}
                </strong>{' '}
                su {RICORSI_DATA.length} procedure operative
              </p>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 font-bold text-[#0F2147] dark:text-[#E5C17B] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Azzera filtri ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Stato Vuoto o Elenco Risultati */}
            {filteredRicorsi.length === 0 ? (
              <div className="py-16 text-center rounded-lg border border-[#94A3B8] dark:border-[#28354D] bg-[#FFFFFF] dark:bg-[#0D121C] space-y-3">
                <p className="text-base font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                  Nessun ricorso corrisponde ai criteri di ricerca selezionati.
                </p>
                <p className="text-xs text-[#334155] dark:text-[#CBD5E1]">
                  Prova a rimuovere uno o più filtri oppure utilizza il simulatore guidato.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md bg-[#0F2147] text-[#E5C17B] hover:bg-[#193266] dark:bg-[#E5C17B] dark:text-[#070A10] dark:hover:bg-[#F0D294] cursor-pointer"
                >
                  Ripristina tutti i ricorsi
                </button>
              </div>
            ) : viewMode === 'cards' ? (
              /* Vista Griglia Schede */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRicorsi.map((r) => {
                  const totalDocs = r.documentiNecessari.length;
                  const readyDocs = r.documentiNecessari.filter((d) => checkedDocs[d.id]).length;
                  return (
                    <article
                      key={r.id}
                      className="flex flex-col justify-between p-6 rounded-lg bg-[#FFFFFF] dark:bg-[#131B29] border border-[#94A3B8] dark:border-[#2E3C57] hover:border-[#0F2147] dark:hover:border-[#E5C17B] transition-colors shadow-xs"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#334155] dark:text-[#CBD5E1]">
                          <span className="font-mono-tabular font-bold text-[#0F2147] dark:text-[#E5C17B]">
                            {r.codice}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{r.categoriaPersonale.join(' / ')}</span>
                          <span aria-hidden="true">·</span>
                          <span className={`font-bold ${getStatusTextClass(r.stato)}`}>
                            {r.stato}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold leading-snug text-[#0A1530] dark:text-[#FFFFFF]">
                          <button
                            type="button"
                            onClick={() => setActiveRicorso(r)}
                            className="text-left hover:text-[#0F2147] dark:hover:text-[#E5C17B] transition-colors cursor-pointer"
                          >
                            {r.titolo}
                          </button>
                        </h3>

                        <p className="text-xs font-bold text-[#9A6700] dark:text-[#E5C17B]">
                          {r.tipologia}
                        </p>

                        <p className="text-sm leading-relaxed text-[#334155] dark:text-[#CBD5E1] line-clamp-3">
                          {r.sintesiOperativa}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#CBD5E1] dark:border-[#28354D] space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#334155] dark:text-[#CBD5E1]">
                            Scadenza:{' '}
                            <strong className="font-bold text-[#0A1530] dark:text-[#FFFFFF]">
                              {r.scadenza.split('(')[0].trim()}
                            </strong>
                          </span>
                          <span className="font-mono-tabular font-bold text-[#0F2147] dark:text-[#E5C17B]">
                            {readyDocs}/{totalDocs} doc.
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveRicorso(r)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-md bg-[#0F2147] hover:bg-[#193266] text-[#FFFFFF] dark:bg-[#1B2538] dark:border dark:border-[#3A4B6B] dark:text-[#FFFFFF] dark:hover:border-[#E5C17B] dark:hover:text-[#E5C17B] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <CheckSquare className="w-3.5 h-3.5 text-[#E5C17B]" />
                            Dettagli e Checklist
                          </button>
                          <button
                            type="button"
                            onClick={() => exportSingleRicorsoPDF(r, checkedDocs)}
                            title="Esporta scheda operativa in PDF"
                            aria-label={`Esporta ${r.titolo} in PDF`}
                            className="inline-flex items-center justify-center px-3 py-2 text-xs font-bold rounded-md border border-[#B47B10] bg-[#E5C17B] text-[#0A1530] hover:bg-[#D9B160] dark:border-[#3A4B6B] dark:bg-[#0D121C] dark:text-[#E5C17B] dark:hover:bg-[#E5C17B] dark:hover:text-[#070A10] dark:hover:border-[#E5C17B] transition-colors shrink-0 cursor-pointer"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Vista Tabella Operativa */
              <div className="overflow-x-auto rounded-lg border border-[#94A3B8] dark:border-[#2E3C57] bg-[#FFFFFF] dark:bg-[#131B29]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#94A3B8] dark:border-[#28354D] bg-[#E2E8F0] dark:bg-[#0D121C] text-xs font-bold text-[#0A1530] dark:text-[#CBD5E1]">
                      <th className="py-3 px-4">Codice</th>
                      <th className="py-3 px-4">Ricorso Operativo</th>
                      <th className="py-3 px-4">Personale</th>
                      <th className="py-3 px-4">Stato</th>
                      <th className="py-3 px-4">Scadenza</th>
                      <th className="py-3 px-4 text-right">Documenti</th>
                      <th className="py-3 px-4 text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#28354D] text-sm">
                    {filteredRicorsi.map((r) => {
                      const readyDocs = r.documentiNecessari.filter((d) => checkedDocs[d.id]).length;
                      return (
                        <tr
                          key={r.id}
                          className="hover:bg-[#F8FAFC] dark:hover:bg-[#1B2538] transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono-tabular text-xs font-bold text-[#0F2147] dark:text-[#E5C17B] whitespace-nowrap">
                            {r.codice}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => setActiveRicorso(r)}
                              className="font-bold text-left text-[#0A1530] dark:text-[#FFFFFF] hover:text-[#0F2147] dark:hover:text-[#E5C17B] cursor-pointer"
                            >
                              {r.titolo}
                            </button>
                            <div className="text-xs font-medium text-[#9A6700] dark:text-[#94A3B8]">
                              {r.tipologia}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-medium text-[#1E293B] dark:text-[#E2E8F0] whitespace-nowrap">
                            {r.categoriaPersonale.join(', ')}
                          </td>
                          <td className={`py-3.5 px-4 text-xs font-bold whitespace-nowrap ${getStatusTextClass(r.stato)}`}>
                            {r.stato}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[#334155] dark:text-[#CBD5E1]">
                            {r.scadenza}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono-tabular text-xs font-bold text-[#0F2147] dark:text-[#E5C17B] whitespace-nowrap">
                            {readyDocs}/{r.documentiNecessari.length}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveRicorso(r)}
                                className="px-2.5 py-1.5 text-xs font-bold rounded border border-[#94A3B8] dark:border-[#3A4B6B] bg-[#F8FAFC] dark:bg-[#0D121C] text-[#0A1530] dark:text-[#FFFFFF] hover:border-[#0F2147] dark:hover:border-[#E5C17B] cursor-pointer"
                              >
                                Apri
                              </button>
                              <button
                                type="button"
                                onClick={() => exportSingleRicorsoPDF(r, checkedDocs)}
                                className="px-2.5 py-1.5 text-xs font-bold rounded border border-[#B47B10] bg-[#E5C17B] text-[#0A1530] hover:bg-[#D9B160] dark:border-[#E5C17B] dark:bg-transparent dark:text-[#E5C17B] dark:hover:bg-[#E5C17B] dark:hover:text-[#070A10] cursor-pointer"
                              >
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Sezione Verifica Requisiti (Simulatore Guidato) */}
        <RequirementsWizard
          ricorsi={RICORSI_DATA}
          checkedDocs={checkedDocs}
          onOpenRicorso={(r) => setActiveRicorso(r)}
        />

        {/* Sezione Stato Documentazione & Esportazione esclusivamente in PDF */}
        <section
          id="documentazione"
          className="py-14 border-t border-[#94A3B8] dark:border-[#28354D] bg-[#FFFFFF] dark:bg-[#0D121C]"
        >
          <div id="esportazione" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3">
                <p className="text-xs font-bold tracking-wider uppercase text-[#0F2147] dark:text-[#E5C17B]">
                  Gestione Documentale & Dossier
                </p>
                <h2 className="text-3xl font-bold text-balance text-[#0A1530] dark:text-[#FFFFFF]">
                  Preparazione fascicolo ed esportazione PDF
                </h2>
                <p className="text-sm leading-relaxed text-[#1E293B] dark:text-[#CBD5E1]">
                  Ogni scheda ricorso include una checklist interattiva persistente. Puoi generare
                  ed esportare in formato PDF sia la singola procedura con lo stato dei documenti già
                  reperiti, sia l’intero dossier delle procedure attualmente filtrate.
                </p>
              </div>

              <div className="lg:col-span-5 flex lg:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    exportCatalogSummaryPDF(
                      filteredRicorsi,
                      'Dossier Operativo Ricorsi Scolastici',
                      checkedDocs
                    )
                  }
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-bold rounded-md bg-[#0F2147] hover:bg-[#193266] text-[#E5C17B] dark:bg-[#E5C17B] dark:hover:bg-[#F0D294] dark:text-[#070A10] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  Esporta Dossier PDF ({filteredRicorsi.length})
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Istituzionale Pulito */}
      <footer className="border-t border-[#94A3B8] dark:border-[#28354D] bg-[#F1F5F9] dark:bg-[#070A10] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#334155] dark:text-[#CBD5E1]">
          <div>
            <p className="font-bold text-[#0A1530] dark:text-[#FFFFFF]">
              Studio legale Golinelli · Portale Operativo Ricorsi Scolastici
            </p>
            <p className="mt-1 text-[#475569] dark:text-[#94A3B8]">
              Schede procedurali, requisiti di accesso, scadenze, checklist documentali ed
              esportazione PDF per l’istruttoria.
            </p>
          </div>
          <p className="tabular-nums text-[#0F2147] dark:text-[#E5C17B] font-bold">
            Archivio operativo aggiornato · {RICORSI_DATA.length} procedure censite
          </p>
        </div>
      </footer>

      {/* Modale Dettaglio + Checklist */}
      <AppealModal
        ricorso={activeRicorso}
        checkedDocs={checkedDocs}
        onToggleDoc={handleToggleDoc}
        onSetMultipleDocs={handleSetMultipleDocs}
        onClose={() => setActiveRicorso(null)}
      />
    </div>
  );
}
