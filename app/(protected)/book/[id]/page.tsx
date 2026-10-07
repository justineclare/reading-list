"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { coverUrl, getBook, type BookDetail } from "@/lib/openlibrary";
import { useList, type ReadingStatus } from "@/context/listcontext";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getStatus, setStatus, removeBook } = useList();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getBook(id);
        if (!cancelled) setBook(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="muted">Loading...</p>;
  if (error || !book) return <p className="error">{error || "Book not found."}</p>;

  const cover = coverUrl(book.coverId, "L");
  const status = getStatus(book.id);

  function handleStatusChange(value: string) {
    if (!book) return;
    setStatus(
      {
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        coverId: book.coverId,
      },
      value as ReadingStatus
    );
  }

  return (
    <div>
      <Link href="/search" className="back-link">← Back to search</Link>

      <div className="detail">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={`Cover of ${book.title}`} className="detail-cover" />
        ) : (
          <div className="detail-cover book-card-placeholder">No cover</div>
        )}

        <div className="detail-info">
          <h1>{book.title}</h1>
          <p>by {book.author}{book.year ? ` · first published ${book.year}` : ""}</p>

          <div className="detail-actions">
            <select
              value={status ?? ""}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="" disabled>Add to list…</option>
              <option value="to-read">To Read</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>
            {status && (
              <button className="remove-btn" onClick={() => removeBook(book.id)}>
                Remove
              </button>
            )}
          </div>

          <p className="detail-description">{book.description}</p>

          {book.subjects.length > 0 && (
            <p className="muted">Subjects: {book.subjects.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  );
}