'use client'

import { ApiGet, ApiPut } from '@/Utils/axiosFunctions'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import Badge from "@/components/ui/Badge"
import Image from 'next/image'
import Swal from 'sweetalert2'

const statusOptions = [
    'pending',
    'unfinished',
    'finished',
    'in_review',
    'approved',
    'rejected',
    'completed'
]

export default function page() {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('')

    const getApps = async () => {
        try {
            setLoading(true)
            const params = {}
            if (statusFilter) {
                params.appStatus = statusFilter
            }
            const response = await ApiGet('admin/apps', params)
            if (response?.success && response?.data) {
                setApps(response.data)
            }
        } catch (error) {
            console.error('Error fetching apps:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getApps()
    }, [statusFilter])

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'warning'
            case 'approved':
            case 'active':
                return 'success'
            case 'rejected':
                return 'destructive'
            case 'unfinished':
                return 'warning'
            case 'finished':
                return 'info'
            case 'in_review':
                return 'info'
            case 'completed':
                return 'success'
            default:
                return 'gray'
        }
    }

    const handleStatusClick = async (app) => {
        const { value: selectedStatus } = await Swal.fire({
            title: 'Select Status',
            text: 'Choose a status for this app',
            input: 'select',
            inputOptions: statusOptions.reduce((acc, status) => {
                const formattedStatus = status
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                acc[status] = formattedStatus
                return acc
            }, {}),
            inputValue: app.status || '',
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            customClass: {
                input: 'swal2-select-border'
            },
            didOpen: () => {
                const selectElement = document.querySelector('.swal2-select')
                if (selectElement) {
                    selectElement.style.border = '1px solid #d1d5db'
                    selectElement.style.borderRadius = '0.375rem'
                    selectElement.style.padding = '0.5rem'
                }
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to select a status!'
                }
            }
        })

        if (selectedStatus) {
            try {
                // Show loading state
                Swal.fire({
                    title: 'Updating...',
                    text: 'Please wait while we update the status.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                const payload = {
                    id: app.id,
                    status: selectedStatus
                }
                const updateResponse = await ApiPut('admin/apps', payload)

                // Manually update the local state instead of calling API
                setApps(prevApps =>
                    prevApps.map(a =>
                        a.id === app.id ? { ...a, status: selectedStatus } : a
                    )
                )
                Swal.fire({
                    title: 'Updated!',
                    text: updateResponse?.message || 'Status has been updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error?.message || 'Error updating status',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }

    const getPlatformChips = (app) => {
        const platforms = []
        if (app.iosRequestLaunchApp) {
            platforms.push('iOS')
        }
        if (app.androidRequestLaunchApp) {
            platforms.push('Android')
        }
        return platforms
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-600">Loading apps...</div>
            </div>
        )
    }

    if (!apps || apps.length === 0) {
        return (
            <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Apps Found</h3>
                    <p className="text-gray-600">No app submissions are available.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-start gap-5">
                <h2 className="text-2xl font-bold text-gray-900">App Submissions</h2>
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search"
                    className=" min-w-[10px] outline-none bg-white p-2 border border-gray-200 rounded-lg"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="outline-none bg-white p-2 border border-gray-200 rounded-lg text-sm"
                >
                    <option value="">All Status</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                        </option>
                    ))}
                </select>

            </div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">Index</TableHead>
                            <TableHead className="font-semibold text-gray-700">Icon</TableHead>
                            <TableHead className="font-semibold text-gray-700">Title</TableHead>
                            <TableHead className="font-semibold text-gray-700">Status</TableHead>
                            <TableHead className="font-semibold text-gray-700">Platform</TableHead>
                            <TableHead className="font-semibold text-gray-700">Contact Email</TableHead>
                            <TableHead className="font-semibold text-gray-700">Phone Number</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {apps?.map((app, index) => {
                            const platforms = getPlatformChips(app)
                            return (
                                <TableRow key={app.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <TableCell className="font-medium text-gray-900">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {app.icon ? (
                                            <Image
                                                src={app.icon}
                                                alt={app.title || 'App Icon'}
                                                width={40}
                                                height={40}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">No Icon</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">
                                            {app.title || '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getStatusVariant(app.status)}
                                            onClick={() => handleStatusClick(app)}
                                            className="cursor-pointer hover:opacity-80 transition-opacity"
                                        >
                                            {app.status || 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            {platforms.length > 0 ? (
                                                platforms.map((platform) => (
                                                    <Badge
                                                        key={platform}
                                                        variant={platform === 'iOS' ? 'info' : 'success'}
                                                    >
                                                        {platform}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">
                                            {app.supportEmail || '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">
                                            {app.supportPhoneNumber || '-'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
