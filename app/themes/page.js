import { CardSkeleton } from "@/components/LoadingSpinner";
import Theme from "@/components/Theme";
import { ApiGet } from "@/Utils/axiosFunctions";
import { Suspense } from "react";

export default async function ThemesPage() {

    const res = await ApiGet(`admin/themes`)
    const themeData = res?.data || []

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Themes</h1>
                <p className="mt-2 text-gray-600">Manage your mobile app themes</p>
            </div>
            <Suspense fallback={<CardSkeleton />}>
                <Theme {...{ themeData }} />
            </Suspense>
        </>
    );
}
