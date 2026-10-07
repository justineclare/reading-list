"use client";

import { useState } from "react";
import Link from "next/link";
import { coverUrl } from "@/lib/openlibrary";
import { useList, type ReadingStatus } from "@/context/listcontext";

const tabs: { value: ReadingStatus; label: string }[] = [
  { value: "to-read", label: "To Read" },
  { value: "reading", label: "Reading" },
  { value: "finished", label: "Finished" },
];

export default function ListPage() {
  const { items, loaded, setStatus, removeBook } = useList();
  const [activeTab, setActiveTab] = useState<ReadingStatus>("to-read");

  if (!loaded) return <p className="muted">Loading...</p>;

  const visible = items.filter((item) => item.status === activeTab);

  return (
    <div>
      <h1>My List</h1>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={activeTab === tab.value ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label} (
            {items.filter((item) => item.status === tab.value).length})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="muted">
          Nothing here yet. <Link href="/search" className="back-link">Find a book</Link>
        </p>
      ) : (
        <ul className="list-items">
          {visible.map((item) => {
            const cover = coverUrl(item.coverId, "S");
            return (
              <li key={item.id} className="list-item">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={`Cover of ${item.title}`} />
                ) : (
                  <div className="list-item-placeholder">No cover</div>
                )}

                <div className="list-item-info">
                  <Link href={`/book/${item.id}`}>
                    <strong>{item.title}</strong>
                  </Link>
                  <p className="muted">{item.author}</p>
                </div>

                <select
                  value={item.status}
                  onChange={(e) => setStatus(item, e.target.value as ReadingStatus)}
                >
                  <option value="to-read">To Read</option>
                  <option value="reading">Reading</option>
                  <option value="finished">Finished</option>
                </select>
                <button className="remove-btn" onClick={() => removeBook(item.id)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}