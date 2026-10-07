export type BookSummary = {
  id: string;
  title: string;
  author: string;
  year?: number;
  coverId?: number;
};

type SearchDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

export function coverUrl(coverId?: number, size: "S" | "M" | "L" = "M") {
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
    : null;
}

export async function searchBooks(query: string, page = 1, limit = 12) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
    fields: "key,title,author_name,first_publish_year,cover_i",
  });

  const res = await fetch(`https://openlibrary.org/search.json?${params}`);
  if (!res.ok) {
    throw new Error("Could not load books. Please try again.");
  }

  const data = await res.json();
  const books: BookSummary[] = (data.docs as SearchDoc[]).map((doc) => ({
    id: doc.key.replace("/works/", ""),
    title: doc.title,
    author: doc.author_name?.[0] ?? "Unknown author",
    year: doc.first_publish_year,
    coverId: doc.cover_i,
  }));

  return { books, total: data.numFound as number };
}

export type BookDetail = BookSummary & {
  description: string;
  subjects: string[];
};

export async function getBook(id: string): Promise<BookDetail> {
  const res = await fetch(`https://openlibrary.org/works/${id}.json`);
  if (!res.ok) {
    throw new Error("Could not load this book.");
  }
  const work = await res.json();

  let author = "Unknown author";
  const authorKey = work.authors?.[0]?.author?.key;
  if (authorKey) {
    try {
      const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`);
      if (authorRes.ok) {
        const authorData = await authorRes.json();
        author = authorData.name ?? author;
      }
    } catch {
      // keep the default author name
    }
  }

  const description =
    typeof work.description === "string"
      ? work.description
      : work.description?.value ?? "No description available.";

  const yearMatch = String(work.first_publish_date ?? "").match(/\d{4}/);

  return {
    id,
    title: work.title,
    author,
    year: yearMatch ? Number(yearMatch[0]) : undefined,
    coverId: work.covers?.find((c: number) => c > 0),
    description,
    subjects: (work.subjects ?? []).slice(0, 8),
  };
}