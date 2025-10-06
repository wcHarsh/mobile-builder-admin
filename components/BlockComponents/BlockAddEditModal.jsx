import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ApiPost, ApiPut } from '@/Utils/axiosFunctions'
import { useParams, useRouter } from 'next/navigation'

// Yup validation schema
const blockSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    icon: yup
        .string()
        .required('Icon is required')
        .min(2, 'Icon must be at least 2 characters')
        .max(50, 'Icon must be less than 50 characters'),
    is_deleted: yup
        .boolean()
        .required('Is deleted is required'),
    is_visible: yup
        .boolean()
        .required('Is visible is required'),
})

export default function BlockAddEditModal({ isOpen, setIsOpen, templateData, isEdit }) {
    const { screenid } = useParams()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(blockSchema),
        defaultValues: {
            name: '',
            icon: '',
            is_deleted: true,
            is_visible: true,
        }
    })

    useEffect(() => {
        if (isOpen) {
            if (isEdit && templateData) {
                // Populate form with existing data
                setValue('name', templateData.name || '')
                setValue('icon', templateData.icon || '')
                setValue('is_deleted', templateData.is_deleted || true)
                setValue('is_visible', templateData.is_visible || true)
            } else {
                reset()
            }
        }
    }, [isOpen, isEdit, templateData, setValue, reset])

    const onSubmit = async (data) => {
        const payload = {
            mainThemeId: Number(screenid),
            mainScreenType: localStorage.getItem('mainScreenType'),
            mainSectionName: localStorage.getItem('mainSectionName'),
            name: data.name,
            icon: data.icon,
            is_deleted: data.is_deleted,
            is_visible: data.is_visible,
            ...(isEdit && templateData && { mainBlockName: templateData.name })
        }

        console.log('payload', payload)

        try {
            if (isEdit) {
                const updateResponse = await ApiPut(`admin/sections/blocks/dev`, payload)
                toast.success(updateResponse?.message || 'Block updated successfully')
            } else {
                const addResponse = await ApiPost(`admin/sections/blocks/dev`, payload)
                toast.success(addResponse?.message || 'Block added successfully')
            }
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            toast.error(error?.message || 'Error updating block')
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
                            {isEdit ? 'Edit' : 'Add'} Block
                        </DialogTitle>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter block name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Icon Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon *
                                </label>
                                <input
                                    type="text"
                                    {...register('icon')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter block icon"
                                />
                                {errors.icon && (
                                    <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
                                )}
                            </div>

                            {/* Is deleted Field */}
                            <div className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    {...register('is_deleted')}
                                />
                                <label className="block text-sm font-medium text-gray-700">
                                    Block Is deleted
                                </label>
                            </div>
                            {errors.is_deleted && (
                                <p className="mt-1 text-sm text-red-600">{errors.is_deleted.message}</p>
                            )}

                            {/* Is visible Field */}
                            <div className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    {...register('is_visible')}
                                />
                                <label className="block text-sm font-medium text-gray-700">
                                    Block Is visible
                                </label>
                            </div>
                            {errors.is_visible && (
                                <p className="mt-1 text-sm text-red-600">{errors.is_visible.message}</p>
                            )}

                            {/* Action Buttons */}
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
