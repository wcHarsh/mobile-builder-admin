import AdminLayout from "@/components/AdminLayout";

export default function ThemesPage() {
    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Themes</h1>
                <p className="mt-2 text-gray-600">Manage your mobile app themes</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4"></div>
                        <h3 className="font-semibold text-gray-900">Modern Blue</h3>
                        <p className="text-sm text-gray-600 mt-1">Clean and modern design</p>
                        <div className="mt-4 flex space-x-2">
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                Edit
                            </button>
                            <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                                Preview
                            </button>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="w-full h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-4"></div>
                        <h3 className="font-semibold text-gray-900">Nature Green</h3>
                        <p className="text-sm text-gray-600 mt-1">Fresh and natural look</p>
                        <div className="mt-4 flex space-x-2">
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                Edit
                            </button>
                            <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                                Preview
                            </button>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-4"></div>
                        <h3 className="font-semibold text-gray-900">Royal Purple</h3>
                        <p className="text-sm text-gray-600 mt-1">Elegant and sophisticated</p>
                        <div className="mt-4 flex space-x-2">
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                Edit
                            </button>
                            <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                                Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
