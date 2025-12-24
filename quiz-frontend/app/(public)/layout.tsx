import "../globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (

      <div className="flex flex-col min-h-screen">
        <div className="flex-1">{children}</div> 
      </div>

  );
}
