// components/overview-table.tsx

"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import type { Key } from 'react'; // REMOVED: Unused import

// --- Type Definitions ---
type DataItem = Record<string, unknown>;

// --- Common Renderer Utilities ---
type LinkItem = { name: string; url: string };
export const Renderers = {
  text: (value: unknown): React.ReactNode => {
    if (value === null || value === undefined || value === '') return <span className="text-muted-foreground">-</span>;
    return String(value);
  },
  percentage: (value: unknown): React.ReactNode => {
    if (typeof value !== 'number' || isNaN(value)) return <span className="text-muted-foreground">-</span>;
    return `${(value * 100).toFixed(2)}%`;
  },
  currency: (value: unknown, symbol = '$'): React.ReactNode => {
    if (typeof value !== 'number' || isNaN(value)) return <span className="text-muted-foreground">-</span>;
    return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },
  tags: (value: unknown): React.ReactNode => {
    if (!Array.isArray(value) || value.length === 0) { return <span className="text-muted-foreground">-</span>; }
    const stringTags = value.filter((tag): tag is string => typeof tag === 'string' && tag.trim() !== '');
    if (stringTags.length === 0) { return <span className="text-muted-foreground">-</span>; }
    return (
      <div className="flex flex-wrap gap-1">
        {stringTags.map((tag, i) => (<Badge variant="outline" key={`${tag}-${i}`}>{tag}</Badge>))}
      </div>
    );
  },
  links: (value: unknown): React.ReactNode => {
    if (!Array.isArray(value) || value.length === 0) { return <span className="text-muted-foreground">-</span>; }
    const validLinks = value.filter((item): item is LinkItem =>
      typeof item === 'object' && item !== null && typeof item.name === 'string' && item.name.trim() !== '' && typeof item.url === 'string' && item.url.trim() !== ''
    );
    if (validLinks.length === 0) { if (value.length > 0) { console.warn("Invalid data passed to Renderers.links.", value); } return <span className="text-muted-foreground">-</span>; }
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 px-2.5 py-0.5 text-xs sm:text-sm">
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="whitespace-nowrap">Links ({validLinks.length})</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {validLinks.map((link, i) => (
            <DropdownMenuItem key={`${link.name}-${i}`} asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer w-full">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                <span className="truncate" title={link.name}>{link.name}</span>
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};

type RendererKey = keyof typeof Renderers;

export type ColumnDefinition = {
  key: string;
  header: string;
  rendererType?: RendererKey;
  searchable?: boolean;
  copyable?: boolean;
};

type OverviewTableProps = {
  initialData: DataItem[];
  columns: ColumnDefinition[];
  searchPlaceholder?: string;
};

// --- Component Implementation ---
export function OverviewTable({
  initialData,
  columns,
  searchPlaceholder = "Search..."
}: OverviewTableProps) {

  // Initialize state for data (filtering works on this)
  // REMOVED setData as it's not currently used
  const [data] = useState<DataItem[]>(initialData);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => { setCopiedText(text); setTimeout(() => setCopiedText(null), 2000); toast.success(`${text} Copied to clipboard!`); })
      .catch(error => { console.error('Failed to copy text: ', error); toast.error(`Failed to copy text`); });
  };

  // Filter based on the 'data' state
  const filteredData = data.filter((item) => {
    if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase();
    return columns.some(column => {
      if (!column.searchable) return false; const value = item[column.key];
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') { return value.toLowerCase().includes(term); }
      else if (Array.isArray(value)) { return value.some(element => element !== null && element !== undefined && String(element).toLowerCase().includes(term)); }
      else if (typeof value === 'object' && value !== null) { try { return JSON.stringify(value).toLowerCase().includes(term); } catch { return false; } }
      else { return String(value).toLowerCase().includes(term); }
    });
  });

  const renderDefaultValue = (value: unknown): React.ReactNode => {
    if (value === undefined || value === null || value === '') { return <span className="text-muted-foreground">-</span>; }
    if (Array.isArray(value)) { if (value.every(item => typeof item === 'string' || typeof item === 'number')) { return value.join(', '); } return <span className="text-muted-foreground">[Array]</span>; }
    if (typeof value === 'object' && value !== null) { return <span className="text-muted-foreground">[Object]</span>; }
    return String(value);
  }

  const renderCell = (item: DataItem, column: ColumnDefinition) => {
    const value = item[column.key];
    if (column.rendererType && Renderers[column.rendererType]) {
      const rendererFunction = Renderers[column.rendererType];
      return rendererFunction(value);
    }
    if (column.copyable && value !== undefined && value !== null) {
      const stringValue = String(value);
      return (
        <div className="flex items-center gap-2">

          <button onClick={(e) => { e.stopPropagation(); copyToClipboard(stringValue); }} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer flex-shrink-0 p-1 -m-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-label={`Copy ${stringValue}`}>
            {copiedText === stringValue ? <Check className="h-4 w-4 text-green-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          </button>

          <span className="font-mono">{renderDefaultValue(value)}</span>
        </div>
      );
    }
    return renderDefaultValue(value);
  };

  // --- JSX Output ---
  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-full space-y-4">
        <div className="flex">
          <input type="text" placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search table data" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-sm" />
        </div>
        <div className="border rounded-lg w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors data-[state=selected]:bg-muted">
                {columns.map((column) => (<th key={column.key} scope="col" className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">{column.header}</th>))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredData.length === 0 ? (
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td colSpan={columns.length} className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-center text-muted-foreground h-24">
                    {initialData.length === 0 ? "No data available to display." : searchTerm ? "No items found matching your search." : "No data to display."}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={String(item.id ?? item.isin ?? item.symbol ?? index)} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    {columns.map((column) => (<td key={`${String(item.id ?? item.isin ?? item.symbol ?? index)}-${column.key}`} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{renderCell(item, column)}</td>))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
}