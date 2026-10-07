import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { ListProvider, useList } from "@/context/listcontext";

const book = { id: "OL1W", title: "The Hobbit", author: "J.R.R. Tolkien" };

const wrapper = ({ children }: { children: ReactNode }) => (
  <ListProvider>{children}</ListProvider>
);

beforeEach(() => localStorage.clear());

describe("reading list", () => {
  it("adds a book with a status", () => {
    const { result } = renderHook(() => useList(), { wrapper });
    act(() => result.current.setStatus(book, "to-read"));
    expect(result.current.getStatus("OL1W")).toBe("to-read");
  });

  it("changes the status without duplicating the book", () => {
    const { result } = renderHook(() => useList(), { wrapper });
    act(() => result.current.setStatus(book, "to-read"));
    act(() => result.current.setStatus(book, "finished"));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.getStatus("OL1W")).toBe("finished");
  });

  it("removes a book", () => {
    const { result } = renderHook(() => useList(), { wrapper });
    act(() => result.current.setStatus(book, "reading"));
    act(() => result.current.removeBook("OL1W"));
    expect(result.current.items).toHaveLength(0);
  });

  it("saves the list to localStorage", () => {
    const { result } = renderHook(() => useList(), { wrapper });
    act(() => result.current.setStatus(book, "reading"));
    expect(localStorage.getItem("reading-list-items")).toContain("The Hobbit");
  });
});