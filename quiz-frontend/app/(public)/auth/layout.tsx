export default function AuthLayout({children}: { children: React.ReactNode }) {
    return (
        <div>
            <div>
                <h1 className="text-black text-4xl">This is a dummy page for now</h1>
            </div>
            {children}
        </div>
    );
}