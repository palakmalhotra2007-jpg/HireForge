import "./globals.css";

export const metadata = {
  title: "HireForge AI Panel Simulator",
  description: "A multi-agent AI system for candidate evaluation with evidence-led hiring",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <main style={{ padding: "2rem" }} className="responsive-main">
          {children}
        </main>
      </body>
    </html>
  );
}
