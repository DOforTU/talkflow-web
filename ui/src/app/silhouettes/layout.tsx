import BottomNav from "@/components/navigation/BottomNav";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="page-container">
            {children}
            <BottomNav />
        </div>
    );
}
