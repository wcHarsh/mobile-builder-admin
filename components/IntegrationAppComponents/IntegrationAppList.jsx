'use client'
import { ApiGet, ApiDelete } from '@/Utils/axiosFunctions'
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Pencil, Trash, Search } from 'lucide-react'
import Badge from "@/components/ui/Badge"
import Image from 'next/image'
import IntegrationAppAddEditModal from './IntegrationAppAddEditModal'
import Swal from 'sweetalert2'
import { getImageUrl } from '@/Utils/commonFunctions'

export default function IntegrationAppList() {
    const [integrationAppData, setIntegrationAppData] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [templateData, setTemplateData] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

    const getIntegrationAppData = useCallback(async (search = '') => {
        try {
            setLoading(true)
            const params = search ? { search } : {}
            const res = await ApiGet('admin/integrations', params)
            const integrationAppData = res?.data || []
            setIntegrationAppData(integrationAppData)
        } catch (error) {
            console.error('Error fetching integration apps:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const getCategories = async () => {
        try {
            const res = await ApiGet('admin/integration-category')
            if (res?.success && res?.data) {
                setCategories(res.data.filter(cat => cat?.isActive))
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => {
            clearTimeout(timer)
        }
    }, [searchTerm])

    useEffect(() => {
        getIntegrationAppData(debouncedSearchTerm)
    }, [debouncedSearchTerm, getIntegrationAppData])

    useEffect(() => {
        getCategories()
    }, [])

    const onAdd = () => {
        setIsOpen(true)
        setTemplateData(null)
        setIsEdit(false)
    }

    const onEdit = (data) => {
        setIsOpen(true)
        setTemplateData({ ...data, category: data?.category?.id })
        setIsEdit(true)
    }

    const onDelete = async (data) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete app "${data?.appName}"?`,
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
                    text: 'Please wait while we delete the app.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                const deleteResponse = await ApiDelete(`admin/integrations?integrationId=${data?.id}`)

                Swal.fire({
                    title: 'Deleted!',
                    text: deleteResponse?.message || 'Integration app has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })

                getIntegrationAppData()
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error?.message || 'Error deleting integration app',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'publish':
                return 'success'
            case 'draft':
                return 'warning'
            case 'archived':
                return 'gray'
            default:
                return 'gray'
        }
    }

    const getTypeVariant = (type) => {
        switch (type?.toLowerCase()) {
            case 'advanced':
                return 'info'
            case 'basic':
                return 'gray'
            default:
                return 'gray'
        }
    }

    const getAccessPlanVariant = (accessPlan) => {
        switch (accessPlan?.toLowerCase()) {
            case 'free':
                return 'success'
            case 'scaleup':
                return 'gray'
            case 'brandup':
                return 'warning'
            case 'omni':
                return 'info'
            default:
                return 'gray'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-600">Loading integration apps...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Integration Apps</h2>

            </div>

            <div className="flex items-center justify-between w-full">
                <div className="relative w-1/4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search integration apps..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <Button
                    onClick={onAdd}
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                >
                    Add New App
                </Button>

            </div>

            {integrationAppData.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Integration Apps Found</h3>
                    <p className="text-gray-600">No integration apps are available.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold text-gray-700">Index</TableHead>
                                <TableHead className="font-semibold text-gray-700">Logo</TableHead>
                                <TableHead className="font-semibold text-gray-700">App Name</TableHead>
                                <TableHead className="font-semibold text-gray-700">Author</TableHead>
                                <TableHead className="font-semibold text-gray-700">Category</TableHead>
                                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                <TableHead className="font-semibold text-gray-700">Type</TableHead>
                                <TableHead className="font-semibold text-gray-700">Access Plan</TableHead>
                                <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {integrationAppData.map((app, index) => (
                                <TableRow key={app?.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <TableCell className="font-medium text-gray-900">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {app?.logo ? (
                                            <Image
                                                src={getImageUrl(app.logo)}
                                                alt={app?.appName || 'App Logo'}
                                                width={40}
                                                height={40}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">No Logo</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">
                                        {app?.appName || '-'}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {app?.author || '-'}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {app?.category?.name || '-'}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        <Badge variant={getStatusVariant(app?.status)}>
                                            {app?.status || 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        <Badge variant={getTypeVariant(app?.type)}>
                                            {app?.type || 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        <Badge variant={getAccessPlanVariant(app?.accessPlan)}>
                                            {app?.accessPlan || 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-blue-50 hover:border-blue-300 group transition-all duration-200"
                                                onClick={() => onEdit(app)}
                                            >
                                                <Pencil className="size-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="size-8 p-0 cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-all duration-200"
                                                onClick={() => onDelete(app)}
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
            )}

            <IntegrationAppAddEditModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                templateData={templateData}
                isEdit={isEdit}
                onSuccess={getIntegrationAppData}
                categories={categories}
            />
        </div>
    )
}
