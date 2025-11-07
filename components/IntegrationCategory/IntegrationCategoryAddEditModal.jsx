'use client'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ApiPost, ApiPut } from '@/Utils/axiosFunctions'
import { useRouter } from 'next/navigation'

const integrationCategorySchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    isActive: yup
        .boolean()
        .required('Active status is required'),
    description: yup
        .string()
        .nullable()
        .max(500, 'Description must be less than 500 characters'),
})

export default function IntegrationCategoryAddEditModal({ isOpen, setIsOpen, templateData, isEdit, integrationCategoryData = [] }) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(integrationCategorySchema),
        defaultValues: {
            name: '',
            isActive: true,
            description: null,
        }
    })

    useEffect(() => {
        if (isOpen) {
            if (isEdit && templateData) {
                setValue('name', templateData.name || '')
                setValue('isActive', templateData.isActive ?? true)
                setValue('description', templateData.description || null)
            } else {
                reset({
                    name: '',
                    isActive: true,
                    description: null,
                })
            }
        }
    }, [isOpen, isEdit, templateData, setValue, reset])

    const onSubmit = async (data) => {
        try {
            // Auto-calculate orderIndex: for new items, use data length (0-indexed); for edit, use existing orderIndex
            const orderIndex = isEdit && templateData?.orderIndex !== undefined
                ? templateData.orderIndex
                : (integrationCategoryData?.length || 0)

            const payload = {
                name: data.name,
                isActive: data.isActive,
                description: data.description || null,
                orderIndex: orderIndex,
                ...(isEdit && templateData && { id: templateData?.id })
            }

            if (isEdit) {
                const updateResponse = await ApiPut(`admin/integration-category`, payload)
                toast.success(updateResponse?.message || 'Integration category updated successfully')
            } else {
                const addResponse = await ApiPost(`admin/integration-category`, payload)
                toast.success(addResponse?.message || 'Integration category added successfully')
            }
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            toast.error(error?.message || 'Error saving integration category')
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        reset()
    }

    return (
        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={handleClose}>
            <div className="fixed inset-0 z-10 backdrop-blur-xs bg-black/50 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-lg rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-lg font-semibold text-gray-900 mb-4">
                            {isEdit ? 'Edit' : 'Add'} Integration Category
                        </DialogTitle>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter category name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        {...register('description')}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter description (optional)"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            {...register('isActive')}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active Status</span>
                                    </label>
                                    {errors.isActive && (
                                        <p className="mt-1 text-sm text-red-600">{errors.isActive.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 cursor-pointer py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
