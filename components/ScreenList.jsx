'use client'
import { ApiGet } from '@/Utils/axiosFunctions'
import React, { useEffect, useState } from 'react'
import LoadingSpinner, { CardSkeleton } from './LoadingSpinner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Home,
    Settings,
    User,
    ShoppingCart,
    Heart,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye
} from 'lucide-react'

export default function ScreenList({ screenid }) {
    const [screenData, setScreenData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const getScreenData = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await ApiGet(`admin/screens?themeId=${screenid}`)
            setScreenData(res?.data || [])
        } catch (err) {
            setError(err?.message || "Failed to fetch screen data")
            console.error('Error fetching screens:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (screenid) {
            getScreenData()
        }
    }, [screenid])

    if (loading) {
        return (
            <LoadingSpinner />
        )
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Screens</h2>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Screens</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button
                        onClick={getScreenData}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    if (!screenData || screenData.length === 0) {
        return (
            <div className="space-y-4">
                {/* <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Screens</h2>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="size-4 mr-2" />
                        Add Screen
                    </Button>
                </div> */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Screens Found</h3>
                    <p className="text-gray-600">No screens are available for this theme.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 pt-10">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Screens</h2>
                {/* <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="size-4 mr-2" />
                    Add Screen
                </Button> */}
            </div>
            <input type="text" placeholder="Search" className="w-1/3 outline-none bg-white p-2 border border-gray-200 rounded-lg" />
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Type</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {screenData.map((screen) => (
                            <TableRow key={screen.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <TableCell className="font-medium text-gray-900">
                                    {screen.name}
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600 capitalize">
                                        {screen.type}
                                    </span>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer"
                                        >
                                            <Edit className="size-4" />
                                        </Button>

                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div >
    )
}
