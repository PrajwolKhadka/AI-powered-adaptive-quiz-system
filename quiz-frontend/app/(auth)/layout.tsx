import Image from "next/image";
import { Toaster } from "react-hot-toast";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
            <div >
              <Toaster position="top-right" />
              {children}
            </div>
  );
}
