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
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { ApiDelete, ApiPost, ApiPut } from '@/Utils/axiosFunctions'
import Swal from 'sweetalert2'
import BlockAddEditModal from './BlockAddEditModal'
import Badge from '../ui/Badge'

export default function BlockList({ blockData, section, screenid, blockid }) {
    console.log('blockData', blockData)
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [templateData, setTemplateData] = useState({
        name: '',
        icon: '',
        isVisible: true,
        isDeleted: true,
        options: null
    })
    const [isEdit, setIsEdit] = useState(false)
    const [draggedItem, setDraggedItem] = useState(null)
    const [blocks, setBlocks] = useState(blockData || [])

    // Update blocks when blockData changes
    React.useEffect(() => {
        setBlocks(blockData || [])
    }, [blockData])

    const onEdit = (data) => {
        console.log('data', data)
        setIsOpen(true)
        setTemplateData({
            name: data.name,
            icon: data.icon,
            isVisible: data.isVisible,
            isDeleted: data.isDeleted,
            options: data.options,
        })
        setIsEdit(true)
    }

    const onDelete = async (data) => {
        // Show SweetAlert confirmation
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete block "${data.name}"?`,
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
                    text: 'Please wait while we delete the block.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                const deleteResponse = await ApiDelete(`admin/sections/blocks/dev?mainThemeId=${screenid}&mainScreenType=${getLocalStorageItem('mainScreenType')}&mainSectionName=${getLocalStorageItem('mainSectionName')}&mainBlockName=${data.name}`)

                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    text: deleteResponse?.message || 'Block has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })

                // Refresh the page data
                router.refresh()
            } catch (error) {
                // Show error message
                Swal.fire({
                    title: 'Error!',
                    text: error?.message || 'Error deleting block',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }

    // Drag and Drop Handlers
    const handleDragStart = (e, block) => {
        setDraggedItem(block)
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

    const handleDrop = async (e, targetBlock) => {
        e.preventDefault()

        if (!draggedItem || draggedItem.id === targetBlock.id) {
            return
        }

        // Create new array with reordered items
        const draggedIndex = blocks.findIndex(item => item.id === draggedItem.id)
        const targetIndex = blocks.findIndex(item => item.id === targetBlock.id)

        const newBlocks = [...blocks]
        const [draggedBlock] = newBlocks.splice(draggedIndex, 1)
        newBlocks.splice(targetIndex, 0, draggedBlock)

        setBlocks(newBlocks)

        // Call API to reorder
        try {
            const reorderedIds = newBlocks.map(block => block.id)
            const payload = {
                mainThemeId: parseInt(screenid),
                mainScreenType: getLocalStorageItem('mainScreenType'),
                mainSectionName: getLocalStorageItem('mainSectionName'),
                mainBlockIds: reorderedIds
            }

            await ApiPost('admin/sections/blocks/dev/reorder', payload)

            toast.success('Blocks reordered successfully')
            router.refresh()
        } catch (error) {
            console.error('Error reordering blocks:', error)
            toast.error('Failed to reorder blocks')
            // Revert the local state on error
            setBlocks(blockData || [])
        }
    }


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-5">
                    <h2 className="text-2xl font-bold text-gray-900">Blocks</h2>
                    <Badge variant="success">{getLocalStorageItem('mainThemeName')}</Badge>
                </div>
                <Button
                    onClick={() => {
                        setIsOpen(true)
                        setTemplateData({
                            name: '',
                            icon: '',
                            isVisible: true,
                            isDeleted: true,
                            options: null
                        })
                        setIsEdit(false)
                    }}
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                >
                    Add New Block
                </Button>
            </div>

            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder="Search blocks..."
                    className="w-1/3 outline-none bg-white p-2 border border-gray-200 rounded-lg"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-12 font-semibold text-gray-700">Drag</TableHead>
                            <TableHead className="font-semibold text-gray-700">ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Order</TableHead>
                            <TableHead className="font-semibold text-gray-700">Status</TableHead>
                            <TableHead className="font-semibold text-gray-700">Created</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blocks.map((block) => {
                            return (
                                <TableRow
                                    key={block.id}
                                    className="hover:bg-gray-50 border-b border-gray-100 cursor-move"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, block)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, block)}
                                >
                                    <TableCell className="w-12">
                                        <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded">
                                            <GripVertical className="size-4 text-gray-400" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">
                                        {block.id}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">
                                        {block.name}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {Number(block.orderIndex).toFixed(0)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${block.isVisible
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {block.isVisible ? 'Visible' : 'Hidden'}
                                            </span>
                                            {block.isDeleted && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Deleted
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {new Date(block.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {/* <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-green-50 hover:border-green-300 group transition-all duration-200"
                                                onClick={() => toggleVisibility(block)}
                                            >
                                                {block.isVisible ? (
                                                    <EyeOff className="size-4 text-gray-600 group-hover:text-green-600 transition-colors duration-200" />
                                                ) : (
                                                    <Eye className="size-4 text-gray-600 group-hover:text-green-600 transition-colors duration-200" />
                                                )}
                                            </Button> */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-blue-50 hover:border-blue-300 group transition-all duration-200"
                                                onClick={() => onEdit(block)}
                                            >
                                                <Pencil className="size-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-all duration-200"
                                                onClick={() => onDelete(block)}
                                            >
                                                <Trash className="size-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-all duration-200"
                                                onClick={() => {
                                                    setLocalStorageItem('mainBlockName', block.name)
                                                    router.push(`/themes/${screenid}/${section}/block/${blockid}/${block?.id}`)
                                                }}
                                            >
                                                <Settings className="size-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <BlockAddEditModal
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