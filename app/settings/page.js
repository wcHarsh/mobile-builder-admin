import AdminLayout from "@/components/AdminLayout";
import Breadcrumb from "@/components/Breadcrumb";

export default function SettingsPage() {
    const breadcrumbItems = [
        { label: 'Settings' }
    ]

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="mt-2 text-gray-600">Manage your application settings</p>
            </div>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Application Name</label>
                            <input
                                type="text"
                                defaultValue="Mobile Admin"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows={3}
                                defaultValue="Mobile application admin panel"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Default Theme</label>
                            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option>Modern Blue</option>
                                <option>Nature Green</option>
                                <option>Royal Purple</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                id="two-factor"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="two-factor" className="ml-2 block text-sm text-gray-900">
                                Enable Two-Factor Authentication
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="session-timeout"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                            />
                            <label htmlFor="session-timeout" className="ml-2 block text-sm text-gray-900">
                                Auto-logout after 30 minutes of inactivity
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="login-notifications"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                            />
                            <label htmlFor="login-notifications" className="ml-2 block text-sm text-gray-900">
                                Email notifications for login attempts
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                id="email-notifications"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                            />
                            <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                                Email notifications
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="push-notifications"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                            />
                            <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-900">
                                Push notifications
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="sms-notifications"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-900">
                                SMS notifications
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                        Save Settings
                    </button>
                </div>
            </div>
        </>
    );
}
