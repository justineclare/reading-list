import Link from "next/link";
import { coverUrl, type BookSummary } from "@/lib/openlibrary";

export default function BookCard({ book }: { book: BookSummary }) {
  const cover = coverUrl(book.coverId);

  return (
    <Link href={`/book/${book.id}`} className="book-card">
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={`Cover of ${book.title}`} />
      ) : (
        <div className="book-card-placeholder">No cover</div>
      )}
      <div className="book-card-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        {book.year && <p className="muted">{book.year}</p>}
      </div>
    </Link>
  );
}