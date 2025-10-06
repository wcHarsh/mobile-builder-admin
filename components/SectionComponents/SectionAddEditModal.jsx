import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ApiPost, ApiPut } from '@/Utils/axiosFunctions'
import { useParams, useRouter } from 'next/navigation'

// Yup validation schema
const sectionSchema = yup.object({
    type: yup
        .string()
        .required('Type is required'),
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
    description: yup
        .string()
        .max(200, 'Description must be less than 200 characters'),
    is_deleted: yup
        .boolean()
        .required('Is deleted is required'),
})

export default function SectionAddEditModal({ isOpen, setIsOpen, templateData, isEdit, screenData }) {
    const { screenid, section } = useParams()
    const router = useRouter()
    const [selectedType, setSelectedType] = useState('')
    console.log('screenid, section', screenid, section)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(sectionSchema),
        defaultValues: {
            type: '',
            name: '',
            icon: '',
            description: '',
            is_deleted: true,
            is_visible: true,
        }
    })

    // Define name options based on type
    const getNameOptions = (type) => {
        if (type === 'header') {
            return [{ value: 'Header', label: 'Header' }]
        } else if (type === 'template') {
            return [
                { value: 'Slideshow', label: 'Slideshow' },
                { value: 'Marquee', label: 'Marquee' },
                { value: 'Circle image slider', label: 'Circle image slider' },
                { value: 'Featured collection', label: 'Featured collection' },
                { value: 'Product list', label: 'Product list' },
                { value: 'Collection Showcase', label: 'Collection Showcase' },
                { value: 'Image banner', label: 'Image banner' },
                { value: 'Product Highlights', label: 'Product Highlights' },
                { value: 'Hot Deal Carousel', label: 'Hot Deal Carousel' },
                { value: 'Rich text', label: 'Rich text' },
                { value: 'Image slider', label: 'Image slider' }
            ]
        }
        return []
    }

    useEffect(() => {
        if (isOpen) {
            if (isEdit && templateData) {
                // Populate form with existing data
                setValue('name', templateData.name || '')
                setValue('icon', templateData.icon || '')
                setValue('description', templateData.description || '')
                setValue('type', templateData.type || '')
                setValue('is_deleted', templateData.is_deleted || false)
                setValue('is_visible', templateData.is_visible || true)
                setSelectedType(templateData.type || '')
            } else {
                reset()
                setSelectedType('')
            }
        }
    }, [isOpen, isEdit, templateData, setValue, reset])

    const onSubmit = async (data) => {
        const payload = {
            mainThemeId: Number(screenid),
            mainScreenType: screenData,
            ...(isEdit && templateData && { mainSectionName: templateData?.name }),
            name: data.name,
            description: data.description,
            icon: data.icon,
            type: data.type,
            is_deleted: data?.is_deleted,
            is_visible: data?.is_visible
        }
        console.log('payload', payload)
        // return
        try {
            if (isEdit) {
                const updateResponse = await ApiPut(`admin/sections/dev`, payload)
                toast.success(updateResponse?.message || 'Section updated successfully')
            } else {
                const addResponse = await ApiPost(`admin/sections/dev`, payload)
                toast.success(addResponse?.message || 'Section added successfully')
            }
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            toast.error(error?.message || 'Error updating section')
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
                            {isEdit ? 'Edit' : 'Add'} Section
                        </DialogTitle>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Type Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type *
                                </label>
                                <select
                                    {...register('type')}
                                    onChange={(e) => {
                                        setSelectedType(e.target.value)
                                        setValue('name', '') // Reset name when type changes
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" disabled>Select type</option>
                                    <option value="header">Header</option>
                                    <option value="template">Template</option>
                                </select>

                            </div>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                            )}
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <select
                                    {...register('name')}
                                    disabled={!selectedType}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>
                                        {selectedType ? 'Select name' : 'Please select type first'}
                                    </option>
                                    {getNameOptions(selectedType).map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Description Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter section description"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Icon Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon
                                </label>
                                <input
                                    type="text"
                                    {...register('icon')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter section icon"
                                />
                            </div>
                            {errors.icon && (
                                <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
                            )}
                            {/* Is deleted Field */}
                            <div className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    {...register('is_deleted')}
                                />
                                <label className="block text-sm font-medium text-gray-700 ">
                                    section Is deleted
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
                                <label className="block text-sm font-medium text-gray-700 ">
                                    section Is visible
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
