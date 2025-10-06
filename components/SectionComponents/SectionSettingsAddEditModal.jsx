'use client'
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ApiPost, ApiPut } from '@/Utils/axiosFunctions'
import { useParams, useRouter } from 'next/navigation'
import CreatableSelect from 'react-select/creatable'

// Yup validation schema
const sectionSettingsSchema = yup.object({
    label: yup
        .string()
        .required('Label is required')
        .min(2, 'Label must be at least 2 characters')
        .max(100, 'Label must be less than 100 characters'),
    name: yup
        .string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    type: yup
        .string()
        .required('Type is required'),
    value: yup
        .mixed()
        .test('value-type', 'Invalid value type', function (value) {
            const { type } = this.parent
            // Skip validation if value is empty
            if (!value) return true

            if (type === 'toggle') {
                return value === true || value === false || value === 'true' || value === 'false'
            }
            if (type === 'number' || type === 'range') {
                return !value || (typeof value === 'number' && !isNaN(value))
            }
            if (type === 'collection' || type === 'product' || type === 'multi_collections') {
                return Array.isArray(value)
            }
            return typeof value === 'string'
        }),
    min: yup
        .number()
        .nullable(),
    max: yup
        .number()
        .nullable(),
    navigation_value: yup
        .string(),
    limit: yup
        .number()
        .nullable(),
    options: yup
        .mixed()
        .test('options-required', 'Options are required for select type', function (value) {
            const { type } = this.parent
            if (type === 'select') {
                return value && (typeof value === 'string' ? value.trim() !== '' : true)
            }
            return true
        }),
})

export default function SectionSettingsAddEditModal({ isOpen, setIsOpen, templateData, isEdit, }) {
    const { screenid, section } = useParams()
    const router = useRouter()
    const [selectedType, setSelectedType] = useState('')
    const [selectedOptions, setSelectedOptions] = useState([])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
        trigger
    } = useForm({
        resolver: yupResolver(sectionSettingsSchema),
        defaultValues: {
            label: '',
            name: '',
            type: '',
            value: '',
            options: [],
            min: null,
            max: null,
            navigation_value: '',
            limit: null,
        }
    })

    // Watch the type field to show/hide relevant fields
    const watchedType = watch('type')

    useEffect(() => {
        if (isOpen) {
            if (isEdit && templateData) {
                // Set selectedType first so the form can properly render
                setSelectedType(templateData.type || '')
                // Populate form with existing data
                setValue('label', templateData.label || '')
                setValue('name', templateData.name || '')
                setValue('type', templateData.type || '')
                // For collection, product, multi_collections types, set value to [] if it's not already set
                if (templateData.type === 'collection' || templateData.type === 'product' || templateData.type === 'multi_collections') {
                    setValue('value', [])
                } else if (templateData.type === 'toggle') {
                    const toggleValue = templateData.value ? 'true' : 'false'
                    console.log('Setting toggle value:', toggleValue, 'from templateData.value:', templateData.value)
                    // Use setTimeout to ensure the form has rendered
                    setTimeout(() => {
                        setValue('value', toggleValue)
                        trigger('value') // Force form to re-render
                    }, 10)
                } else if (templateData.type === 'number' || templateData.type === 'range') {
                    setValue('value', templateData.value !== null && templateData.value !== undefined ? templateData.value : '')
                } else {
                    setValue('value', templateData.value || '')
                }
                setValue('options', templateData.options || [])
                // Convert options array to react-select format
                if (templateData.options && Array.isArray(templateData.options)) {
                    setSelectedOptions(templateData.options.map(option => ({ value: option, label: option })))
                } else {
                    setSelectedOptions([])
                }
                setValue('min', templateData.min || null)
                setValue('max', templateData.max || null)
                setValue('navigation_value', templateData.navigation_value || '')
                setValue('limit', templateData.limit || null)
            } else {
                reset()
                setSelectedType('')
            }
        }
    }, [isOpen, isEdit, templateData, setValue, reset])

    // Handle type change to automatically set value for specific types
    useEffect(() => {
        if (selectedType === 'collection' || selectedType === 'product' || selectedType === 'multi_collections') {
            setValue('value', [])
        } else if (selectedType && selectedType !== '') {
            // Clear value for all other types
            setValue('value', '')
        }
    }, [selectedType, setValue])
    console.log('templateData', templateData)
    const onSubmit = async (data) => {
        // Automatically set value to [] for collection, product, and multi_collections types
        if (data.type === 'collection' || data.type === 'product' || data.type === 'multi_collections') {
            data.value = []
        }

        // Convert toggle value to boolean
        if (data.type === 'toggle') {
            data.value = data.value === 'true' || data.value === true
        }

        // Convert value to number for number and range types
        if (data.type === 'number' || data.type === 'range') {
            if (data.value === '' || data.value === null || data.value === undefined || isNaN(data.value)) {
                data.value = 0
            } else {
                data.value = Number(data.value)
            }
        }

        // Build payload with only keys that have values, except value which is always sent
        const payload = {
            mainThemeId: Number(screenid),
            mainScreenType: localStorage.getItem('mainScreenType'),
            mainSectionName: localStorage.getItem('mainSectionName'),
            label: data.label,
            name: data.name,
            type: data.type,
            value: data.value, // Always send value
            ...(isEdit && { mainSettingName: templateData?.name }),
        }

        // Only add keys if they have values
        if (data.options && data.options.length > 0) {
            payload.options = data.options
        }
        if (data.min !== null && data.min !== undefined && data.min !== '') {
            payload.min = data.min
        }
        if (data.max !== null && data.max !== undefined && data.max !== '') {
            payload.max = data.max
        }
        if (data.navigation_value && data.navigation_value.trim() !== '') {
            payload.navigation_value = data.navigation_value
        }
        if (data.limit !== null && data.limit !== undefined && data.limit !== '') {
            payload.limit = data.limit
        }
        console.log('payload', payload, payload?.value)
        // return
        try {
            if (isEdit) {
                const updateResponse = await ApiPut(`admin/sections/settings/dev`, payload)
                toast.success(updateResponse?.message || 'Setting updated successfully')
            } else {
                const addResponse = await ApiPost(`admin/sections/settings/dev`, payload)
                toast.success(addResponse?.message || 'Setting added successfully')
            }
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            toast.error(error?.message || 'Error saving setting')
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
                        className="w-full max-w-4xl rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-lg font-semibold text-gray-900 mb-4">
                            {isEdit ? 'Edit' : 'Add'} Section Setting
                        </DialogTitle>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Label Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Label *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('label')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter setting label"
                                    />
                                    {errors.label && (
                                        <p className="mt-1 text-sm text-red-600">{errors.label.message}</p>
                                    )}
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter setting name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Type Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type *
                                    </label>
                                    <select
                                        {...register('type')}
                                        onChange={(e) => {
                                            setSelectedType(e.target.value)
                                            // Force re-render by updating the watched value first
                                            setValue('type', e.target.value)

                                            // Reset the entire form to prevent NaN issues
                                            reset({
                                                type: e.target.value,
                                                value: e.target.value === 'collection' || e.target.value === 'product' || e.target.value === 'multi_collections' ? [] : '',
                                                label: watch('label') || '',
                                                name: watch('name') || '',
                                                options: watch('options') || [],
                                                min: watch('min') || null,
                                                max: watch('max') || null,
                                                navigation_value: watch('navigation_value') || '',
                                                limit: watch('limit') || null,
                                            })
                                            // Reset options state
                                            setSelectedOptions([])
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="" disabled>Select type</option>
                                        <option value="text">Text</option>
                                        <option value="collection">Collection</option>   {/* [] */}
                                        <option value="product">Product</option>         {/* [] */}
                                        <option value="multi_collections">Multi Collections</option>       {/* [] */}
                                        <option value="textarea">Textarea</option>
                                        <option value="richtext">Richtext</option>
                                        <option value="toggle">Toggle</option> {/* number */}
                                        <option value="color">Color</option>
                                        <option value="number">Number</option> {/* number */}
                                        <option value="select-fontfamily">Fontfamily</option>
                                        <option value="select">Select</option>
                                        <option value="date">Date</option>
                                        <option value="time">Time</option>
                                        <option value="range">Range</option> {/* number */}
                                        <option value="icon">Icon</option>
                                        <option value="image_upload">Image</option>
                                        <option value="video_upload">Video Upload</option>
                                    </select>
                                    {errors.type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                                    )}
                                </div>

                                {/* Value Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Value
                                    </label>
                                    {(selectedType === 'collection' || selectedType === 'product' || selectedType === 'multi_collections') ? (
                                        <input
                                            type="text"
                                            value="[]"
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                            placeholder="Automatically set to []"
                                        />
                                    ) : watchedType === 'color' ? (
                                        <input
                                            type="color"
                                            {...register('value')}
                                            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    ) : watchedType === 'toggle' ? (
                                        <select
                                            {...register('value')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="" disabled>Select option</option>
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    ) : watchedType === 'number' ? (
                                        <input
                                            type="number"
                                            {...register('value', { valueAsNumber: true })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter numeric value"
                                        />
                                    ) : watchedType === 'range' ? (
                                        <input
                                            type="number"
                                            {...register('value', { valueAsNumber: true })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter numeric value"
                                        />
                                    ) : watchedType === 'date' ? (
                                        <input
                                            type="date"
                                            {...register('value')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    ) : watchedType === 'time' ? (
                                        <input
                                            type="time"
                                            {...register('value')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    ) : watchedType === 'icon' ? (
                                        <input
                                            type="text"
                                            {...register('value')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter icon name"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            {...register('value')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter value"
                                        />
                                    )}
                                    {errors.value && (
                                        <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
                                    )}
                                </div>

                                {/* Options Field */}
                                {watchedType === 'select' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Options {watchedType === 'select' && <span className="text-red-500">*</span>}
                                        </label>
                                        <CreatableSelect
                                            isMulti
                                            value={selectedOptions}
                                            onChange={(selectedOptions) => {
                                                setSelectedOptions(selectedOptions || [])
                                                const optionsArray = selectedOptions ? selectedOptions.map(option => option.value) : []
                                                setValue('options', optionsArray)
                                            }}
                                            onCreateOption={(inputValue) => {
                                                const newOption = { value: inputValue, label: inputValue }
                                                setSelectedOptions([...selectedOptions, newOption])
                                                setValue('options', [...selectedOptions.map(opt => opt.value), inputValue])
                                            }}
                                            placeholder={'Press Enter to add option'}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: '42px',
                                                    border: '1px solid #d1d5db',
                                                    '&:hover': {
                                                        border: '1px solid #d1d5db'
                                                    }
                                                })
                                            }}
                                        />
                                        {errors.options && (
                                            <p className="mt-1 text-sm text-red-600">{errors.options.message}</p>
                                        )}
                                    </div>)}

                                {/* Navigation Value Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Navigation Value
                                    </label>
                                    <input
                                        type="text"
                                        {...register('navigation_value')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter navigation value"
                                    />
                                    {errors.navigation_value && (
                                        <p className="mt-1 text-sm text-red-600">{errors.navigation_value.message}</p>
                                    )}
                                </div>

                            </div>

                            {/* Number Range Fields */}
                            {watchedType === 'range' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Value
                                        </label>
                                        <input
                                            type="number"
                                            {...register('min', { valueAsNumber: true })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter minimum value"
                                        />
                                        {errors.min && (
                                            <p className="mt-1 text-sm text-red-600">{errors.min.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Value
                                        </label>
                                        <input
                                            type="number"
                                            {...register('max', { valueAsNumber: true })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter maximum value"
                                        />
                                        {errors.max && (
                                            <p className="mt-1 text-sm text-red-600">{errors.max.message}</p>
                                        )}
                                    </div>


                                    {/* Limit Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Limit
                                        </label>
                                        <input
                                            type="number"
                                            {...register('limit', { valueAsNumber: true })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter limit"
                                        />
                                        {errors.limit && (
                                            <p className="mt-1 text-sm text-red-600">{errors.limit.message}</p>
                                        )}
                                    </div>
                                </div>
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
