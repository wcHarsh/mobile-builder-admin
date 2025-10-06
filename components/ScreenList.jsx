'use client'
import { ApiGet } from '@/Utils/axiosFunctions'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
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
    Edit,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ScreenList({ screenid, screenData }) {
    const router = useRouter()
    if (!screenData || screenData.length === 0) {
        return (
            <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Screens Found</h3>
                    <p className="text-gray-600">No screens are available for this theme.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 ">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Screens</h2>
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
                                    <span className="text-sm text-gray-600">
                                        {screen.type}
                                    </span>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer"
                                            onClick={() => {
                                                router.push(`/themes/${screenid}/${screen.id}`),
                                                    localStorage.setItem('mainScreenType', screen.type)
                                            }}
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
