import "./globals.css";

export const metadata = {
  title: "Community Library",
  description: "Reserve books from the Community Library catalog.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
