/**
 * ============================================================================
 * ARCHIVIO DATI OPERATIVO — RICORSI DIRITTO SCOLASTICO
 * ============================================================================
 * GUIDA ALL'AGGIORNAMENTO:
 * Per aggiungere un nuovo ricorso, copiare un oggetto nell'array `RICORSI_DATA`
 * mantenendo la struttura dell'interfaccia `RicorsoOperativo`.
 *
 * Campi ammessi per i filtri:
 * - categoriaPersonale: array tra ['Docenti', 'ATA', 'Dirigenti']
 * - tipologia: 'Retribuzione e Indennità' | 'Carriera e Anzianità' | 'Graduatorie e Reclutamento' | 'Tutela Contrattuale'
 * - stato: 'Aperto' | 'In scadenza' | 'Preadesione' | 'Chiuso'
 *
 * Nota editoriale: Tutti i contenuti sono strettamente operativi e procedurali
 * (nessun riferimento a giurisprudenza, massime o pronunce storiche).
 * ============================================================================
 */

export type CategoriaPersonale = 'Docenti' | 'ATA' | 'Dirigenti';

export type TipologiaRicorso =
  | 'Retribuzione e Indennità'
  | 'Carriera e Anzianità'
  | 'Graduatorie e Reclutamento'
  | 'Tutela Contrattuale';

export type StatoRicorso = 'Aperto' | 'In scadenza' | 'Preadesione' | 'Chiuso';

export interface DocumentoRichiesto {
  id: string;
  nome: string;
  obbligatorio: boolean;
  note: string;
}

export interface RicorsoOperativo {
  id: string;
  codice: string;
  titolo: string;
  categoriaPersonale: CategoriaPersonale[];
  tipologia: TipologiaRicorso;
  stato: StatoRicorso;
  scadenza: string;
  destinatari: string;
  tipoContrattoTarget: ('Determinato' | 'Indeterminato' | 'Aspirante')[];
  valoreIndicativo: string;
  sintesiOperativa: string;
  requisiti: string[];
  documentiNecessari: DocumentoRichiesto[];
  fasiOperative: string[];
  canaleProcedurale: string;
}

export const RICORSI_DATA: RicorsoOperativo[] = [
  {
    id: 'carta-docente-precari',
    codice: 'RIC-DOC-01',
    titolo: 'Carta del Docente per Personale a Tempo Determinato',
    categoriaPersonale: ['Docenti'],
    tipologia: 'Retribuzione e Indennità',
    stato: 'Aperto',
    scadenza: '31/08/2027 (termine prescrizionale quinquennale)',
    destinatari: 'Docenti con contratti a tempo determinato al 30 giugno, al 31 agosto o supplenze temporanee continuative negli ultimi 5 anni scolastici.',
    tipoContrattoTarget: ['Determinato', 'Indeterminato'],
    valoreIndicativo: '500 € per anno scolastico',
    sintesiOperativa:
      'Azione operativa finalizzata all’accreditamento dell’importo annuale di 500 € sul borsellino elettronico dedicato all’aggiornamento professionale per le annualità di servizio prestate a tempo determinato.',
    requisiti: [
      'Aver sottoscritto almeno un contratto di supplenza annuale (31 agosto) o fino al termine delle attività didattiche (30 giugno) negli ultimi 5 anni.',
      'In alternativa, aver svolto supplenze brevi e saltuarie per almeno 180 giorni nell’anno scolastico o servizio continuativo dal 1° febbraio fino agli scrutini.',
      'Non aver già percepito il beneficio economico per la medesima annualità scolastica.'
    ],
    documentiNecessari: [
      {
        id: 'cd-1',
        nome: 'Copia dei contratti di lavoro a tempo determinato (ultimi 5 anni)',
        obbligatorio: true,
        note: 'Scaricabili dal portale Istanze Online o NoiPA / archivio personale.'
      },
      {
        id: 'cd-2',
        nome: 'Stato matricolare o certificato di servizio rilasciato dalle segreterie',
        obbligatorio: true,
        note: 'Deve riportare date esatte di inizio e fine contratto e codice meccanografico.'
      },
      {
        id: 'cd-3',
        nome: 'Copia documento d’identità e tessera sanitaria in corso di validità',
        obbligatorio: true,
        note: 'Fronte e retro leggibili in formato PDF.'
      },
      {
        id: 'cd-4',
        nome: 'Ricevuta di invio diffida stragiudiziale tramite PEC o raccomandata A/R',
        obbligatorio: false,
        note: 'Utile per attestare l’interruzione dei termini di prescrizione.'
      }
    ],
    fasiOperative: [
      'Raccolta integrale dei contratti di supplenza e dei certificati di servizio degli ultimi 5 anni.',
      'Invio della diffida interruttiva al Ministero dell’Istruzione e del Merito.',
      'Sottoscrizione della procura alle liti e del mandato operativo.',
      'Deposito telematico del fascicolo presso l’ufficio giudiziario competente per territorio.'
    ],
    canaleProcedurale: 'Procedura Giuslavoristica Individuale'
  },
  {
    id: 'rpd-supplenze-brevi',
    codice: 'RIC-DOC-02',
    titolo: 'Recupero Retribuzione Professionale Docenti (RPD) su Supplenze Brevi',
    categoriaPersonale: ['Docenti'],
    tipologia: 'Retribuzione e Indennità',
    stato: 'Aperto',
    scadenza: 'Prescrizione quinquennale dalla data del cedolino',
    destinatari: 'Docenti che hanno svolto incarichi di supplenza breve e saltuaria (inclusi incarichi temporanei COVID o sostituzioni brevi) negli ultimi 5 anni.',
    tipoContrattoTarget: ['Determinato', 'Indeterminato'],
    valoreIndicativo: 'Circa 174 € – 195 € lordi/mese',
    sintesiOperativa:
      'Procedura di recupero delle somme mensili relative alla Retribuzione Professionale Docenti non liquidate nei cedolini delle supplenze brevi e saltuarie.',
    requisiti: [
      'Aver prestato servizio su supplenze brevi e saltuarie negli ultimi 5 anni scolastici.',
      'Assenza della voce "Retribuzione Professionale Docenti (codice RPD)" nei cedolini NoiPA relativi ai periodi contestati.',
      'Possesso di tutti i cedolini mensili e dei rispettivi contratti individuali di lavoro.'
    ],
    documentiNecessari: [
      {
        id: 'rpd-1',
        nome: 'Cedolini stipendiali NoiPA relativi a tutti i mesi di supplenza breve',
        obbligatorio: true,
        note: 'In formato PDF originale scaricato dall’area riservata NoiPA.'
      },
      {
        id: 'rpd-2',
        nome: 'Contratti di supplenza breve e saltuaria firmati',
        obbligatorio: true,
        note: 'Comprensivi di eventuali proroghe contrattuali.'
      },
      {
        id: 'rpd-3',
        nome: 'Prospetto di calcolo riepilogativo delle giornate lavorate',
        obbligatorio: false,
        note: 'Elaborato sulla base dei giorni effettivi di servizio.'
      },
      {
        id: 'rpd-4',
        nome: 'Documento d’identità e codice fiscale',
        obbligatorio: true,
        note: 'In corso di validità.'
      }
    ],
    fasiOperative: [
      'Verifica della mancata corresponsione della voce RPD nei cedolini NoiPA.',
      'Quantificazione analitica degli arretrati dovuti su base giornaliera/mensile.',
      'Invio formale di messa in mora per il recupero delle differenze retributive.',
      'Iscrizione a ruolo del ricorso lavoristico per la liquidazione degli importi.'
    ],
    canaleProcedurale: 'Procedura Giuslavoristica Individuale'
  },
  {
    id: 'cia-ata-supplenze',
    codice: 'RIC-ATA-01',
    titolo: 'Recupero Compenso Individuale Accessorio (CIA) Personale ATA',
    categoriaPersonale: ['ATA'],
    tipologia: 'Retribuzione e Indennità',
    stato: 'Aperto',
    scadenza: 'Prescrizione quinquennale dai singoli ratei mensili',
    destinatari: 'Collaboratori Scolastici, Assistenti Amministrativi, Assistenti Tecnici e altri profili ATA con supplenze brevi e saltuarie.',
    tipoContrattoTarget: ['Determinato', 'Indeterminato'],
    valoreIndicativo: 'Circa 66 € – 76 € lordi/mese',
    sintesiOperativa:
      'Azione retributiva mirata al pagamento del Compenso Individuale Accessorio non erogato sui cedolini stipendiali delle supplenze brevi del personale ATA.',
    requisiti: [
      'Servizio prestato come personale ATA con contratti di supplenza breve e saltuaria negli ultimi 5 anni.',
      'Mancata presenza dell’emolumento CIA nel dettaglio competenze dei cedolini NoiPA.',
      'Disponibilità della documentazione contrattuale e retributiva.'
    ],
    documentiNecessari: [
      {
        id: 'cia-1',
        nome: 'Tutti i cedolini NoiPA dei periodi di supplenza breve ATA',
        obbligatorio: true,
        note: 'Verificare l’assenza della voce "Compenso Individuale Accessorio".'
      },
      {
        id: 'cia-2',
        nome: 'Contratti di lavoro a tempo determinato ATA',
        obbligatorio: true,
        note: 'Tutti i contratti brevi e le eventuali proroghe.'
      },
      {
        id: 'cia-3',
        nome: 'Documento d’identità e tessera sanitaria',
        obbligatorio: true,
        note: 'Copia chiara in formato PDF.'
      }
    ],
    fasiOperative: [
      'Controllo preliminare dei cedolini NoiPA e dei giorni di supplenza breve.',
      'Redazione del conteggio differenziale delle mensilità non retribuite.',
      'Trasmissione della diffida interruttiva di prescrizione all’Amministrazione.',
      'Avvio del procedimento per il recupero integrale delle spettanze.'
    ],
    canaleProcedurale: 'Procedura Giuslavoristica Individuale'
  },
  {
    id: 'ferie-non-godute',
    codice: 'RIC-DOC-03',
    titolo: 'Indennità Sostitutiva Ferie Non Godute (Supplenze al 30 Giugno)',
    categoriaPersonale: ['Docenti', 'ATA'],
    tipologia: 'Retribuzione e Indennità',
    stato: 'In scadenza',
    scadenza: 'Entro 10 anni dalla cessazione del singolo contratto',
    destinatari: 'Personale docente e ATA precario con contratti fino al 30 giugno o fino al termine delle lezioni che non abbia ricevuto la liquidazione delle ferie residue.',
    tipoContrattoTarget: ['Determinato', 'Indeterminato'],
    valoreIndicativo: 'Variabile (da 800 € a 1.800 €/anno)',
    sintesiOperativa:
      'Tutela economica finalizzata alla monetizzazione dei giorni di ferie maturati durante il contratto a tempo determinato e non fruiti prima della scadenza contrattuale.',
    requisiti: [
      'Aver svolto contratti al 30 giugno o fino al termine delle attività didattiche.',
      'Non aver ricevuto alcun invito formale e scritto dal Dirigente Scolastico a fruire delle ferie nei periodi di sospensione delle lezioni.',
      'Assenza di liquidazione dell’indennità sostitutiva nell’ultimo cedolino utile o in quelli successivi.'
    ],
    documentiNecessari: [
      {
        id: 'fer-1',
        nome: 'Contratti di supplenza al 30 giugno o al termine delle lezioni',
        obbligatorio: true,
        note: 'Relative a tutte le annualità di cui si richiede la monetizzazione.'
      },
      {
        id: 'fer-2',
        nome: 'Cedolini di giugno, luglio e agosto delle rispettive annualità',
        obbligatorio: true,
        note: 'Necessari per verificare l’eventuale liquidazione parziale.'
      },
      {
        id: 'fer-3',
        nome: 'Eventuali decreti o istanze di ferie presentate durante l’anno',
        obbligatorio: false,
        note: 'Richiedere alla segreteria l’estratto delle assenze/ferie fruite.'
      },
      {
        id: 'fer-4',
        nome: 'Attestato assenza di invito scritto alla fruizione delle ferie',
        obbligatorio: false,
        note: 'Verificabile tramite accesso agli atti della scuola di servizio.'
      }
    ],
    fasiOperative: [
      'Accesso agli atti presso l’istituto scolastico per l’estratto ferie maturate e godute.',
      'Calcolo dei giorni residui non fruiti al netto delle giornate di sospensione didattica.',
      'Invio di istanza di liquidazione e messa in mora al MIM e all’Istituto.',
      'Deposito del ricorso individuale per l’ottenimento dell’indennità sostitutiva.'
    ],
    canaleProcedurale: 'Procedura Giuslavoristica Individuale'
  },
  {
    id: 'ricostruzione-carriera-integrale',
    codice: 'RIC-RUO-01',
    titolo: 'Ricostruzione di Carriera Integrale (Valutazione Pre-Ruolo 100%)',
    categoriaPersonale: ['Docenti', 'ATA'],
    tipologia: 'Carriera e Anzianità',
    stato: 'Aperto',
    scadenza: 'Sempre attivo (verificare prescrizione quinquennale arretrati)',
    destinatari: 'Docenti e personale ATA immessi in ruolo con più di 4 anni di servizio pre-ruolo (o servizio su scuola paritaria / altri ordini).',
    tipoContrattoTarget: ['Indeterminato'],
    valoreIndicativo: 'Anticipo scatto stipendiale + arretrati',
    sintesiOperativa:
      'Procedura volta al riconoscimento integrale di tutto il servizio pre-ruolo (superando il taglio del terzo oltre i primi 4 anni) per l’immediato inserimento nella fascia stipendiale corretta.',
    requisiti: [
      'Essere personale di ruolo (docente o ATA) con decreto di ricostruzione di carriera già emesso.',
      'Aver maturato più di 4 anni di servizio pre-ruolo riconosciuto ai fini giuridici ed economici.',
      'Presenza della decurtazione del terzo sui servizi eccedenti il quarto anno nel decreto di ricostruzione.'
    ],
    documentiNecessari: [
      {
        id: 'rc-1',
        nome: 'Decreto di ricostruzione di carriera emesso dalla scuola o ATP',
        obbligatorio: true,
        note: 'Documento fondamentale per verificare il calcolo dei servizi pre-ruolo.'
      },
      {
        id: 'rc-2',
        nome: 'Contratto di immissione in ruolo e conferma in ruolo',
        obbligatorio: true,
        note: 'Comprensivo della data di decorrenza giuridica ed economica.'
      },
      {
        id: 'rc-3',
        nome: 'Elenco completo o certificati dei servizi pre-ruolo svolti',
        obbligatorio: true,
        note: 'Inclusi eventuali contratti su scuole paritarie o servizio militare.'
      },
      {
        id: 'rc-4',
        nome: 'Ultimo cedolino NoiPA e cedolini degli ultimi 5 anni',
        obbligatorio: true,
        note: 'Per la determinazione della fascia stipendiale in godimento.'
      }
    ],
    fasiOperative: [
      'Analisi tecnica del decreto di ricostruzione di carriera e ricalcolo dell’anzianità effettiva.',
      'Quantificazione del danno economico mensile e del salto di gradone stipendiale.',
      'Invio della diffida per la rettifica del decreto di inquadramento.',
      'Avvio del procedimento per l’adeguamento stipendiale e il recupero degli arretrati.'
    ],
    canaleProcedurale: 'Procedura Giuslavoristica Individuale'
  },
  {
    id: 'recupero-anno-2013',
    codice: 'RIC-RUO-02',
    titolo: 'Recupero Anno 2013 ai Fini della Progressione Economica',
    categoriaPersonale: ['Docenti', 'ATA'],
    tipologia: 'Carriera e Anzianità',
    stato: 'Aperto',
    scadenza: 'Prescrizione quinquennale sulle differenze retributive',
    destinatari: 'Personale docente, educativo e ATA in servizio nell’anno solare 2013 (di ruolo o con contratto a tempo determinato poi confermato in ruolo).',
    tipoContrattoTarget: ['Indeterminato'],
    valoreIndicativo: 'Anticipo di 1 anno del passaggio di fascia',
    sintesiOperativa:
      'Azione operativa per ottenere il computo dell’anno 2013 ai fini della maturazione delle fasce stipendiali e degli scatti di anzianità, superando il blocco contrattuale dell’annualità.',
    requisiti: [
      'Aver svolto servizio scolastico effettivo durante l’anno solare 2013 (almeno 180 giorni o ruolo attivo).',
      'Mancato conteggio del 2013 nel decreto di ricostruzione di carriera o nel prospetto di progressione economica.',
      'Verifica dell’impatto economico sulla fascia stipendiale attuale o prossima.'
    ],
    documentiNecessari: [
      {
        id: 'a13-1',
        nome: 'Decreto di ricostruzione di carriera o stato matricolare',
        obbligatorio: true,
        note: 'Deve evidenziare la mancata valutazione dell’anno 2013.'
      },
      {
        id: 'a13-2',
        nome: 'Certificato di servizio relativo all’a.s. 2012/2013 e 2013/2014',
        obbligatorio: true,
        note: 'Indispensabile se nel 2013 il servizio era a tempo determinato.'
      },
      {
        id: 'a13-3',
        nome: 'Ultimo cedolino stipendiale NoiPA',
        obbligatorio: true,
        note: 'Riportante lo scaglione di anzianità attualmente percepito.'
      }
    ],
    fasiOperative: [
      'Simulazione di carriera con inclusione dell’anno 2013 e verifica del nuovo gradone.',
      'Notifica di istanza di riesame e interruzione dei termini prescrittivi.',
      'Predisposizione dei conteggi di differenza retributiva.',
      'Deposito del ricorso per il riconoscimento giuridico ed economico dell’annualità.'
    ],
    canaleProcedurale: 'Procedura Giuslavoristica Individuale'
  },
  {
    id: 'restituzione-tfr-precari',
    codice: 'RIC-DOC-04',
    titolo: 'Restituzione Trattenuta TFR 2,5% per Contratti a Tempo Determinato',
    categoriaPersonale: ['Docenti', 'ATA'],
    tipologia: 'Retribuzione e Indennità',
    stato: 'Aperto',
    scadenza: 'Prescrizione quinquennale dai cedolini',
    destinatari: 'Docenti e personale ATA con contratti a tempo determinato soggetti alla trattenuta previdenziale del 2,5% sull’80% della retribuzione lorda.',
    tipoContrattoTarget: ['Determinato'],
    valoreIndicativo: 'Circa 350 € – 500 € per anno di supplenza',
    sintesiOperativa:
      'Ricorso operativo finalizzato al rimborso della quota del 2,5% trattenuta sui cedolini mensili a titolo di contributo TFR a carico del lavoratore precario.',
    requisiti: [
      'Essere stati assunti con contratto a tempo determinato nella scuola statale negli ultimi 5 anni.',
      'Riscontro della voce di trattenuta "Opera Previdenza / Fondo Credito / TFR 2,5%" nei cedolini NoiPA.',
      'Regime previdenziale TFR applicato al contratto a termine.'
    ],
    documentiNecessari: [
      {
        id: 'tfr-1',
        nome: 'Cedolini stipendiali NoiPA degli ultimi 5 anni (dettaglio ritenute)',
        obbligatorio: true,
        note: 'Sezione ritenute previdenziali/assistenziali ben leggibile.'
      },
      {
        id: 'tfr-2',
        nome: 'Contratti di lavoro a tempo determinato',
        obbligatorio: true,
        note: 'Per ciascun anno scolastico oggetto di verifica.'
      },
      {
        id: 'tfr-3',
        nome: 'Certificazioni Uniche (CU) degli anni interessati',
        obbligatorio: false,
        note: 'Utili per riscontro fiscale complessivo.'
      }
    ],
    fasiOperative: [
      'Esame analitico delle ritenute mensili riportate nei cedolini NoiPA.',
      'Calcolo esatto delle trattenute del 2,5% operate nell’arco temporale utile.',
      'Invio diffida per la cessazione immediata della trattenuta e rimborso.',
      'Azione giudiziale per la restituzione delle somme.'
    ],
    canaleProcedurale: 'Procedura Giuslavoristica Individuale'
  },
  {
    id: 'bonus-formazione-ata',
    codice: 'RIC-ATA-02',
    titolo: 'Estensione Bonus Formazione 500 € al Personale ATA',
    categoriaPersonale: ['ATA'],
    tipologia: 'Retribuzione e Indennità',
    stato: 'Preadesione',
    scadenza: 'Finestra aperta per preadesioni a.s. corrente',
    destinatari: 'Personale ATA di ruolo e precario (Collaboratori Scolastici, Assistenti Amministrativi e Tecnici, DSGA) escluso dal beneficio formativo.',
    tipoContrattoTarget: ['Determinato', 'Indeterminato'],
    valoreIndicativo: '500 € per anno scolastico',
    sintesiOperativa:
      'Iniziativa collettiva e individuale per riconoscere anche al personale ATA il diritto a fruire dello strumento economico di aggiornamento professionale e digitale.',
    requisiti: [
      'Appartenere al comparto Istruzione e Ricerca con qualifica di personale ATA (di ruolo o con supplenza annuale/al 30 giugno).',
      'Aver svolto attività di servizio e/o formazione obbligatoria senza dotazione economica dedicata.',
      'Iscrizione e invio dell’istanza preliminare di accesso al beneficio.'
    ],
    documentiNecessari: [
      {
        id: 'bata-1',
        nome: 'Contratto di assunzione (a tempo indeterminato o determinato)',
        obbligatorio: true,
        note: 'Attestante il profilo professionale ATA.'
      },
      {
        id: 'bata-2',
        nome: 'Attestati di corsi di formazione o ricevute spese didattiche/digitali',
        obbligatorio: false,
        note: 'Facoltativi ma utili a documentare le spese sostenute.'
      },
      {
        id: 'bata-3',
        nome: 'Copia documento d’identità e tessera sanitaria',
        obbligatorio: true,
        note: 'In formato PDF.'
      }
    ],
    fasiOperative: [
      'Compilazione della scheda di preadesione e verifica dell’anzianità di servizio.',
      'Trasmissione della diffida stragiudiziale al Ministero.',
      'Consolidamento del fascicolo documentale al raggiungimento della soglia operativa.',
      'Deposito dell’azione di tutela.'
    ],
    canaleProcedurale: 'Preadesione Collettiva / Azione Giuslavoristica'
  },
  {
    id: 'abuso-contratti-termine',
    codice: 'RIC-TUT-01',
    titolo: 'Tutela per Reiterazione Contratti a Termine oltre 36 Mesi',
    categoriaPersonale: ['Docenti', 'ATA'],
    tipologia: 'Tutela Contrattuale',
    stato: 'Aperto',
    scadenza: 'Entro 5 anni dal superamento della soglia di 36 mesi',
    destinatari: 'Docenti e personale ATA precario con almeno 36 mesi di servizio su posto vacante e disponibile (o su supplenze ripetute sullo stesso organico).',
    tipoContrattoTarget: ['Determinato', 'Indeterminato'],
    valoreIndicativo: 'Indennità risarcitoria (da 2,5 a 12 mensilità)',
    sintesiOperativa:
      'Ricorso operativo volto all’ottenimento del risarcimento economico per l’abusiva successione di contratti a termine oltre il limite legale dei 36 mesi senza stabilizzazione.',
    requisiti: [
      'Aver superato 36 mesi (anche non continuativi) di servizio a tempo determinato su posto vacante (31 agosto) o assimilato.',
      'Non aver ancora ottenuto l’immissione in ruolo oppure averla ottenuta successivamente alla maturazione del limite.',
      'Documentazione completa della sequenza contrattuale.'
    ],
    documentiNecessari: [
      {
        id: 'ab-1',
        nome: 'Tutti i contratti a tempo determinato stipulati nel percorso scolastico',
        obbligatorio: true,
        note: 'Evidenziare la tipologia di posto (organico di diritto / fatto).'
      },
      {
        id: 'ab-2',
        nome: 'Stato matricolare o certificazione completa SIDI dei servizi',
        obbligatorio: true,
        note: 'Richiedibile alla scuola di titolarità o ultimo servizio.'
      },
      {
        id: 'ab-3',
        nome: 'Ultimi cedolini stipendiali per il calcolo dell’ultima retribuzione globale di fatto',
        obbligatorio: true,
        note: 'Necessario per quantificare le mensilità risarcitorie.'
      }
    ],
    fasiOperative: [
      'Ricostruzione cronologica di tutti i contratti a tempo determinato.',
      'Verifica della natura dei posti ricoperti (vacanti e disponibili).',
      'Calcolo dell’indennità risarcitoria parametrica sulle mensilità lorde.',
      'Avvio del procedimento innanzi al giudice competente.'
    ],
    canaleProcedurale: 'Procedura Giuslavoristica Individuale'
  },
  {
    id: 'algoritmo-gps-supplenze',
    codice: 'RIC-GRAD-01',
    titolo: 'Contestazione Algoritmo GPS e Errata Assegnazione Supplenze',
    categoriaPersonale: ['Docenti'],
    tipologia: 'Graduatorie e Reclutamento',
    stato: 'In scadenza',
    scadenza: 'Entro 60 giorni dal bollettino di nomina o entro l’anno scolastico',
    destinatari: 'Docenti iscritti nelle Graduatorie Provinciali per le Supplenze (GPS) scavalcati da candidati con punteggio inferiore o esclusi dai turni successivi.',
    tipoContrattoTarget: ['Determinato', 'Aspirante'],
    valoreIndicativo: 'Riconoscimento punteggio giuridico + retribuzione mancata',
    sintesiOperativa:
      'Intervento urgente per contestare gli errori di assegnazione del sistema informatizzato nella distribuzione delle supplenze annuali o fino al termine delle attività.',
    requisiti: [
      'Essere regolarmente inseriti nelle GPS della provincia di riferimento per l’anno scolastico corrente.',
      'Aver subito l’assegnazione di una sede a un aspirante con punteggio inferiore su preferenze espresse.',
      'Aver inviato tempestivo reclamo all’Ufficio Scolastico Provinciale (ATP).'
    ],
    documentiNecessari: [
      {
        id: 'gps-1',
        nome: 'Ricevuta PDF della domanda di scelta delle 150 preferenze (Istanze Online)',
        obbligatorio: true,
        note: 'Riporta l’ordine esatto delle scuole e classi di concorso richieste.'
      },
      {
        id: 'gps-2',
        nome: 'Bollettino ufficiale delle nomine pubblicate dall’ATP',
        obbligatorio: true,
        note: 'Evidenziando il nominativo con punteggio inferiore assegnatario.'
      },
      {
        id: 'gps-3',
        nome: 'Copia del reclamo inviato via PEC all’Ambito Territoriale',
        obbligatorio: true,
        note: 'Con ricevuta di accettazione e consegna.'
      }
    ],
    fasiOperative: [
      'Confronto immediato tra le preferenze espresse e i bollettini pubblicati dall’ATP.',
      'Presentazione di reclamo motivato in autotutela entro 5 giorni dalla pubblicazione.',
      'Verifica delle disponibilità sopravvenute non attribuite nei turni successivi.',
      'Attivazione del ricorso urgente o del recupero giuridico-economico.'
    ],
    canaleProcedurale: 'Procedura d’Urgenza / Tutela Graduatorie'
  },
  {
    id: 'mobilita-trasferimenti',
    codice: 'RIC-GRAD-02',
    titolo: 'Rettifica Punteggi e Vincoli Mobilità Docenti e ATA',
    categoriaPersonale: ['Docenti', 'ATA'],
    tipologia: 'Graduatorie e Reclutamento',
    stato: 'Aperto',
    scadenza: 'Entro 10 giorni dal provvedimento di convalida / 60 giorni dai bollettini',
    destinatari: 'Personale di ruolo docente e ATA che abbia subito decurtazioni di punteggio (es. servizio pre-ruolo o esigenze di famiglia) o blocchi illegittimi nella mobilità.',
    tipoContrattoTarget: ['Indeterminato'],
    valoreIndicativo: 'Assegnazione sede richiesta / Sblocco vincolo',
    sintesiOperativa:
      'Assistenza procedurale per l’impugnazione degli esiti della mobilità territoriale o professionale e la correzione della tabella di valutazione dei titoli e dei servizi.',
    requisiti: [
      'Aver presentato regolare domanda di mobilità territoriale o professionale nei termini ministeriali.',
      'Riscontro di errori nel punteggio convalidato dall’Ufficio Scolastico o blocco per vincolo triennale non applicabile.',
      'Invio del reclamo formale nei termini previsti dall’ordinanza annuale.'
    ],
    documentiNecessari: [
      {
        id: 'mob-1',
        nome: 'Domanda di mobilità presentata su Istanze Online con allegati',
        obbligatorio: true,
        note: 'Comprensiva delle dichiarazioni dei servizi e dei titoli di famiglia.'
      },
      {
        id: 'mob-2',
        nome: 'Notifica di convalida punteggio ricevuta dall’ATP',
        obbligatorio: true,
        note: 'Da confrontare con i punti spettanti.'
      },
      {
        id: 'mob-3',
        nome: 'Reclamo presentato all’Ambito Territoriale nei 10 giorni',
        obbligatorio: true,
        note: 'Con eventuale risposta dell’ufficio.'
      },
      {
        id: 'mob-4',
        nome: 'Bollettino dei movimenti pubblicati per la provincia',
        obbligatorio: false,
        note: 'Utile per individuare eventuali controinteressati.'
      }
    ],
    fasiOperative: [
      'Audit del punteggio di mobilità rispetto all’anzianità effettiva e alle precedenze.',
      'Redazione e deposito del reclamo amministrativo nei termini perentori.',
      'Analisi della capienza dei posti vacanti sulle sedi richieste.',
      'Avvio dell’azione per il trasferimento o l’assegnazione provvisoria.'
    ],
    canaleProcedurale: 'Procedura Amministrativa e Giuslavoristica'
  },
  {
    id: 'concorso-dirigenti-titoli',
    codice: 'RIC-DIR-01',
    titolo: 'Concorso Dirigenti Scolastici: Valutazione Titoli e Accesso Graduatorie',
    categoriaPersonale: ['Dirigenti', 'Docenti'],
    tipologia: 'Graduatorie e Reclutamento',
    stato: 'Preadesione',
    scadenza: 'Entro 60 giorni dalla pubblicazione della graduatoria concorsuale',
    destinatari: 'Dirigenti Scolastici e candidati ai concorsi ordinari o riservati a Dirigente Scolastico con contestazioni sulla valutazione dei titoli o sulle prove.',
    tipoContrattoTarget: ['Indeterminato', 'Aspirante'],
    valoreIndicativo: 'Rettifica punteggio / Inserimento in graduatoria',
    sintesiOperativa:
      'Tutela procedurale dedicata ai candidati delle procedure concorsuali per Dirigente Scolastico in merito alla corretta attribuzione dei punteggi per titoli culturali, di servizio e alla trasparenza delle valutazioni.',
    requisiti: [
      'Aver partecipato alle prove del concorso ordinario o riservato per Dirigente Scolastico.',
      'Aver riscontrato mancata o ridotta valutazione di titoli di servizio, incarichi di vicario/collaboratore o titoli accademici.',
      'Aver presentato istanza formale di accesso agli atti entro i termini.'
    ],
    documentiNecessari: [
      {
        id: 'dir-1',
        nome: 'Domanda di partecipazione al concorso e elenco titoli dichiarati',
        obbligatorio: true,
        note: 'Estratta dal portale concorsuale o Istanze Online.'
      },
      {
        id: 'dir-2',
        nome: 'Istanza di accesso agli atti e verbali della commissione esaminatrice',
        obbligatorio: true,
        note: 'Comprensiva della griglia di valutazione individuale.'
      },
      {
        id: 'dir-3',
        nome: 'Certificazioni dei titoli accademici e degli incarichi dirigenziali/vicari non valutati',
        obbligatorio: true,
        note: 'Lettere di incarico e decreti del Dirigente Scolastico.'
      }
    ],
    fasiOperative: [
      'Presentazione dell’istanza di accesso agli atti ai sensi della normativa sulla trasparenza.',
      'Verifica analitica dei verbali e della scheda di attribuzione punteggi.',
      'Invio di istanza di riesame in autotutela alla Commissione / USR competente.',
      'Predisposizione del ricorso per la rettifica della graduatoria di merito.'
    ],
    canaleProcedurale: 'Procedura Concorsuale / Tutela Amministrativa'
  },
  {
    id: 'temporizzazione-dsga',
    codice: 'RIC-ATA-03',
    titolo: 'Temporizzazione e Inquadramento Economico DSGA',
    categoriaPersonale: ['ATA', 'Dirigenti'],
    tipologia: 'Carriera e Anzianità',
    stato: 'Aperto',
    scadenza: 'Prescrizione quinquennale sugli arretrati retributivi',
    destinatari: 'Direttori dei Servizi Generali e Amministrativi (DSGA) transitati dal ruolo di Assistente Amministrativo con perdita o ritardo nella progressione stipendiale.',
    tipoContrattoTarget: ['Indeterminato'],
    valoreIndicativo: 'Riallineamento fascia + arretrati quinquennali',
    sintesiOperativa:
      'Procedura di verifica e riallineamento della fascia stipendiale per il personale transitato nell’area dei DSGA, volta a evitare l’azzeramento dell’anzianità economica maturata nel profilo di provenienza.',
    requisiti: [
      'Essere in servizio nel ruolo di DSGA a seguito di passaggio di area dal profilo di Assistente Amministrativo.',
      'Presenza di un decreto di ricostruzione di carriera con inquadramento nella fascia iniziale o perdita parziale dell’anzianità.',
      'Disponibilità del vecchio e nuovo decreto di inquadramento.'
    ],
    documentiNecessari: [
      {
        id: 'dsga-1',
        nome: 'Decreto di passaggio al ruolo di DSGA e nuovo inquadramento economico',
        obbligatorio: true,
        note: 'Riportante la decorrenza giuridica ed economica del nuovo profilo.'
      },
      {
        id: 'dsga-2',
        nome: 'Precedente decreto di ricostruzione di carriera da Assistente Amministrativo',
        obbligatorio: true,
        note: 'Indispensabile per il raffronto del maturato economico.'
      },
      {
        id: 'dsga-3',
        nome: 'Cedolini NoiPA prima e dopo il passaggio di qualifica',
        obbligatorio: true,
        note: 'Per la verifica dello stipendio tabellare e dell’indennità di direzione.'
      }
    ],
    fasiOperative: [
      'Confronto tecnico tra il maturato economico precedente e il nuovo inquadramento.',
      'Calcolo della temporizzazione spettante e delle differenze sugli scatti.',
      'Invio di istanza formale di rettifica del decreto stipendiale.',
      'Avvio dell’azione per il corretto inquadramento e gli arretrati.'
    ],
    canaleProcedurale: 'Procedura Giuslavoristica Individuale'
  }
];
