import { useMemo, useState, type ChangeEvent } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import type { Account, Category, CreateTransactionDto, Transaction } from '../../../types/models.types';
import { useSettings } from '../../../contexts/SettingsContext';
import { useFormatters } from '../../../hooks/useFormatters';
import { getTransactionMessages } from '../../../lib/featureLocale';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  existingTransactions: Transaction[];
  onImport: (transactions: CreateTransactionDto[]) => Promise<void>;
  isImporting: boolean;
}

interface ParsedCsvRow {
  rawLine: string;
  date: string;
  description: string;
  amount: number;
  paymentType: CreateTransactionDto['paymentType'];
  status: NonNullable<CreateTransactionDto['status']>;
  categoryName?: string;
  notes?: string;
}

interface PreviewRow {
  index: number;
  valid: boolean;
  duplicate: boolean;
  reason?: string;
  parsed?: ParsedCsvRow;
  mapped?: CreateTransactionDto;
}

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

  const br = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (br) {
    const [, dd, mm, yyyy] = br;
    return `${yyyy}-${mm}-${dd}`;
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
  const { formatCurrency } = useFormatters();
  const messages = getTransactionMessages(settings.locale);
  const [fileName, setFileName] = useState<string>('');
  const [rawRows, setRawRows] = useState<ParsedCsvRow[]>([]);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [defaultAccountId, setDefaultAccountId] = useState<string>('');
  const [defaultCategoryId, setDefaultCategoryId] = useState<string>('');
  const [replaceDuplicates, setReplaceDuplicates] = useState(false);

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
    setRawRows([]);
    setPreviewRows([]);
    setReplaceDuplicates(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const rebuildPreview = (rows: ParsedCsvRow[], accountId: string, categoryId: string) => {
    const nextPreview: PreviewRow[] = rows.map((row, idx) => {
      if (!accountId) {
        return {
          index: idx + 1,
          valid: false,
          duplicate: false,
          reason: messages.csv.selectDestinationAccount,
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
        date: row.date,
        amount: row.amount,
        description: row.description,
        paymentType: row.paymentType,
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
    rebuildPreview(rawRows, value, defaultCategoryId);
  };

  const handleCategoryChange = (value: string) => {
    setDefaultCategoryId(value);
    rebuildPreview(rawRows, defaultAccountId, value);
  };

  const parseCsvText = (text: string): ParsedCsvRow[] => {
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

    const parsed: ParsedCsvRow[] = [];

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

      const paymentType = PAYMENT_TYPE_MAP[paymentRaw.toUpperCase()] || 'DEBIT';
      const status = STATUS_MAP[statusRaw.toUpperCase()] || 'PENDING';

      parsed.push({
        rawLine: lines[i],
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
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const text = await file.text();
    const parsed = parseCsvText(text);
    setRawRows(parsed);
    rebuildPreview(parsed, defaultAccountId, defaultCategoryId);
  };

  const handleImport = async () => {
    const importRows = previewRows
      .filter((row) => row.valid && row.mapped)
      .filter((row) => (replaceDuplicates ? true : !row.duplicate))
      .map((row) => row.mapped as CreateTransactionDto);

    if (importRows.length === 0) return;

    await onImport(importRows);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={messages.csv.title} size="xl">
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
        </div>

        <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
          <label className="flex items-center gap-3 cursor-pointer">
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700">
              {fileName || messages.csv.selectFile}
            </span>
            <input type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
          </label>
          <p className="mt-2 text-xs text-gray-500">
            {messages.csv.expectedColumns}
          </p>
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

            <div className="max-h-72 overflow-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2">{messages.csv.columns.row}</th>
                    <th className="text-left p-2">{messages.csv.columns.date}</th>
                    <th className="text-left p-2">{messages.csv.columns.description}</th>
                    <th className="text-right p-2">{messages.csv.columns.amount}</th>
                    <th className="text-left p-2">{messages.csv.columns.status}</th>
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
                        <td className="p-2">{row.parsed?.date || '-'}</td>
                        <td className="p-2">{row.parsed?.description || '-'}</td>
                        <td className="p-2 text-right">
                          {row.parsed
                            ? formatCurrency(row.parsed.amount)
                            : '-'}
                        </td>
                        <td className="p-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
                            {!row.valid ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            {!row.valid ? row.reason : row.duplicate ? messages.csv.duplicate : messages.csv.ok}
                          </span>
                        </td>
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
            disabled={isImporting || previewRows.filter((row) => row.valid && row.mapped && (replaceDuplicates || !row.duplicate)).length === 0}
          >
            {isImporting ? messages.csv.importing : messages.csv.import}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
