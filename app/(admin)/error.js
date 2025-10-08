'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Home, RotateCcw } from 'lucide-react'

export default function Error({ error, reset }) {
    const router = useRouter()

    const getErrorMessage = (error) => {
        if (!error) return 'Unknown error occurred'

        if (error.isSessionExpired || error.message === 'Session expired. Please log in again.') {
            return 'Your session has expired. Please log in again.'
        }

        if (typeof error === 'string') {
            try {
                const parsed = JSON.parse(error)
                return parsed.error?.message || parsed.message || error
            } catch {
                return error
            }
        }

        if (typeof error === 'object') {
            if (error.message && typeof error.message === 'string') {
                try {
                    const parsedMessage = JSON.parse(error.message)
                    if (parsedMessage.error && parsedMessage.error.message) {
                        return parsedMessage.error.message
                    }
                    if (parsedMessage.message) {
                        return parsedMessage.message
                    }
                } catch {
                    return error.message
                }
            }

            if (error.error && error.error.message) {
                return error.error.message
            }

            if (error.message) {
                return error.message
            }

            if (error.digest) {
                return `Error occurred (${error.digest})`
            }
        }

        return 'We encountered an unexpected error. Don\'t worry, our team has been notified and is working to fix it.'
    }

    const handleGoToDashboard = () => {
        if (isSessionExpired) {
            router.push('/login')
        } else {
            router.push('/dashboard')
        }
    }

    const isSessionExpired = error.isSessionExpired || error.message === 'Session expired. Please log in again.';
    React.useEffect(() => {
        if (isSessionExpired) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem("mobile_builder_user_data");
                localStorage.removeItem("persist:root");
                localStorage.removeItem("mainScreenType");
                localStorage.removeItem("mainSectionName");
                localStorage.removeItem("mainBlockName");
                localStorage.removeItem("mainThemeName");

                document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "mobile_builder_user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
            setTimeout(() => {
                window.location.href = '/login';
            }, 100);
        }
    }, [isSessionExpired, router]);

    return (
        <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center size-24 rounded-full bg-red-100 mb-6">
                        <svg
                            className="size-12 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {isSessionExpired ? 'Session Expired' : 'Oops! Something went wrong'}
                    </h1>

                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                        {getErrorMessage(error)}
                    </p>

                    {process.env.NODE_ENV === 'development' && error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                            <h3 className="text-sm font-medium text-red-800 mb-2">Error Details:</h3>
                            <pre className="text-xs text-red-700 overflow-auto">
                                {getErrorMessage(error)}
                            </pre>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGoToDashboard}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <Home className="size-5 mr-2" />
                            {isSessionExpired ? 'Go to Login' : 'Go to Dashboard'}
                        </button>

                        <button
                            onClick={reset}
                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <RotateCcw className="size-5 mr-2" />
                            Try Again
                        </button>
                    </div>

                    <div className="mt-8 text-sm text-gray-500">
                        <p>
                            If this problem persists, please{' '}
                            <a
                                href="#"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                contact support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
