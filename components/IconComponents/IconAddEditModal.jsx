'use client'
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ApiPost, ApiPut } from '@/Utils/axiosFunctions'
import { useRouter } from 'next/navigation'


const iconSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    icon: yup
        .string()
        .required('Icon is required')
        .min(1, 'Icon must be provided'),
})

export default function IconAddEditModal({ isOpen, setIsOpen, templateData, isEdit }) {
    const router = useRouter()
    const [previewIcon, setPreviewIcon] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch
    } = useForm({
        resolver: yupResolver(iconSchema),
        defaultValues: {
            name: '',
            icon: '',
        }
    })

    const watchedIcon = watch('icon')

    useEffect(() => {
        if (isOpen) {
            if (isEdit && templateData) {
                setValue('name', templateData.name || '')
                setValue('icon', templateData.icon || '')
                setPreviewIcon(templateData.icon || '')
            } else {
                reset()
                setPreviewIcon('')
            }
        }
    }, [isOpen, isEdit, templateData, setValue, reset])

    useEffect(() => {
        if (watchedIcon) {
            setPreviewIcon(watchedIcon)
        }
    }, [watchedIcon])

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data.name,
                icon: data.icon,
                ...(isEdit && templateData && { id: templateData?.id })
            }

            if (isEdit) {
                const updateResponse = await ApiPut(`admin/icons`, payload)
                toast.success(updateResponse?.message || 'Icon updated successfully')
            } else {
                const addResponse = await ApiPost(`admin/icons`, payload)
                toast.success(addResponse?.message || 'Icon added successfully')
            }
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            toast.error(error?.message || 'Error saving icon')
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        reset()
        setPreviewIcon('')
    }

    return (
        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={handleClose}>
            <div className="fixed inset-0 z-10 backdrop-blur-xs bg-black/50 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-2xl rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-lg font-semibold text-gray-900 mb-4">
                            {isEdit ? 'Edit' : 'Add'} Icon
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
                                        placeholder="Enter icon name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Icon *
                                    </label>
                                    <textarea
                                        {...register('icon')}
                                        rows={15}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter SVG icon code"
                                    />
                                    {errors.icon && (
                                        <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
                                    )}
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preview
                                </label>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-center h-20">
                                        {previewIcon ? (
                                            <div
                                                className="text-4xl text-gray-700"
                                                dangerouslySetInnerHTML={{ __html: previewIcon }}
                                            />
                                        ) : (
                                            <span className="text-gray-400">No preview available</span>
                                        )}
                                    </div>
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
