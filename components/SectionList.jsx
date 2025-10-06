'use client'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Home,
    Eye,
    Edit,
    Pencil,
    Trash,
    View,
    Settings
} from 'lucide-react'
import SectionAddEditModal from './SectionComponents/SectionAddEditModal'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { ApiDelete } from '@/Utils/axiosFunctions'
import Swal from 'sweetalert2'

export default function SectionList({ sectionData, screenData, section }) {
    console.log('sectionData', sectionData)
    console.log('screenData', screenData)
    const router = useRouter()
    const { screenid } = useParams()
    const [isOpen, setIsOpen] = useState(false)
    const [templateData, setTemplateData] = useState({
        type: '',
        name: '',
        icon: '',
        description: '',
        is_deleted: true,
        is_visible: true
    })
    const [isEdit, setIsEdit] = useState(false)

    const onEdit = (data) => {
        console.log('data', data)
        setIsOpen(true)
        setTemplateData({
            type: data.type,
            name: data.name,
            icon: data.icon,
            description: data.description,
            is_deleted: data.is_deleted,
            is_visible: data.is_visible,
        })
        setIsEdit(true)
    }

    const onDelete = async (data) => {
        // Show SweetAlert confirmation
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete section "${data.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        })

        // If user confirms deletion
        if (result.isConfirmed) {
            try {
                // Show loading state
                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait while we delete the section.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                const deleteResponse = await ApiDelete(`admin/sections/dev/?mainThemeId=${screenid}&mainScreenType=${screenData}&mainSectionName=${data?.name}`)

                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    text: deleteResponse?.message || 'Section has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })

                // Refresh the page data
                router.refresh()
            } catch (error) {
                // Show error message
                Swal.fire({
                    title: 'Error!',
                    text: error?.message || 'Error deleting section',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Sections</h2>
                <Button
                    onClick={() => {
                        setIsOpen(true)
                        setTemplateData(null)
                        setIsEdit(false)
                    }}
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                >
                    Add New Section
                </Button>
            </div>
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder="Search sections..."
                    className="w-1/3 outline-none bg-white p-2 border border-gray-200 rounded-lg"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">Screen ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Section ID</TableHead>
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
                                <TableCell className="font-medium text-gray-900">
                                    {sectionItem.id}
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
                                    {/* <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sectionItem.isVisible
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {sectionItem.isVisible ? 'Visible' : 'Hidden'}
                                    </span> */}
                                    <Button variant="outline" size="sm" className="bg-green-600 text-white cursor-pointer hover:bg-green-700" onClick={() => router.push(`/themes/${screenid}/${section}/block/${sectionItem.id}`)}>See Blocks</Button>

                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer hover:bg-blue-50 hover:border-blue-300 group transition-all duration-200"
                                            onClick={() => {
                                                onEdit(sectionItem)
                                            }}
                                        >
                                            <Pencil className="size-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                onDelete(sectionItem)
                                            }}
                                            className="size-8 p-0 cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-all duration-200"
                                        >
                                            <Trash className="size-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer hover:bg-green-50 hover:border-green-300 group transition-all duration-200"
                                            onClick={() => {
                                                router.push(`/themes/${screenid}/${sectionData[0]?.screenId}/${sectionItem.id}`),
                                                    localStorage.setItem('mainSectionName', sectionItem.name)
                                            }}
                                        >
                                            <Settings className="size-4 text-gray-600 group-hover:text-green-600 transition-colors duration-200" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <SectionAddEditModal {...{ isOpen, setIsOpen, templateData, isEdit, screenData }} />
        </div>
    )
}