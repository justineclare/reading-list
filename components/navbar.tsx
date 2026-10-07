"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/search", label: "Search" },
  { href: "/list", label: "My List" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="navbar">
      <Link href="/search" className="navbar-brand">Reading List</Link>
      <nav className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname.startsWith(link.href) ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
        <button onClick={handleLogout} className="logout-btn">Log out</button>
      </nav>
    </header>
  );
}