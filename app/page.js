import Reservations from "./reservations";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <h1>Community Library</h1>
        <p>Pick your member ID, then reserve any book from the catalog.</p>
      </header>
      <Reservations />
    </main>
  );
}
