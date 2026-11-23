import { jsPDF } from 'jspdf';
import type { RicorsoOperativo } from '../data/ricorsi';

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

/**
 * Esporta in PDF la scheda operativa di un singolo ricorso,
 * includendo lo stato interattivo della checklist documentale dell'utente.
 */
export function exportSingleRicorsoPDF(
  ricorso: RicorsoOperativo,
  checkedDocIds: Record<string, boolean>
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  };

  // Intestazione istituzionale bordeaux & oro
  doc.setFillColor(122, 28, 36); // #7A1C24
  doc.rect(0, 0, pageWidth, 14, 'F');
  doc.setFillColor(154, 116, 56); // #9A7438
  doc.rect(0, 14, pageWidth, 1.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('PORTALE OPERATIVO RICORSI SCOLASTICI  |  SCHEDA PROCEDURALE', margin, 9);

  y = 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(122, 28, 36);
  doc.text(
    `${ricorso.codice}  ·  ${ricorso.categoriaPersonale.join(', ')}  ·  ${ricorso.tipologia}`,
    margin,
    y
  );

  y += 7;
  doc.setFont('times', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(26, 25, 24);
  const titleLines = wrapText(doc, ricorso.titolo, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Riquadro stato e scadenza
  doc.setDrawColor(214, 206, 190);
  doc.setFillColor(250, 248, 245);
  doc.rect(margin, y, contentWidth, 20, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(92, 87, 82);
  doc.text(`Stato: ${ricorso.stato}`, margin + 4, y + 6.5);
  doc.text(`Valore indicativo: ${ricorso.valoreIndicativo}`, margin + contentWidth / 2, y + 6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Scadenza operativa: ${ricorso.scadenza}`, margin + 4, y + 13.5);
  y += 26;

  // Sintesi e Destinatari
  const addSectionTitle = (label: string) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(122, 28, 36);
    doc.text(label, margin, y);
    y += 2;
    doc.setDrawColor(225, 220, 212);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  addSectionTitle('Destinatari e Sintesi Operativa');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(26, 25, 24);
  const destLines = wrapText(doc, `Destinatari: ${ricorso.destinatari}`, contentWidth);
  doc.text(destLines, margin, y);
  y += destLines.length * 4.8 + 2;

  doc.setFont('helvetica', 'normal');
  const sintLines = wrapText(doc, ricorso.sintesiOperativa, contentWidth);
  doc.text(sintLines, margin, y);
  y += sintLines.length * 4.8 + 5;

  // Requisiti
  addSectionTitle('Requisiti di Accesso');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(26, 25, 24);
  ricorso.requisiti.forEach((req) => {
    const lines = wrapText(doc, `•  ${req}`, contentWidth - 2);
    ensureSpace(lines.length * 4.8 + 2);
    doc.text(lines, margin + 1, y);
    y += lines.length * 4.8 + 1.5;
  });
  y += 3;

  // Checklist Documenti
  const prontiCount = ricorso.documentiNecessari.filter((d) => checkedDocIds[d.id]).length;
  addSectionTitle(
    `Checklist Documenti Necessari (${prontiCount}/${ricorso.documentiNecessari.length} pronti)`
  );
  ricorso.documentiNecessari.forEach((d) => {
    const checked = Boolean(checkedDocIds[d.id]);
    const statusLabel = checked ? '[PRONTO]' : '[DA REPERIRE]';
    const reqTag = d.obbligatorio ? 'Obbligatorio' : 'Facoltativo';
    const titleStr = `${statusLabel} ${d.nome} (${reqTag})`;
    const titleDocLines = wrapText(doc, titleStr, contentWidth - 2);
    const noteLines = wrapText(doc, `Nota: ${d.note}`, contentWidth - 8);
    ensureSpace((titleDocLines.length + noteLines.length) * 4.6 + 3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(checked ? 22 : 122, checked ? 101 : 28, checked ? 52 : 36);
    doc.text(titleDocLines, margin + 1, y);
    y += titleDocLines.length * 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(92, 87, 82);
    doc.text(noteLines, margin + 6, y);
    y += noteLines.length * 4.2 + 2.5;
  });
  y += 3;

  // Iter Operativo
  addSectionTitle('Iter Operativo');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(26, 25, 24);
  ricorso.fasiOperative.forEach((fase, idx) => {
    const lines = wrapText(doc, `${idx + 1}. ${fase}`, contentWidth - 2);
    ensureSpace(lines.length * 4.8 + 2);
    doc.text(lines, margin + 1, y);
    y += lines.length * 4.8 + 1.5;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 113, 108);
    doc.text(
      `Scheda procedurale operativa · Pagina ${p} di ${totalPages}`,
      margin,
      pageHeight - 10
    );
  }

  doc.save(`${ricorso.codice.toLowerCase()}-scheda-operativa.pdf`);
}

/**
 * Esporta in PDF un dossier riepilogativo di tutti i ricorsi filtrati o consigliati dal simulatore.
 */
export function exportCatalogSummaryPDF(
  ricorsi: RicorsoOperativo[],
  titoloDossier: string,
  checkedDocs: Record<string, boolean>
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 22;

  doc.setFillColor(122, 28, 36);
  doc.rect(0, 0, pageWidth, 14, 'F');
  doc.setFillColor(154, 116, 56);
  doc.rect(0, 14, pageWidth, 1.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('PORTALE OPERATIVO RICORSI SCOLASTICI  |  RIEPILOGO DOSSIER', margin, 9);

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(26, 25, 24);
  doc.text(titoloDossier, margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(92, 87, 82);
  const oggi = new Date().toLocaleDateString('it-IT');
  doc.text(
    `Generato il ${oggi}  ·  Procedure incluse: ${ricorsi.length}  ·  Consultazione operativa`,
    margin,
    y
  );
  y += 8;

  ricorsi.forEach((r, index) => {
    const pronti = r.documentiNecessari.filter((d) => checkedDocs[d.id]).length;
    const synthLines = wrapText(doc, r.sintesiOperativa, contentWidth - 4);
    const blockHeight = 22 + synthLines.length * 4.4;

    if (y + blockHeight > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(214, 206, 190);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(122, 28, 36);
    doc.text(
      `${index + 1}. ${r.codice} · ${r.categoriaPersonale.join('/')} · Stato: ${r.stato}`,
      margin,
      y
    );
    y += 5;

    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(26, 25, 24);
    const tLines = wrapText(doc, r.titolo, contentWidth);
    doc.text(tLines, margin, y);
    y += tLines.length * 5.2 + 1;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 52, 49);
    doc.text(synthLines, margin, y);
    y += synthLines.length * 4.4 + 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(92, 87, 82);
    doc.text(
      `Scadenza: ${r.scadenza}  |  Documenti pronti: ${pronti}/${r.documentiNecessari.length}`,
      margin,
      y
    );
    y += 7;
  });

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 113, 108);
    doc.text(
      `Dossier operativo ricorsi scolastici · Pagina ${p} di ${totalPages}`,
      margin,
      pageHeight - 10
    );
  }

  doc.save('dossier-ricorsi-scolastici.pdf');
}
