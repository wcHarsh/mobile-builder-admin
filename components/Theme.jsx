'use client'
import React, { useEffect, useState } from 'react'
import { ApiGet } from '@/Utils/axiosFunctions'
import Image from 'next/image'
import Link from 'next/link'
import { CardSkeleton } from './LoadingSpinner'
import { toast } from 'sonner'

export default function Theme() {
    const [theme, setTheme] = useState([])
    const [loading, setLoading] = useState(true)

    const getTheme = async () => {
        try {
            setLoading(true)

            const res = await ApiGet('admin/themes')
            setTheme(res?.data || [])
            toast.success("Template fetched successfully")
        } catch (err) {
            toast.error(err?.message || "Failed to fetch templates")

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTheme()
    }, [])

    if (loading) {
        return (
            <div className="py-10">
                <CardSkeleton count={8} />
            </div>
        )
    }


    if (!theme || theme.length === 0) {
        return (
            <div className="py-10 text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Themes Found</h3>
                    <p className="text-gray-600">No themes are available at the moment.</p>
                </div>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-10'>
            {theme?.map((item) => (
                <div key={item?.id} className='rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
                    <Link href={`/themes/${item?.id}`}>
                        <div className="relative">
                            <Image
                                src={item?.images[0]}
                                alt={item?.name}
                                width={100}
                                height={100}
                                className='size-full cursor-pointer rounded-lg'
                            />
                            <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <span className="text-white opacity-0 hover:opacity-100 transition-opacity font-medium">
                                    View Details
                                </span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium text-gray-900">{item?.name}</h3>
                            <p className="text-sm text-gray-500">Click to view details</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}
