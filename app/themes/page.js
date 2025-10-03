import AdminLayout from "@/components/AdminLayout";
import Theme from "@/components/Theme";
import Breadcrumb from "@/components/Breadcrumb";

export default function ThemesPage() {
    const breadcrumbItems = [
        { label: 'Themes' }
    ]

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Themes</h1>
                <p className="mt-2 text-gray-600">Manage your mobile app themes</p>
            </div>

            <Theme />
        </>
    );
}
