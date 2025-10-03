'use client'
import React from 'react'

const LoadingSpinner = ({ size = 'md', color = 'blue', text = 'Loading...', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    }

    const colorClasses = {
        blue: 'text-blue-600',
        gray: 'text-gray-600',
        white: 'text-white',
        green: 'text-green-600',
        red: 'text-red-600'
    }

    const spinnerSize = sizeClasses[size] || sizeClasses.md
    const spinnerColor = colorClasses[color] || colorClasses.blue

    const SpinnerIcon = () => (
        <svg
            className={`animate-spin ${spinnerSize} ${spinnerColor}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                <div className="flex flex-col items-center space-y-4">
                    <SpinnerIcon />
                    {text && (
                        <p className="text-gray-600 font-medium">{text}</p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-2">
                <SpinnerIcon />
                {text && (
                    <p className="text-sm text-gray-600">{text}</p>
                )}
            </div>
        </div>
    )
}

// Inline spinner for buttons and small spaces
export const InlineSpinner = ({ size = 'sm', color = 'white' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    }

    const colorClasses = {
        white: 'text-white',
        blue: 'text-blue-600',
        gray: 'text-gray-600'
    }

    return (
        <svg
            className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )
}

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={`h-4 bg-gray-200 rounded mb-2 ${index === lines - 1 ? 'w-3/4' : 'w-full'
                        }`}
                />
            ))}
        </div>
    )
}

// Card skeleton loader
export const CardSkeleton = ({ count = 3 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LoadingSpinner
