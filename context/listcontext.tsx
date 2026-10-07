"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { BookSummary } from "@/lib/openlibrary";

export type ReadingStatus = "to-read" | "reading" | "finished";
export type ListItem = BookSummary & { status: ReadingStatus };

type ListContextValue = {
  items: ListItem[];
  loaded: boolean;
  getStatus: (id: string) => ReadingStatus | undefined;
  setStatus: (book: BookSummary, status: ReadingStatus) => void;
  removeBook: (id: string) => void;
};

const STORAGE_KEY = "reading-list-items";
const ListContext = createContext<ListContextValue | null>(null);

export function ListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved list once, after the first render (localStorage only exists in the browser)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore corrupted data
    }
    setLoaded(true);
  }, []);

  // Save whenever the list changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  function getStatus(id: string) {
    return items.find((item) => item.id === id)?.status;
  }

  function setStatus(book: BookSummary, status: ReadingStatus) {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === book.id);
      if (exists) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, status } : item
        );
      }
      return [...prev, { ...book, status }];
    });
  }

  function removeBook(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <ListContext.Provider
      value={{ items, loaded, getStatus, setStatus, removeBook }}
    >
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList must be used inside ListProvider");
  }
  return context;
}