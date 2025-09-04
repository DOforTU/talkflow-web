import AppHeader from "@/components/headers/AppHeader";
import SmartHeader from "@/components/headers/SmartHeader";
import BottomNav from "@/components/navigation/BottomNav";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="page-container">
            <SmartHeader>
                <AppHeader />
            </SmartHeader>

            {children}
            <BottomNav />
        </div>
    );
}
