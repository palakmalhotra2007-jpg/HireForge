import "./globals.css";

export const metadata = {
  title: "AI Interview Panel Simulator",
  description: "A multi-agent AI system for candidate evaluation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: "2rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
