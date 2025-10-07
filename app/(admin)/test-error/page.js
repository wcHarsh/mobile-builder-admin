'use client'
import { useState } from 'react'

export default function TestErrorPage() {
    const [shouldError, setShouldError] = useState(false)

    if (shouldError) {
        throw new Error('This is a test error to check the error page')
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Error Page Testing
                </h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Test Error Boundary</h2>
                    <p className="text-gray-600 mb-4">
                        Click the button below to trigger an error and see the error page in action.
                    </p>
                    <button
                        onClick={() => setShouldError(true)}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Trigger Error
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        What to Check:
                    </h3>
                    <ul className="text-blue-800 space-y-2">
                        <li>✅ Error page displays with proper styling</li>
                        <li>✅ "Go to Dashboard" button works</li>
                        <li>✅ "Try Again" button works</li>
                        <li>✅ Icons are displayed correctly</li>
                        <li>✅ Error details show in development mode</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
