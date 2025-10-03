import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ApiPut } from '@/Utils/axiosFunctions'
import { useParams } from 'next/navigation'

// Yup validation schema
const sectionSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    description: yup
        .string()
        .max(200, 'Description must be less than 200 characters'),
})

export default function SectionAddEditModal({ isOpen, setIsOpen, templateData, isEdit, screenData }) {
    const { screenid, section } = useParams()
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
            name: '',
            description: '',
        }
    })
    useEffect(() => {
        if (isEdit) {
            setValue('name', templateData?.name || '')
            setValue('description', templateData?.description || '')
        }
    }, [isEdit, isOpen, templateData, setValue])

    // // Reset form when modal opens/closes or templateData changes
    // useEffect(() => {
    //     if (isOpen) {
    //         if (isEdit && templateData) {
    //             // Populate form with existing data
    //             setValue('name', templateData.name || '')
    //             setValue('description', templateData.description || '')

    //         } else {
    //             // Reset form for new section
    //             reset()
    //         }
    //     }
    // }, [isOpen, isEdit, templateData, setValue, reset])

    const onSubmit = async (data) => {
        const payload = {
            mainThemeId: Number(screenid),
            mainScreenType: screenData,
            mainSectionName: templateData?.name,
            name: data.name,
            description: data.description,
        }
        console.log('payload', templateData, payload)
        // return
        try {
            const response = await ApiPut(`admin/sections/dev`, payload)
            setIsOpen(false)
            toast.success(response?.message || 'Section created successfully')
        } catch (error) {
            toast.error(error?.message || 'Error creating section')
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
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter section name"
                                />
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
