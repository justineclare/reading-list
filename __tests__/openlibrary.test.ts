import { describe, it, expect, vi, afterEach } from "vitest";
import { coverUrl, searchBooks } from "@/lib/openlibrary";

afterEach(() => vi.unstubAllGlobals());

describe("coverUrl", () => {
  it("builds a cover link", () => {
    expect(coverUrl(123, "M")).toBe(
      "https://covers.openlibrary.org/b/id/123-M.jpg"
    );
  });

  it("returns null when there is no cover", () => {
    expect(coverUrl(undefined)).toBeNull();
  });
});

describe("searchBooks", () => {
  it("maps API results to books", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          numFound: 1,
          docs: [
            {
              key: "/works/OL1W",
              title: "The Hobbit",
              author_name: ["J.R.R. Tolkien"],
              first_publish_year: 1937,
              cover_i: 123,
            },
          ],
        }),
      })
    );

    const { books, total } = await searchBooks("hobbit");
    expect(total).toBe(1);
    expect(books[0]).toEqual({
      id: "OL1W",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      year: 1937,
      coverId: 123,
    });
  });

  it("uses a fallback when the author is missing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          numFound: 1,
          docs: [{ key: "/works/OL2W", title: "Untitled" }],
        }),
      })
    );

    const { books } = await searchBooks("untitled");
    expect(books[0].author).toBe("Unknown author");
  });

  it("throws when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(searchBooks("anything")).rejects.toThrow();
  });
});