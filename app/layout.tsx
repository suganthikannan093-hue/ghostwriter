import "./globals.css";
import type { ReactNode } from "react";

export const metadata = { title: "GhostWriter — resurrect dead ideas into Kiro specs", description: "Paste abandoned notes or dead tech; get a Kiro spec and runnable starter." };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
