"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  flattenSearchResults,
  hasSearchResults,
  searchSite,
  totalSearchResults,
  type GroupedSearchResults,
  type SearchResultItem,
} from "@/lib/search";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

const emptyResults: GroupedSearchResults = {
  products: [],
  collections: [],
  journal: [],
};

const quickSuggestions = [
  { label: "Postcards", query: "postcard" },
  { label: "Journal", query: "journal" },
  { label: "Lotus", query: "lotus" },
  { label: "Limited deals", query: "limited" },
] as const;

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function HeaderSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const mounted = useIsClient();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const grouped = useMemo(
    () => (query.trim() ? searchSite(query) : emptyResults),
    [query],
  );
  const flatResults = useMemo(() => flattenSearchResults(grouped), [grouped]);
  const resultCount = totalSearchResults(grouped);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }, []);

  const openSearch = useCallback(() => {
    setOpen(true);
    setActiveIndex(-1);
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const submitSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      close();
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [close, router],
  );

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSearch]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) =>
          flatResults.length === 0 ? -1 : (index + 1) % flatResults.length,
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) =>
          flatResults.length === 0
            ? -1
            : index <= 0
              ? flatResults.length - 1
              : index - 1,
        );
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (activeIndex >= 0 && flatResults[activeIndex]) {
          navigateTo(flatResults[activeIndex].href);
        } else {
          submitSearch(query);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, flatResults, activeIndex, query, close, navigateTo, submitSearch]);

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="search-trigger-pill"
        aria-label="Search"
        aria-expanded={open}
        aria-controls="header-search-panel"
      >
        <SearchIcon className="text-mohasti-teal/55" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-1 rounded border border-mohasti-teal/10 bg-white/70 px-1.5 py-0.5 text-[10px] font-medium text-mohasti-teal/45">
          Ctrl K
        </kbd>
      </button>

      <button
        type="button"
        onClick={openSearch}
        className="site-header-icon-btn lg:hidden"
        aria-label="Search"
        aria-expanded={open}
        aria-controls="header-search-panel"
      >
        <SearchIcon />
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="search-overlay-root fixed inset-0 z-[200]"
            role="presentation"
          >
            <button
              type="button"
              className="search-overlay-backdrop absolute inset-0 bg-mohasti-teal-dark/45 backdrop-blur-sm"
              aria-label="Close search"
              onClick={close}
            />

            <div className="relative flex h-full items-start justify-center overflow-y-auto px-4 pb-6 pt-[calc(6.5rem+env(safe-area-inset-top,0px))] md:px-6 md:pt-28">
              <div
                id="header-search-panel"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Search Mohasti"
                className="search-panel flex w-full max-w-2xl max-h-[min(85vh,calc(100dvh-6rem))] flex-col overflow-hidden rounded-2xl border border-mohasti-teal/10 bg-white shadow-[0_28px_80px_-24px_rgba(15,92,96,0.45)]"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className="search-panel-accent shrink-0" aria-hidden />

                <div className="shrink-0 border-b border-mohasti-teal/8 px-4 py-4 md:px-5 md:py-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-mohasti-teal/50">
                        Search
                      </p>
                      <h2 className="font-display text-xl text-mohasti-teal-dark md:text-2xl">
                        Find art &amp; stationery
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      className="site-header-icon-btn shrink-0"
                      aria-label="Close search"
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitSearch(query);
                    }}
                  >
                    <div className="search-input-shell">
                      <SearchIcon className="shrink-0 text-mohasti-teal-dark" />
                      <input
                        ref={inputRef}
                        type="search"
                        name="q"
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setActiveIndex(-1);
                        }}
                        placeholder="Search products, collections, journal..."
                        autoComplete="off"
                        className="min-w-0 flex-1 bg-transparent font-body text-base text-mohasti-teal-dark outline-none placeholder:text-mohasti-teal/40"
                      />
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          className="font-body text-xs font-medium text-mohasti-teal/50 transition-colors hover:text-mohasti-teal-dark"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 md:px-4">
                  {!query.trim() ? (
                    <SearchEmptySuggestions
                      onPick={(value) => {
                        setQuery(value);
                        setActiveIndex(-1);
                        inputRef.current?.focus();
                      }}
                    />
                  ) : !hasSearchResults(grouped) ? (
                    <div className="rounded-xl border border-dashed border-mohasti-teal/15 bg-mohasti-teal/[0.02] px-4 py-10 text-center">
                      <p className="font-display text-xl text-mohasti-teal-dark">
                        No matches yet
                      </p>
                      <p className="mt-2 font-body text-sm text-mohasti-teal/65">
                        Nothing found for &ldquo;{query.trim()}&rdquo;. Try another
                        keyword or browse the full catalog.
                      </p>
                      <button
                        type="button"
                        onClick={() => submitSearch(query)}
                        className="mt-5 rounded-lg bg-[#FFDE59] px-5 py-2 font-body text-sm font-semibold text-[#0f5c60] transition-opacity hover:opacity-90"
                      >
                        Search all products
                      </button>
                    </div>
                  ) : (
                    <>
                      <SearchResultGroup
                        label="Products"
                        items={grouped.products}
                        activeIndex={activeIndex}
                        flatOffset={0}
                        onSelect={navigateTo}
                      />
                      <SearchResultGroup
                        label="Collections"
                        items={grouped.collections}
                        activeIndex={activeIndex}
                        flatOffset={grouped.products.length}
                        onSelect={navigateTo}
                      />
                      <SearchResultGroup
                        label="Journal"
                        items={grouped.journal}
                        activeIndex={activeIndex}
                        flatOffset={
                          grouped.products.length + grouped.collections.length
                        }
                        onSelect={navigateTo}
                      />
                    </>
                  )}
                </div>

                <div className="shrink-0 border-t border-mohasti-teal/8 bg-gray-50/80 px-4 py-3 md:px-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="hidden flex-wrap items-center gap-x-2 gap-y-1 font-body text-[11px] text-mohasti-teal/50 sm:flex">
                      <kbd className="rounded border border-mohasti-teal/10 bg-white px-1.5 py-0.5">
                        ↑↓
                      </kbd>
                      <span>Navigate</span>
                      <kbd className="rounded border border-mohasti-teal/10 bg-white px-1.5 py-0.5">
                        Enter
                      </kbd>
                      <span>Open</span>
                      <kbd className="rounded border border-mohasti-teal/10 bg-white px-1.5 py-0.5">
                        esc
                      </kbd>
                      <span>Close</span>
                    </div>

                    {query.trim() && resultCount > 0 ? (
                      <button
                        type="button"
                        onClick={() => submitSearch(query)}
                        className="w-full rounded-lg bg-mohasti-teal px-4 py-2 font-body text-xs font-semibold text-white transition-colors hover:bg-mohasti-teal-dark sm:w-auto"
                      >
                        View all {resultCount} results
                      </button>
                    ) : (
                      <p className="font-body text-[11px] text-mohasti-teal/45 sm:hidden">
                        Tap outside or press esc to close
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function SearchEmptySuggestions({ onPick }: { onPick: (query: string) => void }) {
  return (
    <div className="px-1 py-2">
      <p className="font-body text-sm text-mohasti-teal-dark/75">
        Popular searches
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {quickSuggestions.map((item) => (
          <button
            key={item.query}
            type="button"
            onClick={() => onPick(item.query)}
            className="search-suggestion-chip"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-mohasti-teal/8 bg-[#FFDE59]/12 px-4 py-4">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-mohasti-teal/55">
          Tip
        </p>
        <p className="mt-1 font-body text-sm leading-relaxed text-mohasti-teal-dark/80">
          Search by product name, collection, or journal topic — try{" "}
          <strong>&ldquo;whale shark&rdquo;</strong> or{" "}
          <strong>&ldquo;tea ritual&rdquo;</strong>.
        </p>
      </div>
    </div>
  );
}

function SearchResultGroup({
  label,
  items,
  activeIndex,
  flatOffset,
  onSelect,
}: {
  label: string;
  items: SearchResultItem[];
  activeIndex: number;
  flatOffset: number;
  onSelect: (href: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="py-1">
      <p className="px-2 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-mohasti-teal/50">
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((item, index) => {
          const flatIndex = flatOffset + index;
          const isActive = flatIndex === activeIndex;

          return (
            <li key={`${item.type}-${item.href}`}>
              <button
                type="button"
                onClick={() => onSelect(item.href)}
                className={cn(
                  "search-result-row flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors md:px-3",
                  isActive
                    ? "search-result-row--active bg-[#FFDE59]/30 ring-1 ring-[#FFDE59]/50"
                    : "hover:bg-mohasti-teal/[0.04]",
                )}
              >
                {item.type === "product" && item.image ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-mohasti-teal/8">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-body text-[10px] font-bold uppercase tracking-wide ring-1 ring-mohasti-teal/8",
                      item.type === "collection" &&
                        "bg-mohasti-teal/10 text-mohasti-teal-dark",
                      item.type === "journal" &&
                        "bg-[#FFDE59] text-[#0f5c60]",
                    )}
                  >
                    {item.type === "collection" ? "Shop" : "Read"}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-body text-sm font-semibold text-mohasti-teal-dark">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate font-body text-xs text-mohasti-teal/55">
                    {item.type === "product" && item.price != null
                      ? `${formatPrice(item.price)} · ${item.subtitle}`
                      : item.subtitle}
                  </span>
                </span>
                <span className="search-result-arrow" aria-hidden>
                  <ArrowUpRightIcon />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
