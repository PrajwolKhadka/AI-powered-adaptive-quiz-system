// // // "use client";

// // // import Link from "next/link";
// // // import { useAuth } from "@/context/AuthContext";
// // // import { useRouter } from "next/navigation";
// // // import { useEffect } from "react";

// // // export default function SchoolLayout({ children }: { children: React.ReactNode }) {
// // //   const { user, isAuthenticated, loading, logout } = useAuth();
// // //   const router = useRouter();

// // //   useEffect(() => {
// // //     if (!loading && (!isAuthenticated || user?.role !== "SCHOOL")) {
// // //       router.replace("/login");
// // //     }
// // //   }, [loading, isAuthenticated, user]);

// // //   if (loading) return <div className="p-6">Loading...</div>;
// // //   if (!isAuthenticated || user?.role !== "SCHOOL") return null;

// // //   return (
// // //     <div className="flex min-h-screen">
// // //       {/* Sidebar */}
// // //       <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col">
// // //         <h2 className="text-xl font-bold mb-6">School Dashboard</h2>

// // //         <nav className="flex flex-col gap-3">
// // //           <Link href="/school/dashboard" className="hover:bg-gray-700 p-2 rounded">
// // //             Student Management
// // //           </Link>
// // //           <Link href="/school/quizzes" className="hover:bg-gray-700 p-2 rounded">
// // //             Quiz Management
// // //           </Link>
// // //         </nav>

// // //         <button
// // //           onClick={logout}
// // //           className="mt-auto bg-red-600 p-2 rounded"
// // //         >
// // //           Logout
// // //         </button>
// // //       </aside>

// // //       {/* Content */}
// // //       <main className="flex-1 p-6 bg-gray-50">
// // //         {children}
// // //       </main>
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import Link from "next/link";
// // import Image from "next/image";
// // import { useAuth } from "@/context/AuthContext";
// // import { useRouter, usePathname } from "next/navigation";
// // import { useEffect } from "react";

// // export default function SchoolLayout({ children }: { children: React.ReactNode }) {
// //   const { user, isAuthenticated, loading, logout } = useAuth();
// //   const router = useRouter();
// //   const pathname = usePathname();

// //   useEffect(() => {
// //     if (!loading && (!isAuthenticated || user?.role !== "SCHOOL")) {
// //       router.replace("/login");
// //     }
// //   }, [loading, isAuthenticated, user]);

// //   if (loading) return <div className="p-6">Loading...</div>;
// //   if (!isAuthenticated || user?.role !== "SCHOOL") return null;

// //   const navItem = (href: string, label: string) => {
// //     const active = pathname.startsWith(href);
// //     return (
// //       <Link
// //         href={href}
// //         className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
// //           ${active
// //             ? "bg-blue-600 text-white shadow"
// //             : "text-gray-300 hover:bg-gray-800 hover:text-white"
// //           }`}
// //       >
// //         <span className="text-sm font-medium">{label}</span>
// //       </Link>
// //     );
// //   };

// //   return (
// //     <div className="flex min-h-screen bg-gray-100">
// //       {/* Sidebar */}
// //       <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
// //         {/* Logo */}
// //         <div className="px-6 py-5 border-b border-gray-800 gap-3">
// //          <div className="w-10 h-10 relative">
// //             <Image
// //               src="/images/logo.png" // <-- your logo path
// //               alt="Logo"
// //               fill
// //               className="object-contain"/>
// //           </div>
// //         </div>

// //         {/* Navigation */}
// //         <nav className="flex-1 px-3 py-4 space-y-1">
// //           {navItem("/school/dashboard", "Student Management")}
// //           {navItem("/school/quizzes", "Quiz Management")}
// //         </nav>

// //         {/* Logout */}
// //         <div className="p-4 border-t border-gray-800">
// //           <button
// //             onClick={logout}
// //             className="w-full bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-medium"
// //           >
// //             Logout
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Main Content */}
// //       <main className="flex-1 p-8">{children}</main>
// //     </div>
// //   );
// // }
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect } from "react";

// export default function SchoolLayout({ children }: { children: React.ReactNode }) {
//   const { user, isAuthenticated, loading, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (!loading && (!isAuthenticated || user?.role !== "SCHOOL")) {
//       router.replace("/login");
//     }
//   }, [loading, isAuthenticated, user]);

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (!isAuthenticated || user?.role !== "SCHOOL") return null;

//   const navItem = (href: string, label: string) => {
//     const active = pathname.startsWith(href);
//     // while loading, show spinner
//   if (loading) return <div className="p-6">Loading...</div>;

//   // if not authenticated, show nothing but avoid returning null immediately
//   if (!isAuthenticated) return <div className="p-6">Redirecting...</div>;
  
//     return (
//       <Link
//         href={href}
//         className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
//           ${active
//             ? "bg-blue-600 text-white shadow"
//             : "text-gray-300 hover:bg-gray-800 hover:text-white"
//           }`}
//       >
//         <span className="text-sm font-medium">{label}</span>
//       </Link>
//     );
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
//         {/* Logo */}
//         <div className="px-6 py-6 border-b border-gray-800 flex items-center justify-center">
//           <div className="w-full h-28 relative">
//             <Image
//               src="/images/logo(white).png"
//               alt="Logo"
//               fill
//               className="object-contain"
//             />
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-3 py-4 space-y-1">
//           {navItem("/school/dashboard", "Student Management")}
//           {navItem("/school/quizzes", "Quiz Management")}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-800">
//           <button
//             onClick={logout}
//             className="w-full bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-medium"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8">{children}</main>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "SCHOOL")) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "SCHOOL") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 font-medium">Redirecting...</p>
      </div>
    );
  }

  const navItem = (href: string, label: string) => {
    const active = pathname.startsWith(href);
    
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
          ${active
            ? "bg-blue-600 text-white shadow"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
      >
        <span className="text-sm font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-800 flex items-center justify-center shrink-0">
          <div className="w-full h-28 relative">
            <Image
              src="/images/logo(white).png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItem("/school/dashboard", "Student Management")}
          {navItem("/school/quizzes", "Quiz Management")}
          {navItem("/school/resources", "Resource Management")}
          {navItem("/school/results", "Results Dashboard")}

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800 shrink-0">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
            <Toaster position="top-right" />
          {children}
        </div>
      </main>
    </div>
  );
}