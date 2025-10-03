'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
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
    Eye,
    Edit
} from 'lucide-react'

export default function SectionList({ section, sectionData }) {
    const router = useRouter()

    if (!sectionData || sectionData.length === 0) {
        return (
            <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections Found</h3>
                    <p className="text-gray-600">No sections are available for this screen.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Sections</h2>
            </div>
            <input
                type="text"
                placeholder="Search sections..."
                className="w-1/3 outline-none bg-white p-2 border border-gray-200 rounded-lg"
            />
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">Screen ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Type</TableHead>
                            <TableHead className="font-semibold text-gray-700">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Description</TableHead>
                            <TableHead className="font-semibold text-gray-700">Order</TableHead>
                            <TableHead className="font-semibold text-gray-700">Status</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sectionData.map((sectionItem) => (
                            <TableRow key={sectionItem.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <TableCell className="font-medium text-gray-900">
                                    {sectionItem.screenId}
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600 capitalize">
                                        {sectionItem.type}
                                    </span>
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                    {sectionItem.name}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                    {sectionItem.description || 'No description'}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                    {sectionItem.orderIndex}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sectionItem.isVisible
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {sectionItem.isVisible ? 'Visible' : 'Hidden'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer"
                                        // onClick={() => router.push(`/themes/${sectionItem.screenId}/${sectionItem.id}`)}
                                        >
                                            <Eye className="size-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer"
                                        // onClick={() => router.push(`/themes/${sectionItem.screenId}/${sectionItem.id}`)}
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
        </div>
    )
}