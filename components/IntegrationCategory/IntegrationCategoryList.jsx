'use client'

import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, GripVertical, Trash } from 'lucide-react'
import Badge from "../ui/Badge"
import IntegrationCategoryAddEditModal from './IntegrationCategoryAddEditModal'
import { ApiPost, ApiDelete } from '@/Utils/axiosFunctions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function IntegrationCategoryList({ integrationCategoryData }) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [templateData, setTemplateData] = useState({
        name: '',
        isActive: true,
        description: null,
        id: '',
    })
    const [isEdit, setIsEdit] = useState(false)
    const [draggedItem, setDraggedItem] = useState(null)
    const [categories, setCategories] = useState(integrationCategoryData || [])

    // Update categories when integrationCategoryData changes
    useEffect(() => {
        setCategories(integrationCategoryData || [])
    }, [integrationCategoryData])

    const onEdit = (data) => {
        setIsOpen(true)
        setTemplateData({
            name: data.name || '',
            isActive: data.isActive ?? true,
            description: data.description || null,
            orderIndex: data.orderIndex ?? 0,
            id: data.id,
        })
        setIsEdit(true)
    }

    const onAdd = () => {
        setIsOpen(true)
        setTemplateData({
            name: '',
            isActive: true,
            description: null,
            id: '',
        })
        setIsEdit(false)
    }

    const onDelete = async (data) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete category "${data.name}"?`,
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
                    text: 'Please wait while we delete the category.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                const deleteResponse = await ApiDelete(`admin/integration-category?integrationCategoryId=${data.id}`)

                Swal.fire({
                    title: 'Deleted!',
                    text: deleteResponse?.message || 'Category has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })

                router.refresh()
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error?.message || 'Error deleting category',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }

    // Drag and Drop Handlers
    const handleDragStart = (e, category) => {
        setDraggedItem(category)
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

    const handleDrop = async (e, targetCategory) => {
        e.preventDefault()

        if (!draggedItem || draggedItem.id === targetCategory.id) {
            return
        }

        // Create new array with reordered items
        const draggedIndex = categories.findIndex(item => item.id === draggedItem.id)
        const targetIndex = categories.findIndex(item => item.id === targetCategory.id)

        const newCategories = [...categories]
        const [draggedCategory] = newCategories.splice(draggedIndex, 1)
        newCategories.splice(targetIndex, 0, draggedCategory)

        setCategories(newCategories)

        // Call API to reorder
        try {
            const categoryIds = newCategories.map(category => category.id)
            const payload = {
                categoryIds: categoryIds
            }

            await ApiPost('admin/integration-category/reorder', payload)

            toast.success('Categories reordered successfully')
            router.refresh()
        } catch (error) {
            console.error('Error reordering categories:', error)
            toast.error('Failed to reorder categories')
            // Revert the local state on error
            setCategories(integrationCategoryData || [])
        }
    }

    if (!integrationCategoryData || integrationCategoryData.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Integration Categories</h2>
                    <Button
                        onClick={onAdd}
                        className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                    >
                        Add New Category
                    </Button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Integration Categories Found</h3>
                    <p className="text-gray-600">No integration categories are available.</p>
                </div>
                <IntegrationCategoryAddEditModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    templateData={templateData}
                    isEdit={isEdit}
                    integrationCategoryData={integrationCategoryData || []}
                />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Integration Categories</h2>
                <Button
                    onClick={onAdd}
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                >
                    Add New Category
                </Button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-12 font-semibold text-gray-700">Drag</TableHead>
                            <TableHead className="font-semibold text-gray-700">ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Active Status</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category, index) => (
                            <TableRow
                                key={category.id}
                                className="hover:bg-gray-50 border-b border-gray-100 cursor-move"
                                draggable
                                onDragStart={(e) => handleDragStart(e, category)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, category)}
                            >
                                <TableCell className="w-12">
                                    <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded">
                                        <GripVertical className="size-4 text-gray-400" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                    {category.name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={category.isActive ? 'success' : 'gray'}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer hover:bg-blue-50 hover:border-blue-300 group transition-all duration-200"
                                            onClick={() => onEdit(category)}
                                        >
                                            <Pencil className="size-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-all duration-200"
                                            onClick={() => onDelete(category)}
                                        >
                                            <Trash className="size-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <IntegrationCategoryAddEditModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                templateData={templateData}
                isEdit={isEdit}
                integrationCategoryData={integrationCategoryData || []}
            />
        </div>
    )
}
