import AdminSidebar from "@/components/admin/Adminsidebar";
import PlatformOverviewBoard from "@/components/admin/PlatformOverviewBoard";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-green-950 flex">
            <AdminSidebar />
            <PlatformOverviewBoard />
        </div>
    );
}