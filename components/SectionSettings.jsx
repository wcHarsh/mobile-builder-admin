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
import { Pencil, Trash, View } from 'lucide-react'
import SectionSettingsAddEditModal from './SectionComponents/SectionSettingsAddEditModal'
import { toast } from 'sonner'
import { ApiDelete } from '@/Utils/axiosFunctions'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function SectionSettings({ sectionSettingsData, section, screenid }) {
    console.log('sectionSettingsData', sectionSettingsData)
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [templateData, setTemplateData] = useState({
        label: '',
        name: '',
        type: '',
        value: '',
        options: [],
        min: null,
        max: null,
        navigation_value: '',
        limit: null,
    })
    const [isEdit, setIsEdit] = useState(false)

    const onEdit = (data) => {
        console.log('data', data)
        setIsOpen(true)
        setTemplateData({
            label: data.label,
            name: data.name,
            type: data.type,
            value: data.value,
            options: data.options || [],
            min: data.min,
            max: data.max,
            navigation_value: data.navigation_value,
            limit: data.limit,
        })
        setIsEdit(true)
    }

    const onDelete = async (data) => {
        // Show SweetAlert confirmation
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete setting "${data.label}"?`,
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
                    text: 'Please wait while we delete the setting.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                const deleteResponse = await ApiDelete(`admin/sections/dev/${data.id}`)

                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    text: deleteResponse?.message || 'Setting has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })

                // Refresh the page data
                router.refresh()
            } catch (error) {
                // Show error message
                Swal.fire({
                    title: 'Error!',
                    text: error?.message || 'Error deleting setting',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Section Settings</h2>
                <Button
                    onClick={() => {
                        setIsOpen(true)
                        setTemplateData({
                            label: '',
                            name: '',
                            type: '',
                            value: '',
                            options: [],
                            min: null,
                            max: null,
                            navigation_value: '',
                            limit: null,

                        })
                        setIsEdit(false)
                    }}
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                >
                    Add New Setting
                </Button>
            </div>

            <input
                type="text"
                placeholder="Search settings..."
                className="w-1/3 outline-none bg-white p-2 border border-gray-200 rounded-lg"
            />

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">Label</TableHead>
                            <TableHead className="font-semibold text-gray-700">Type</TableHead>
                            <TableHead className="font-semibold text-gray-700">Value</TableHead>
                            <TableHead className="font-semibold text-gray-700">Order Index</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sectionSettingsData.map((setting) => {
                            return (
                                <TableRow key={setting.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <TableCell className="font-medium text-gray-900">
                                        {setting.label}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600 capitalize">
                                            {setting.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {setting.type === 'color' ? (
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-6 h-6 rounded border border-gray-300"
                                                    style={{ backgroundColor: setting.value }}
                                                ></div>
                                                <span>{setting.value}</span>
                                            </div>
                                        ) : (
                                            setting?.value == true ? 'True' : setting?.value == false ? 'False' : setting?.value || 'No value'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {setting.orderIndex}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-blue-50 hover:border-blue-300 group transition-all duration-200"
                                                onClick={() => onEdit(setting)}
                                            >
                                                <Pencil className="size-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-all duration-200"
                                                onClick={() => onDelete(setting)}
                                            >
                                                <Trash className="size-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-green-50 hover:border-green-300 group transition-all duration-200"
                                            >
                                                <View className="size-4 text-gray-600 group-hover:text-green-600 transition-colors duration-200" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <SectionSettingsAddEditModal
                {...{
                    isOpen,
                    setIsOpen,
                    templateData,
                    isEdit,

                }}
            />
        </div>
    )
}
