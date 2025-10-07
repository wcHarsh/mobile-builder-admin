'use client'
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { ApiDelete } from '@/Utils/axiosFunctions'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import IconAddEditModal from './IconComponents/IconAddEditModal'

export default function IconList({ iconData }) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [templateData, setTemplateData] = useState({
        name: '',
        icon: '',
        id: '',
    })
    const [isEdit, setIsEdit] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const onEdit = (data) => {
        setIsOpen(true)
        setTemplateData({
            name: data.name,
            icon: data.icon,
            id: data.id,
        })
        setIsEdit(true)
    }

    const onDelete = async (data) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete icon "${data.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        })

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait while we delete the icon.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                const deleteResponse = await ApiDelete(`admin/icons?id=${data.id}`)

                Swal.fire({
                    title: 'Deleted!',
                    text: deleteResponse?.message || 'Icon has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })

                router.refresh()
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error?.message || 'Error deleting icon',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard!')
    }

    const filteredIcons = iconData.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.icon.toLowerCase().includes(searchTerm.toLowerCase())
    )


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Icons</h2>
                <Button
                    onClick={() => {
                        setIsOpen(true)
                        setTemplateData({
                            name: '',
                            icon: '',
                            id: '',
                        })
                        setIsEdit(false)
                    }}
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                >
                    Add New Icon
                </Button>
            </div>

            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/3 outline-none bg-white p-2 border border-gray-200 rounded-lg"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Icon</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredIcons.map((icon) => {
                            return (
                                <TableRow key={icon.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <TableCell className="font-medium text-gray-900">
                                        {icon.id}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">
                                        {icon.name}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                                                <div
                                                    className="text-lg"
                                                    dangerouslySetInnerHTML={{ __html: icon.icon }}
                                                />
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-gray-50 hover:border-gray-300 group transition-all duration-200"
                                                onClick={() => copyToClipboard(icon.icon)}
                                            >
                                                <Copy className="size-4 text-gray-600 group-hover:text-gray-700 transition-colors duration-200" />
                                            </Button>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-blue-50 hover:border-blue-300 group transition-all duration-200"
                                                onClick={() => onEdit(icon)}
                                            >
                                                <Pencil className="size-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-all duration-200"
                                                onClick={() => onDelete(icon)}
                                            >
                                                <Trash className="size-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            <IconAddEditModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                templateData={templateData}
                isEdit={isEdit}
            />
        </div>
    )
}
