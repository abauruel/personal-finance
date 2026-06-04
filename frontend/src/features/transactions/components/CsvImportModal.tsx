import { useMemo, useState, type ChangeEvent } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import type { Account, Category, CreateTransactionDto, Transaction } from '../../../types/models.types';
import { useSettings } from '../../../contexts/SettingsContext';
import { getTransactionMessages } from '../../../lib/featureLocale';

GlobalWorkerOptions.workerSrc = pdfWorker;

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  existingTransactions: Transaction[];
  onImport: (transactions: CreateTransactionDto[]) => Promise<void>;
  isImporting: boolean;
}

interface ParsedImportRow {
  date: string;
  description: string;
  amount: number;
  paymentType: CreateTransactionDto['paymentType'];
  status: NonNullable<CreateTransactionDto['status']>;
  categoryName?: string;
  notes?: string;
  debugInfo?: string;
}

interface PreviewRow {
  index: number;
  valid: boolean;
  duplicate: boolean;
  reason?: string;
  parsed?: ParsedImportRow;
  mapped?: CreateTransactionDto;
}

type ImportFormat = 'csv' | 'ofx' | 'pdf' | 'unknown';
type ImportPaymentKind = 'DEBIT' | 'CREDIT' | '';

type PdfTextItem = {
  str: string;
  transform: number[];
};

type PositionedPdfItem = {
  text: string;
  x: number;
  y: number;
};

type GroupedPdfLine = {
  y: number;
  items: PositionedPdfItem[];
};

type PdfColumns = {
  headerLineIndex: number;
  historyX: number;
  cityX: number | null;
  rsX: number;
};

type RsAmountMatch = {
  amount: number;
  rawValue: string;
  x: number;
};

type ParsedPdfLine = {
  date: string;
  amount: number;
  description: string;
};

const PAYMENT_TYPE_MAP: Record<string, CreateTransactionDto['paymentType']> = {
  DEBIT: 'DEBIT',
  DEBITO: 'DEBIT',
  D: 'DEBIT',
  CREDIT: 'CREDIT',
  CREDITO: 'CREDIT',
  C: 'CREDIT',
  PIX: 'PIX',
  CASH: 'CASH',
  DINHEIRO: 'CASH',
  TRANSFER: 'TRANSFER',
  TRANSFERENCIA: 'TRANSFER',
};

const STATUS_MAP: Record<string, NonNullable<CreateTransactionDto['status']>> = {
  PENDING: 'PENDING',
  PENDENTE: 'PENDING',
  PAID: 'PAID',
  PAGO: 'PAID',
  CANCELLED: 'CANCELLED',
  CANCELED: 'CANCELLED',
  CANCELADO: 'CANCELLED',
};

function normalizeHeader(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function parseAmount(value: string): number | null {
  if (!value) return null;
  let normalized = value.trim();
  const isNegative = normalized.includes('(') || normalized.startsWith('-');
  normalized = normalized.replace(/[()R$\s]/g, '');

  if (normalized.includes(',') && normalized.includes('.')) {
    normalized = normalized.replace(/\./g, '').replace(',', '.');
  } else if (normalized.includes(',')) {
    normalized = normalized.replace(',', '.');
  }

  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) return null;
  return isNegative ? -Math.abs(parsed) : parsed;
}

function parseDateToIso(value: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const br = trimmed.match(/^((\d{2})[\/-](\d{2})[\/-](\d{4}))$/);
  if (br) {
    const dd = br[2];
    const mm = br[3];
    const yyyy = br[4];
    return `${yyyy}-${mm}-${dd}`;
  }

  const brShortYear = trimmed.match(/^((\d{2})[\/-](\d{2})[\/-](\d{2}))$/);
  if (brShortYear) {
    const dd = brShortYear[2];
    const mm = brShortYear[3];
    const yy = Number(brShortYear[4]);
    const yyyy = yy >= 70 ? 1900 + yy : 2000 + yy;
    return `${yyyy}-${mm}-${dd}`;
  }

  const brNoYear = trimmed.match(/^((\d{2})[\/-](\d{2}))$/);
  if (brNoYear) {
    const dd = brNoYear[2];
    const mm = brNoYear[3];
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    let year = now.getFullYear();

    // Invoice transactions close to year boundaries often belong to previous year.
    if (currentMonth <= 2 && Number(mm) >= 11) {
      year -= 1;
    }

    return `${year}-${mm}-${dd}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function buildTransactionKey(date: string, description: string, amount: number): string {
  return `${date}|${normalizeText(description)}|${amount.toFixed(2)}`;
}

function detectFormat(file: File): ImportFormat {
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv')) return 'csv';
  if (name.endsWith('.ofx')) return 'ofx';
  if (name.endsWith('.pdf')) return 'pdf';
  return 'unknown';
}

function parseCsvText(text: string): ParsedImportRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) return [];

  const delimiter = (lines[0].match(/;/g) || []).length > (lines[0].match(/,/g) || []).length ? ';' : ',';
  const headers = lines[0].split(delimiter).map((h) => normalizeHeader(h));

  const dateIdx = headers.findIndex((h) => ['date', 'data', 'datatransacao'].includes(h));
  const descIdx = headers.findIndex((h) => ['description', 'descricao', 'historico', 'desc'].includes(h));
  const amountIdx = headers.findIndex((h) => ['amount', 'valor', 'value'].includes(h));
  const paymentTypeIdx = headers.findIndex((h) => ['paymenttype', 'tipopagamento', 'tipo'].includes(h));
  const statusIdx = headers.findIndex((h) => ['status', 'situacao'].includes(h));
  const categoryIdx = headers.findIndex((h) => ['category', 'categoria'].includes(h));
  const notesIdx = headers.findIndex((h) => ['notes', 'nota', 'observacao', 'obs'].includes(h));

  const parsed: ParsedImportRow[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i].split(delimiter).map((c) => c.trim());

    const isoDate = parseDateToIso(cols[dateIdx] || '');
    const description = cols[descIdx] || '';
    const amount = parseAmount(cols[amountIdx] || '');

    if (!isoDate || !description || amount === null) {
      continue;
    }

    const paymentRaw = normalizeHeader(cols[paymentTypeIdx] || '');
    const statusRaw = normalizeHeader(cols[statusIdx] || '');

    const paymentType = PAYMENT_TYPE_MAP[paymentRaw.toUpperCase()] || (amount < 0 ? 'DEBIT' : 'CREDIT');
    const status = STATUS_MAP[statusRaw.toUpperCase()] || 'PAID';

    parsed.push({
      date: isoDate,
      description,
      amount,
      paymentType,
      status,
      categoryName: categoryIdx >= 0 ? cols[categoryIdx] : undefined,
      notes: notesIdx >= 0 ? cols[notesIdx] : undefined,
    });
  }

  return parsed;
}

function getOfxTagValue(section: string, tag: string): string {
  const match = section.match(new RegExp(`<${tag}>([^<\r\n]+)`, 'i'));
  return match?.[1]?.trim() || '';
}

function parseOfxDate(value: string): string | null {
  if (!value) return null;
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length < 8) return null;
  const yyyy = digits.slice(0, 4);
  const mm = digits.slice(4, 6);
  const dd = digits.slice(6, 8);
  return `${yyyy}-${mm}-${dd}`;
}

function parseOfxText(text: string): ParsedImportRow[] {
  const segments = text.split(/<STMTTRN>/i).slice(1);
  const rows: ParsedImportRow[] = [];

  segments.forEach((segment) => {
    const date = parseOfxDate(getOfxTagValue(segment, 'DTPOSTED'));
    const amountRaw = getOfxTagValue(segment, 'TRNAMT');
    const amount = parseAmount(amountRaw);
    const description = getOfxTagValue(segment, 'MEMO') || getOfxTagValue(segment, 'NAME');

    if (!date || amount === null || !description) {
      return;
    }

    rows.push({
      date,
      description,
      amount,
      paymentType: amount < 0 ? 'DEBIT' : 'CREDIT',
      status: 'PAID',
      notes: `OFX:${getOfxTagValue(segment, 'FITID')}`,
    });
  });

  return rows;
}

function extractLinesFromPdfItems(items: PdfTextItem[]): string[] {
  const grouped = new Map<number, PdfTextItem[]>();

  items.forEach((item) => {
    const y = Math.round(item.transform[5]);
    const current = grouped.get(y) || [];
    current.push(item);
    grouped.set(y, current);
  });

  return [...grouped.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, parts]) =>
      parts
        .sort((a, b) => a.transform[4] - b.transform[4])
        .map((part) => part.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean);
}

function toPositionedPdfItems(items: PdfTextItem[]): PositionedPdfItem[] {
  return items
    .map((item) => ({
      text: item.str.trim(),
      x: item.transform[4],
      y: item.transform[5],
    }))
    .filter((item) => item.text.length > 0);
}

function groupPositionedPdfItemsByLine(items: PositionedPdfItem[]): GroupedPdfLine[] {
  const sorted = [...items].sort((a, b) => b.y - a.y);
  const lines: GroupedPdfLine[] = [];
  const yTolerance = 2;

  sorted.forEach((item) => {
    const targetLine = lines.find((line) => Math.abs(line.y - item.y) <= yTolerance);
    if (targetLine) {
      targetLine.items.push(item);
      return;
    }

    lines.push({ y: item.y, items: [item] });
  });

  return lines
    .sort((a, b) => b.y - a.y)
    .map((line) => ({
      ...line,
      items: line.items.sort((a, b) => a.x - b.x),
    }));
}

function getGroupedPdfLineText(line: GroupedPdfLine): string {
  return line.items
    .map((item) => item.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectPdfColumns(lines: GroupedPdfLine[]): PdfColumns | null {
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const text = getGroupedPdfLineText(line);
    const normalized = normalizeHeader(text);

    const isHeader = normalized.includes('historico')
      && normalized.includes('data')
      && (normalized.includes('lancamentos') || normalized.includes('cidade'));

    if (!isHeader) {
      continue;
    }

    const historyItem = line.items.find((item) => normalizeHeader(item.text).includes('historico'));
    const cityItem = line.items.find((item) => normalizeHeader(item.text).includes('cidade'));
    const moneyItems = line.items.filter((item) => item.text.includes('$'));
    const rsX = moneyItems.length > 0
      ? Math.max(...moneyItems.map((item) => item.x))
      : Math.max(...line.items.map((item) => item.x));

    if (!historyItem) {
      continue;
    }

    return {
      headerLineIndex: i,
      historyX: historyItem.x,
      cityX: cityItem ? cityItem.x : null,
      rsX,
    };
  }

  return null;
}

function extractHistoryFromLine(line: GroupedPdfLine, columns: PdfColumns): string {
  const historyEndX = columns.cityX ?? (columns.rsX - 120);
  const raw = line.items
    .filter((item) => item.x >= columns.historyX - 8 && item.x < historyEndX - 8)
    .map((item) => item.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return raw.replace(/^\d{2}[\/-]\d{2}(?:[\/-](?:\d{2}|\d{4}))?\s*/, '').trim();
}

function extractAmountFromRsColumn(line: GroupedPdfLine, columns: PdfColumns): RsAmountMatch | null {
  const amountCandidates = line.items
    .filter((item) => item.x >= columns.rsX - 45)
    .map((item) => ({ item, amount: parseAmount(item.text) }))
    .filter((entry) => entry.amount !== null) as Array<{ item: PositionedPdfItem; amount: number }>;

  if (amountCandidates.length === 0) {
    return null;
  }

  const selected = amountCandidates.sort((a, b) => b.item.x - a.item.x)[0];
  return {
    amount: selected.amount,
    rawValue: selected.item.text,
    x: selected.item.x,
  };
}

function parsePdfTableRows(lines: GroupedPdfLine[]): ParsedImportRow[] {
  const columns = detectPdfColumns(lines);
  if (!columns) {
    return [];
  }

  const rows: ParsedImportRow[] = [];

  for (let i = columns.headerLineIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    const lineText = getGroupedPdfLineText(line);
    const dateMatch = lineText.match(/\b\d{2}[\/-]\d{2}(?:[\/-](?:\d{2}|\d{4}))?\b/);
    const historyText = extractHistoryFromLine(line, columns);

    if (!dateMatch) {
      if (historyText && rows.length > 0 && !isLikelySummaryLine(historyText)) {
        const last = rows[rows.length - 1];
        last.description = `${last.description} ${historyText}`.replace(/\s+/g, ' ').trim();
      }
      continue;
    }

    const date = parseDateToIso(dateMatch[0]);
    const amountMatch = extractAmountFromRsColumn(line, columns);

    if (!date || !amountMatch) {
      continue;
    }

    if (!historyText || isLikelySummaryLine(historyText)) {
      continue;
    }

    rows.push({
      date,
      description: historyText,
      amount: amountMatch.amount,
      paymentType: amountMatch.amount < 0 ? 'DEBIT' : 'CREDIT',
      status: 'PAID',
      notes: 'PDF import',
      debugInfo: `R$=${amountMatch.rawValue} @x=${Math.round(amountMatch.x)}`,
    });
  }

  return rows;
}

function isLikelySummaryLine(line: string): boolean {
  const normalized = normalizeHeader(line);

  if (!normalized) return true;

  const summaryTokens = [
    'totaldafatura',
    'valorfatura',
    'valortotal',
    'subtotal',
    'pagamentominimo',
    'vencimento',
    'encargos',
    'limite',
    'disponivel',
    'saldoanterior',
    'saldodevedor',
    'resumo',
    'demonstrativo',
    'fatura',
  ];

  return summaryTokens.some((token) => normalized.includes(token));
}

function parsePdfLine(line: string): ParsedPdfLine | null {
  const dateMatch = line.match(/\b\d{2}[\/-]\d{2}(?:[\/-](?:\d{2}|\d{4}))?\b/);
  const amountMatches = line.match(/-?\d{1,3}(?:\.\d{3})*,\d{2}|-?\d+\.\d{2}/g);

  if (!dateMatch || !amountMatches || amountMatches.length === 0) {
    return null;
  }

  const date = parseDateToIso(dateMatch[0]);
  const amountText = amountMatches[amountMatches.length - 1];
  const amount = parseAmount(amountText);

  if (!date || amount === null) {
    return null;
  }

  const description = line.replace(dateMatch[0], ' ');
  const amountStart = description.lastIndexOf(amountText);
  const cleanDescription = (amountStart >= 0
    ? `${description.slice(0, amountStart)} ${description.slice(amountStart + amountText.length)}`
    : description)
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanDescription || isLikelySummaryLine(cleanDescription)) {
    return null;
  }

  return {
    date,
    amount,
    description: cleanDescription,
  };
}

function parsePdfLines(lines: string[]): ParsedImportRow[] {
  const rows: ParsedImportRow[] = [];
  const seen = new Set<string>();

  lines.forEach((line) => {
    const parsed = parsePdfLine(line);
    if (!parsed) {
      return;
    }

    const dedupKey = buildTransactionKey(parsed.date, parsed.description, parsed.amount);
    if (seen.has(dedupKey)) {
      return;
    }
    seen.add(dedupKey);

    rows.push({
      date: parsed.date,
      description: parsed.description,
      amount: parsed.amount,
      paymentType: parsed.amount < 0 ? 'DEBIT' : 'CREDIT',
      status: 'PAID',
      notes: 'PDF import',
      debugInfo: 'fallback-regex',
    });
  });

  return rows;
}

async function parsePdfFile(file: File): Promise<ParsedImportRow[]> {
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;

  const tableRows: ParsedImportRow[] = [];
  const allLines: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items: PdfTextItem[] = textContent.items
      .filter(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          'str' in item &&
          'transform' in item,
      )
      .map((item) => item as PdfTextItem);

    const positionedItems = toPositionedPdfItems(items);
    const groupedLines = groupPositionedPdfItemsByLine(positionedItems);
    tableRows.push(...parsePdfTableRows(groupedLines));

    const lines = extractLinesFromPdfItems(items);
    allLines.push(...lines);
  }

  if (tableRows.length > 0) {
    const dedupRows = new Map<string, ParsedImportRow>();
    tableRows.forEach((row) => {
      dedupRows.set(buildTransactionKey(row.date, row.description, row.amount), row);
    });
    return [...dedupRows.values()];
  }

  return parsePdfLines(allLines);
}

export function CsvImportModal({
  isOpen,
  onClose,
  accounts,
  categories,
  existingTransactions,
  onImport,
  isImporting,
}: CsvImportModalProps) {
  const { settings } = useSettings();
  const messages = getTransactionMessages(settings.locale);
  const [fileName, setFileName] = useState<string>('');
  const [format, setFormat] = useState<ImportFormat>('unknown');
  const [rawRows, setRawRows] = useState<ParsedImportRow[]>([]);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [defaultAccountId, setDefaultAccountId] = useState<string>('');
  const [defaultCategoryId, setDefaultCategoryId] = useState<string>('');
  const [importPaymentKind, setImportPaymentKind] = useState<ImportPaymentKind>('');
  const [replaceDuplicates, setReplaceDuplicates] = useState(false);
  const [showPdfDiagnostics, setShowPdfDiagnostics] = useState(false);

  const existingKeys = useMemo(() => {
    const keys = new Set<string>();
    existingTransactions.forEach((tx) => {
      const date = new Date(tx.date).toISOString().slice(0, 10);
      keys.add(buildTransactionKey(date, tx.description, tx.amount));
    });
    return keys;
  }, [existingTransactions]);

  const categoryNameToId = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((cat) => {
      map.set(normalizeText(cat.name), cat.id);
    });
    return map;
  }, [categories]);

  const parsedCount = rawRows.length;
  const validCount = previewRows.filter((r) => r.valid).length;
  const duplicateCount = previewRows.filter((r) => r.duplicate).length;

  const resetState = () => {
    setFileName('');
    setFormat('unknown');
    setRawRows([]);
    setPreviewRows([]);
    setImportPaymentKind('');
    setReplaceDuplicates(false);
    setShowPdfDiagnostics(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const rebuildPreview = (
    rows: ParsedImportRow[],
    accountId: string,
    categoryId: string,
    selectedPaymentKind: ImportPaymentKind,
  ) => {
    const nextPreview: PreviewRow[] = rows.map((row, idx) => {
      const normalizedDate = parseDateToIso(row.date);
      const normalizedDescription = row.description.trim();
      const normalizedAmount = Number(row.amount);

      if (!normalizedDate) {
        return {
          index: idx + 1,
          valid: false,
          duplicate: false,
          reason: messages.csv.invalidDate,
          parsed: row,
        };
      }

      if (!normalizedDescription) {
        return {
          index: idx + 1,
          valid: false,
          duplicate: false,
          reason: messages.csv.invalidDescription,
          parsed: row,
        };
      }

      if (!Number.isFinite(normalizedAmount)) {
        return {
          index: idx + 1,
          valid: false,
          duplicate: false,
          reason: messages.csv.invalidAmount,
          parsed: row,
        };
      }

      if (!accountId) {
        return {
          index: idx + 1,
          valid: false,
          duplicate: false,
          reason: messages.csv.selectDestinationAccount,
          parsed: row,
        };
      }

      if (!selectedPaymentKind) {
        return {
          index: idx + 1,
          valid: false,
          duplicate: false,
          reason: messages.csv.selectTransactionType,
          parsed: row,
        };
      }

      const resolvedCategoryId = row.categoryName
        ? categoryNameToId.get(normalizeText(row.categoryName)) || categoryId
        : categoryId;

      if (!resolvedCategoryId) {
        return {
          index: idx + 1,
          valid: false,
          duplicate: false,
          reason: messages.csv.selectDefaultCategory,
          parsed: row,
        };
      }

      const mapped: CreateTransactionDto = {
        accountId,
        categoryId: resolvedCategoryId,
        date: normalizedDate,
        amount: normalizedAmount,
        description: normalizedDescription,
        paymentType: selectedPaymentKind,
        status: row.status,
        notes: row.notes,
      };

      const duplicate = existingKeys.has(
        buildTransactionKey(mapped.date, mapped.description, mapped.amount),
      );

      return {
        index: idx + 1,
        valid: true,
        duplicate,
        parsed: row,
        mapped,
      };
    });

    setPreviewRows(nextPreview);
  };

  const handleAccountChange = (value: string) => {
    setDefaultAccountId(value);
    rebuildPreview(rawRows, value, defaultCategoryId, importPaymentKind);
  };

  const handleCategoryChange = (value: string) => {
    setDefaultCategoryId(value);
    rebuildPreview(rawRows, defaultAccountId, value, importPaymentKind);
  };

  const handlePaymentKindChange = (value: ImportPaymentKind) => {
    setImportPaymentKind(value);
    rebuildPreview(rawRows, defaultAccountId, defaultCategoryId, value);
  };

  const handleParsedRowFieldChange = (
    index: number,
    field: 'date' | 'description' | 'amount',
    value: string,
  ) => {
    const nextRows = [...rawRows];
    const current = nextRows[index];
    if (!current) return;

    if (field === 'amount') {
      const parsedAmount = parseAmount(value);
      current.amount = parsedAmount ?? Number.NaN;
    } else if (field === 'description') {
      current.description = value;
    } else {
      current.date = value;
    }

    nextRows[index] = { ...current };
    setRawRows(nextRows);
    rebuildPreview(nextRows, defaultAccountId, defaultCategoryId, importPaymentKind);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const detected = detectFormat(file);
    setFormat(detected);
    if (detected !== 'pdf') {
      setShowPdfDiagnostics(false);
    }

    let parsed: ParsedImportRow[] = [];

    if (detected === 'csv') {
      const text = await file.text();
      parsed = parseCsvText(text);
    } else if (detected === 'ofx') {
      const text = await file.text();
      parsed = parseOfxText(text);
    } else if (detected === 'pdf') {
      parsed = await parsePdfFile(file);
    }

    setRawRows(parsed);
    rebuildPreview(parsed, defaultAccountId, defaultCategoryId, importPaymentKind);
  };

  const handleImport = async () => {
    const importRows = previewRows
      .filter((row) => row.valid && row.mapped)
      .filter((row) => (replaceDuplicates ? true : !row.duplicate))
      .map((row) => row.mapped as CreateTransactionDto);

    if (importRows.length === 0) return;

    try {
      await onImport(importRows);
      handleClose();
    } catch {
      // Error feedback is handled by parent mutation toast.
    }
  };

  const importTitle = `${messages.csv.title}${format !== 'unknown' ? ` (${format.toUpperCase()})` : ''}`;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={importTitle} size="xl">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{messages.csv.destinationAccount}</label>
            <select
              value={defaultAccountId}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">{messages.csv.destinationAccountPlaceholder}</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{messages.csv.defaultCategory}</label>
            <select
              value={defaultCategoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">{messages.csv.defaultCategoryPlaceholder}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{messages.csv.transactionType}</label>
            <select
              value={importPaymentKind}
              onChange={(e) => handlePaymentKindChange(e.target.value as ImportPaymentKind)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">{messages.csv.transactionTypePlaceholder}</option>
              <option value="DEBIT">{messages.csv.debit}</option>
              <option value="CREDIT">{messages.csv.credit}</option>
            </select>
          </div>
        </div>

        <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
          <label className="flex items-center gap-3 cursor-pointer">
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700">
              {fileName || messages.csv.selectFile}
            </span>
            <input
              type="file"
              accept=".csv,.ofx,.pdf,text/csv,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="mt-2 text-xs text-gray-500">{messages.csv.supportedFormats}</p>
          <p className="mt-1 text-xs text-gray-500">{messages.csv.expectedColumns}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
            <div className="text-gray-500">{messages.csv.read}</div>
            <div className="text-lg font-semibold text-gray-900">{parsedCount}</div>
          </div>
          <div className="rounded-lg bg-green-50 p-3 border border-green-100">
            <div className="text-green-700">{messages.csv.valid}</div>
            <div className="text-lg font-semibold text-green-800">{validCount}</div>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 border border-amber-100">
            <div className="text-amber-700">{messages.csv.duplicates}</div>
            <div className="text-lg font-semibold text-amber-800">{duplicateCount}</div>
          </div>
        </div>

        {previewRows.length > 0 && (
          <>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={replaceDuplicates}
                onChange={(e) => setReplaceDuplicates(e.target.checked)}
              />
              {messages.csv.importDuplicates}
            </label>

            {format === 'pdf' && (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showPdfDiagnostics}
                  onChange={(e) => setShowPdfDiagnostics(e.target.checked)}
                />
                {messages.csv.showPdfDiagnostics}
              </label>
            )}

            <div className="max-h-72 overflow-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2">{messages.csv.columns.row}</th>
                    <th className="text-left p-2">{messages.csv.columns.date}</th>
                    <th className="text-left p-2">{messages.csv.columns.description}</th>
                    <th className="text-right p-2">{messages.csv.columns.amount}</th>
                    <th className="text-left p-2">{messages.csv.columns.status}</th>
                    {showPdfDiagnostics && <th className="text-left p-2">{messages.csv.columns.diagnostics}</th>}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.slice(0, 100).map((row) => {
                    const statusClass = !row.valid
                      ? 'text-red-700 bg-red-50'
                      : row.duplicate
                        ? 'text-amber-700 bg-amber-50'
                        : 'text-green-700 bg-green-50';

                    return (
                      <tr key={row.index} className="border-t border-gray-100">
                        <td className="p-2">{row.index}</td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.parsed?.date || ''}
                            onChange={(e) => handleParsedRowFieldChange(row.index - 1, 'date', e.target.value)}
                            className="w-28 rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="dd/mm/aaaa"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.parsed?.description || ''}
                            onChange={(e) => handleParsedRowFieldChange(row.index - 1, 'description', e.target.value)}
                            className="w-full min-w-48 rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder={messages.csv.columns.description}
                          />
                        </td>
                        <td className="p-2 text-right">
                          <input
                            type="text"
                            value={row.parsed && Number.isFinite(row.parsed.amount) ? row.parsed.amount.toFixed(2) : ''}
                            onChange={(e) => handleParsedRowFieldChange(row.index - 1, 'amount', e.target.value)}
                            className="w-28 rounded border border-gray-200 px-2 py-1 text-xs text-right focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="0,00"
                          />
                        </td>
                        <td className="p-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
                            {!row.valid ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            {!row.valid ? row.reason : row.duplicate ? messages.csv.duplicate : messages.csv.ok}
                          </span>
                        </td>
                        {showPdfDiagnostics && (
                          <td className="p-2 text-xs text-gray-600 whitespace-nowrap">{row.parsed?.debugInfo || '-'}</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={handleClose}>
            {messages.csv.cancel}
          </Button>
          <Button
            onClick={handleImport}
            disabled={
              isImporting ||
              previewRows.filter((row) => row.valid && row.mapped && (replaceDuplicates || !row.duplicate)).length === 0
            }
          >
            {isImporting ? messages.csv.importing : messages.csv.import}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
