import React from 'react'

export default function TabelLayoutSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>

            {/* Action Bar Skeleton */}
            <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-4">
                    <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                    </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-200">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="px-6 py-4">
                            <div className="grid grid-cols-6 gap-4 items-center">
                                {/* Icon Name */}
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                </div>

                                {/* Category */}
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>

                                {/* Usage Count */}
                                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>

                                {/* Status */}
                                <div className="flex items-center">
                                    <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                                </div>

                                {/* Last Used */}
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-6 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="mt-4">
                            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                            <div className="mt-2 h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    )
}
