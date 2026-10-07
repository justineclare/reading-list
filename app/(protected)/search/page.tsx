"use client";

import { useState } from "react";
import BookCard from "@/components/bookcard";
import { searchBooks, type BookSummary } from "@/lib/openlibrary";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const result = await searchBooks(query.trim(), 1);
      setBooks(result.books);
      setTotal(result.total);
      setPage(1);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMore() {
    setLoading(true);
    setError("");
    try {
      const result = await searchBooks(query.trim(), page + 1);
      setBooks((prev) => [...prev, ...result.books]);
      setPage(page + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Search books</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          placeholder="Search by title or author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>Search</button>
      </form>

      {error && <p className="error">{error}</p>}
      {searched && !loading && books.length === 0 && !error && (
        <p className="muted">No books found. Try a different search.</p>
      )}

      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {loading && <p className="muted">Loading...</p>}

      {!loading && books.length > 0 && books.length < total && (
        <button className="load-more" onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}