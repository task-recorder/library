"use client";

// Every API call happens here, in the browser. The page talks to API Gateway
// directly, so API Gateway's CORS settings decide whether the calls are allowed.

import { useCallback, useEffect, useState } from "react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
const MEMBERS = ["M-1001", "M-1002", "M-1003"];
const UNREACHABLE = "Couldn't reach the reservation service";

async function getJson(path, options) {
  const res = await fetch(`${API_URL}${path}`, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

export default function Reservations() {
  const [books, setBooks] = useState([]);
  const [booksError, setBooksError] = useState("");
  const [memberId, setMemberId] = useState(MEMBERS[0]);
  const [reservations, setReservations] = useState([]);
  const [listError, setListError] = useState("");
  const [busyBookId, setBusyBookId] = useState("");
  const [message, setMessage] = useState("");

  const loadReservations = useCallback(async (member) => {
    try {
      const data = await getJson(`/reservations/${encodeURIComponent(member)}`);
      setReservations(data.reservations);
      setListError("");
    } catch {
      setReservations([]);
      setListError(UNREACHABLE);
    }
  }, []);

  useEffect(() => {
    if (!API_URL) return;
    getJson("/books")
      .then((data) => setBooks(data.books))
      .catch(() => setBooksError(UNREACHABLE));
  }, []);

  useEffect(() => {
    if (!API_URL) return;
    loadReservations(memberId);
  }, [memberId, loadReservations]);

  async function reserve(book) {
    setBusyBookId(book.bookId);
    setMessage("");
    try {
      await getJson("/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, bookId: book.bookId }),
      });
      setMessage(`Reserved "${book.title}" for ${memberId}.`);
      await loadReservations(memberId);
    } catch {
      setMessage(UNREACHABLE);
    } finally {
      setBusyBookId("");
    }
  }

  if (!API_URL) {
    return (
      <p className="notice error">
        The reservation service address is not configured. Set NEXT_PUBLIC_API_URL and rebuild.
      </p>
    );
  }

  return (
    <div className="layout">
      <section className="catalog" aria-labelledby="catalog-heading">
        <div className="section-head">
          <h2 id="catalog-heading">Catalog</h2>
          <label className="member-picker">
            Member ID
            <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              {MEMBERS.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
        </div>

        {message && <p className="notice">{message}</p>}
        {booksError && <p className="notice error">{booksError}</p>}
        {!booksError && books.length === 0 && <p className="muted">Loading books…</p>}

        <ul className="book-list">
          {books.map((book) => (
            <li key={book.bookId} className="book">
              <div>
                <p className="book-title">{book.title}</p>
                <p className="muted">
                  {book.author} · {book.genre}
                </p>
              </div>
              <button
                type="button"
                onClick={() => reserve(book)}
                disabled={busyBookId === book.bookId}
              >
                {busyBookId === book.bookId ? "Reserving…" : "Reserve"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="mine" aria-labelledby="mine-heading">
        <h2 id="mine-heading">My reservations</h2>
        <p className="muted">Newest first, for {memberId}</p>
        {listError && <p className="notice error">{listError}</p>}
        {!listError && reservations.length === 0 && <p className="muted">No reservations yet.</p>}
        <ol className="reservation-list">
          {reservations.map((r) => (
            <li key={r.reservedAt}>
              <p className="book-title">{r.title}</p>
              <p className="muted">
                {r.bookId} · {new Date(r.reservedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
