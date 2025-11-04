'use client'
import React, { useState } from 'react'
import { getLocalStorageItem, setLocalStorageItem } from '@/Utils/localStorage'
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
    Pencil,
    Trash,
    Settings,
    GripVertical
} from 'lucide-react'
import SectionAddEditModal from './SectionComponents/SectionAddEditModal'
import { Button } from './ui/button'
import { ApiDelete, ApiPost, ApiPut } from '@/Utils/axiosFunctions'
import Swal from 'sweetalert2'
import Badge from './ui/Badge'
import { toast } from 'sonner'

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
    const [draggedItem, setDraggedItem] = useState(null)
    const [sections, setSections] = useState(sectionData || [])

    // Update sections when sectionData changes
    React.useEffect(() => {
        setSections(sectionData || [])
    }, [sectionData])

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

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait while we delete the section.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                const deleteResponse = await ApiDelete(`admin/sections/dev/?mainThemeId=${screenid}&mainScreenType=${screenData}&mainSectionName=${data?.name}`)

                Swal.fire({
                    title: 'Deleted!',
                    text: deleteResponse?.message || 'Section has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })

                router.refresh()
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error?.message || 'Error deleting section',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }

    // Drag and Drop Handlers
    const handleDragStart = (e, section) => {
        setDraggedItem(section)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', e.target.outerHTML)
        e.target.style.opacity = '0.5'
    }

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1'
        setDraggedItem(null)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = async (e, targetSection) => {
        e.preventDefault()

        if (!draggedItem || draggedItem.id === targetSection.id) {
            return
        }

        // Create new array with reordered items
        const draggedIndex = sections.findIndex(item => item.id === draggedItem.id)
        const targetIndex = sections.findIndex(item => item.id === targetSection.id)

        const newSections = [...sections]
        const [draggedSection] = newSections.splice(draggedIndex, 1)
        newSections.splice(targetIndex, 0, draggedSection)

        setSections(newSections)

        try {
            const reorderedIds = newSections.map(section => section.id)
            const payload = {
                mainThemeId: parseInt(screenid),
                mainScreenType: screenData,
                mainSectionIds: reorderedIds
            }

            await ApiPut('admin/sections/dev/reorder', payload)

            toast.success('Sections reordered successfully')
            router.refresh()
        } catch (error) {
            console.error('Error reordering sections:', error)
            toast.error('Failed to reorder sections')
            // Revert the local state on error
            setSections(sectionData || [])
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-5">
                    <h2 className="text-2xl font-bold text-gray-900">Sections</h2>
                    <Badge variant="success">{getLocalStorageItem('mainThemeName')}</Badge>
                </div>
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
                            <TableHead className="w-12 font-semibold text-gray-700">Drag</TableHead>
                            <TableHead className="font-semibold text-gray-700">Screen ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Section ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Type</TableHead>
                            <TableHead className="font-semibold text-gray-700">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Description</TableHead>
                            <TableHead className="font-semibold text-gray-700">Order</TableHead>
                            <TableHead className="font-semibold text-gray-700">Blocks</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sections.map((sectionItem) => (
                            <TableRow
                                key={sectionItem.id}
                                className="hover:bg-gray-50 border-b border-gray-100 cursor-move"
                                draggable
                                onDragStart={(e) => handleDragStart(e, sectionItem)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, sectionItem)}
                            >
                                <TableCell className="w-12">
                                    <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded">
                                        <GripVertical className="size-4 text-gray-400" />
                                    </div>
                                </TableCell>
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
                                    {Number(sectionItem.orderIndex).toFixed(0)}
                                </TableCell>
                                <TableCell>
                                    {/* <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sectionItem.isVisible
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {sectionItem.isVisible ? 'Visible' : 'Hidden'}
                                    </span> */}
                                    {sectionItem?.hasBlocks ? (
                                        <Button variant="outline" size="sm" className="bg-green-600 text-white cursor-pointer hover:bg-green-700" onClick={() => { router.push(`/themes/${screenid}/${section}/block/${sectionItem.id}`); setLocalStorageItem('mainSectionName', sectionItem.name) }}>See Blocks</Button>
                                    ) : (
                                        <span className="text-sm text-center text-gray-600">No blocks</span>
                                    )}

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
                                                setLocalStorageItem('mainSectionName', sectionItem.name)
                                                router.push(`/themes/${screenid}/${sections[0]?.screenId}/${sectionItem.id}`)
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