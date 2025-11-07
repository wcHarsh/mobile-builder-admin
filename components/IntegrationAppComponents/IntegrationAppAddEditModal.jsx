'use client'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ApiPost, ApiPut } from '@/Utils/axiosFunctions'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import CreatableSelect from 'react-select/creatable'
import { Plus, Trash2 } from 'lucide-react'

const BaseURL = process.env.NEXT_PUBLIC_API_URL

const integrationAppSchema = yup.object({
    logo: yup.string().required('Logo is required'),
    thumbnail: yup.string().required('Thumbnail is required'),
    appName: yup.string().required('App name is required').min(2, 'App name must be at least 2 characters'),
    author: yup.string().required('Author is required'),
    appKey: yup.string().required('App key is required'),
    appCode: yup.string().required('App code is required'),
    summary: yup.string().required('Summary is required'),
    category: yup.number().required('Category is required'),
    accessPlan: yup.string().required('Access plan is required'),
    status: yup.string().required('Status is required'),
    staffPick: yup.boolean(),
    staffPickOrder: yup.number().nullable().notRequired(),
    installUrl: yup.string().url('Must be a valid URL').required('Install URL is required'),
    meta: yup.string().nullable().notRequired(),
    appType: yup.string().required('App type is required'),
    type: yup.string().required('Type is required'),
    configKey: yup.object().nullable(),
    articles: yup.array().of(
        yup.object({
            link: yup.string().url('Must be a valid URL').required('Link is required'),
            title: yup.string().required('Title is required')
        })
    ).nullable(),
})

export default function IntegrationAppAddEditModal({ isOpen, setIsOpen, templateData, isEdit, onSuccess, categories = [] }) {
    const router = useRouter()
    const [logoFile, setLogoFile] = useState(null)
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [logoPreview, setLogoPreview] = useState('')
    const [thumbnailPreview, setThumbnailPreview] = useState('')
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
    const [configFields, setConfigFields] = useState([])
    const [articles, setArticles] = useState([{ link: '', title: '' }])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch
    } = useForm({
        resolver: yupResolver(integrationAppSchema),
        defaultValues: {
            logo: '',
            thumbnail: '',
            appName: '',
            author: '',
            appKey: '',
            appCode: '',
            summary: '',
            category: '',
            accessPlan: 'free',
            status: 'draft',
            staffPick: false,
            staffPickOrder: null,
            installUrl: '',
            meta: null,
            appType: '',
            type: 'basic',
            configKey: {},
            articles: [],
        }
    })

    const watchedType = watch('type')
    const watchedStaffPick = watch('staffPick')

    useEffect(() => {
        if (isOpen) {
            if (isEdit && templateData) {
                setValue('logo', templateData?.logo || '')
                setValue('thumbnail', templateData?.thumbnail || '')
                setValue('appName', templateData?.appName || '')
                setValue('author', templateData?.author || '')
                setValue('appKey', templateData?.appKey || '')
                setValue('appCode', templateData?.appCode || '')
                setValue('summary', templateData?.summary || '')
                setValue('category', templateData?.category || '')
                setValue('accessPlan', templateData?.accessPlan || 'free')
                setValue('status', templateData?.status || 'draft')
                setValue('staffPick', templateData?.staffPick || false)
                setValue('staffPickOrder', templateData?.staffPickOrder || null)
                setValue('installUrl', templateData?.installUrl || '')
                setValue('meta', templateData?.meta || null)
                setValue('appType', templateData?.appType || '')
                setValue('type', templateData?.type || 'basic')
                // Convert configKey object to array of field names
                if (templateData?.configKey && typeof templateData?.configKey === 'object') {
                    const fieldNames = Object.keys(templateData?.configKey)
                    setConfigFields(fieldNames.map(name => ({ value: name, label: name })))
                } else {
                    setConfigFields([])
                }
                // Set articles
                if (templateData?.articles && Array.isArray(templateData?.articles) && templateData?.articles.length > 0) {
                    setArticles(templateData?.articles)
                    setValue('articles', templateData?.articles)
                } else {
                    setArticles([{ link: '', title: '' }])
                    setValue('articles', [])
                }
                setLogoPreview(templateData?.logo || '')
                setThumbnailPreview(templateData?.thumbnail || '')
            } else {
                // Clean up any existing object URLs
                if (logoPreview && logoPreview.startsWith('blob:')) {
                    URL.revokeObjectURL(logoPreview)
                }
                if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
                    URL.revokeObjectURL(thumbnailPreview)
                }
                reset()
                setLogoPreview('')
                setThumbnailPreview('')
                setLogoFile(null)
                setThumbnailFile(null)
                setConfigFields([])
                setArticles([{ link: '', title: '' }])
            }
        }
    }, [isOpen, isEdit, templateData, setValue, reset])

    const uploadFile = async (file) => {
        const formData = new FormData()
        formData.append('files', file)

        try {
            const userData = JSON.parse(localStorage.getItem("mobile_builder_user_data") || '{}')
            const token = userData?.token
            const response = await axios.post(`${BaseURL}admin/files/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })

            if (response?.data?.success && response?.data?.data?.[0]) {
                const fileName = response?.data?.data?.[0]
                // Return just the filename
                return fileName
            }
            throw new Error('Upload failed')
        } catch (error) {
            console.error('Error uploading file:', error)
            throw error
        }
    }

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setLogoFile(file)
            // Create preview URL from file object
            const previewUrl = URL.createObjectURL(file)
            setLogoPreview(previewUrl)
            // Set a temporary value to pass validation (will be replaced with actual URL on submit)
            setValue('logo', 'file_selected', { shouldValidate: true })
        }
    }

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setThumbnailFile(file)
            // Create preview URL from file object
            const previewUrl = URL.createObjectURL(file)
            setThumbnailPreview(previewUrl)
            // Set a temporary value to pass validation (will be replaced with actual URL on submit)
            setValue('thumbnail', 'file_selected', { shouldValidate: true })
        }
    }

    // Helper function to extract filename from URL
    const extractFilename = (url) => {
        if (!url) return null
        if (url === 'file_selected') return null
        // If it's already just a filename (no http/https), return as is
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return url
        }
        // Extract filename from URL (e.g., "https://.../uploads/files-xxx.png" -> "files-xxx.png")
        const parts = url.split('/')
        return parts[parts.length - 1] || null
    }

    const onSubmit = async (data) => {
        try {
            // Upload images if new files are selected
            let logoFilename = data.logo === 'file_selected' ? null : extractFilename(data.logo)
            let thumbnailFilename = data.thumbnail === 'file_selected' ? null : extractFilename(data.thumbnail)

            if (logoFile) {
                setUploadingLogo(true)
                try {
                    logoFilename = await uploadFile(logoFile)
                } catch (error) {
                    toast.error('Failed to upload logo')
                    setUploadingLogo(false)
                    return
                } finally {
                    setUploadingLogo(false)
                }
            }

            if (thumbnailFile) {
                setUploadingThumbnail(true)
                try {
                    thumbnailFilename = await uploadFile(thumbnailFile)
                } catch (error) {
                    toast.error('Failed to upload thumbnail')
                    setUploadingThumbnail(false)
                    return
                } finally {
                    setUploadingThumbnail(false)
                }
            }

            const payload = {
                ...(isEdit && templateData && { id: templateData?.id }),
                logo: logoFilename,
                thumbnail: thumbnailFilename,
                appName: data.appName,
                author: data.author,
                appKey: data.appKey,
                appCode: data.appCode,
                summary: data.summary,
                category: Number(data.category),
                accessPlan: data.accessPlan,
                status: data.status,
                staffPick: data.staffPick || false,
                staffPickOrder: data.staffPickOrder !== null && data.staffPickOrder !== undefined ? Number(data.staffPickOrder) : null,
                installUrl: data.installUrl,
                meta: data.meta || null,
                appType: data.appType,
                type: data.type,
                configKey: configFields?.reduce((acc, field) => {
                    acc[field?.value] = null
                    return acc
                }, {}) || {},
                articles: articles?.filter(article => article?.link && article?.title)?.length > 0
                    ? articles?.filter(article => article?.link && article?.title)
                    : null
            }
            if (isEdit && templateData?.id) {
                const updateResponse = await ApiPut('admin/integrations', payload)
                toast.success(updateResponse?.message || 'Integration app updated successfully')
            } else {
                const addResponse = await ApiPost('admin/integrations', payload)
                toast.success(addResponse?.message || 'Integration app added successfully')
            }
            onSuccess()
            setIsOpen(false)
        } catch (error) {
            toast.error(error?.error?.message || 'Error saving integration app')
        }
    }

    const handleClose = () => {
        // Clean up object URLs to prevent memory leaks
        if (logoPreview && logoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(logoPreview)
        }
        if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
            URL.revokeObjectURL(thumbnailPreview)
        }
        setIsOpen(false)
        reset()
        setLogoPreview('')
        setThumbnailPreview('')
        setLogoFile(null)
        setThumbnailFile(null)
    }

    return (
        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={handleClose}>
            <div className="fixed inset-0 z-10 backdrop-blur-xs bg-black/50 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-4xl rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 max-h-[90vh] overflow-y-auto"
                    >
                        <DialogTitle as="h3" className="text-lg font-semibold text-gray-900 mb-4">
                            {isEdit ? 'Edit' : 'Add'} Integration App
                        </DialogTitle>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Logo *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {logoPreview && (
                                        <div className="mt-2">
                                            <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-cover rounded" />
                                        </div>
                                    )}
                                    {errors.logo && (
                                        <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>
                                    )}
                                </div>

                                {/* Thumbnail Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Thumbnail *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {thumbnailPreview && (
                                        <div className="mt-2">
                                            <img src={thumbnailPreview} alt="Thumbnail preview" className="w-20 h-20 object-cover rounded" />
                                        </div>
                                    )}
                                    {errors.thumbnail && (
                                        <p className="mt-1 text-sm text-red-600">{errors.thumbnail.message}</p>
                                    )}
                                </div>

                                {/* App Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        App Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('appName')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter app name"
                                    />
                                    {errors.appName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.appName.message}</p>
                                    )}
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Author *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('author')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter author"
                                    />
                                    {errors.author && (
                                        <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
                                    )}
                                </div>

                                {/* App Key */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        App Key *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('appKey')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter app key"
                                    />
                                    {errors.appKey && (
                                        <p className="mt-1 text-sm text-red-600">{errors.appKey.message}</p>
                                    )}
                                </div>

                                {/* App Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        App Code *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('appCode')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter app code"
                                    />
                                    {errors.appCode && (
                                        <p className="mt-1 text-sm text-red-600">{errors.appCode.message}</p>
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Summary *
                                    </label>
                                    <textarea
                                        {...register('summary')}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter summary"
                                    />
                                    {errors.summary && (
                                        <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        {...register('category', { valueAsNumber: true })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                    )}
                                </div>

                                {/* Access Plan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Access Plan *
                                    </label>
                                    <select
                                        {...register('accessPlan')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="free">Free</option>
                                        <option value="scaleUp">Scale Up</option>
                                        <option value="brandUp">Brand Up</option>
                                        <option value="omni">Omni</option>
                                    </select>
                                    {errors.accessPlan && (
                                        <p className="mt-1 text-sm text-red-600">{errors.accessPlan.message}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        {...register('status')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="publish">Publish</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                                    )}
                                </div>

                                {/* App Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        App Type *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('appType')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., translation"
                                    />
                                    {errors.appType && (
                                        <p className="mt-1 text-sm text-red-600">{errors.appType.message}</p>
                                    )}
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type *
                                    </label>
                                    <select
                                        {...register('type')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="basic">Basic</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    {errors.type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                                    )}
                                </div>

                                {/* Config Fields (only for advanced) */}
                                {watchedType === 'advanced' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Config Fields
                                        </label>
                                        <CreatableSelect
                                            isMulti
                                            isClearable
                                            value={configFields}
                                            onChange={(selected) => {
                                                setConfigFields(selected || [])
                                            }}
                                            options={[
                                                { value: 'apiKey', label: 'API Key' },
                                                { value: 'publicApiKey', label: 'Public API Key' },
                                                { value: 'privateApiKey', label: 'Private API Key' },
                                                { value: 'apiToken', label: 'API Token' }
                                            ]}
                                            placeholder="Select or type field name and press Enter"
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderColor: '#d1d5db',
                                                    minHeight: '42px',
                                                    '&:hover': {
                                                        borderColor: '#9ca3af',
                                                    },
                                                }),
                                            }}
                                            formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Select from popular options or add custom field names. Each field will be set to null in the payload.
                                        </p>
                                    </div>
                                )}

                                {/* Install URL */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Install URL *
                                    </label>
                                    <input
                                        type="url"
                                        {...register('installUrl')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://apps.shopify.com/..."
                                    />
                                    {errors.installUrl && (
                                        <p className="mt-1 text-sm text-red-600">{errors.installUrl.message}</p>
                                    )}
                                </div>

                                {/* Articles */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Articles
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setArticles([...(articles || []), { link: '', title: '' }])}
                                            className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Article
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {articles?.map((article, index) => (
                                            <div key={index} className="flex gap-2 items-start p-3 border border-gray-200 rounded-lg">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Link *
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={article?.link || ''}
                                                            onChange={(e) => {
                                                                const newArticles = [...articles]
                                                                newArticles[index] = { ...newArticles[index], link: e.target.value }
                                                                setArticles(newArticles)
                                                            }}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="https://help.example.com/article"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Title *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={article?.title || ''}
                                                            onChange={(e) => {
                                                                const newArticles = [...articles]
                                                                newArticles[index] = { ...newArticles[index], title: e.target.value }
                                                                setArticles(newArticles)
                                                            }}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Article title"
                                                        />
                                                    </div>
                                                </div>
                                                {articles?.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newArticles = articles?.filter((_, i) => i !== index) || []
                                                            setArticles(newArticles?.length > 0 ? newArticles : [{ link: '', title: '' }])
                                                        }}
                                                        className="mt-6 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Add help articles or documentation links for this integration.
                                    </p>
                                </div>

                                {/* Staff Pick Order - only show if Staff Pick is checked */}
                                {watchedStaffPick && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Staff Pick Order
                                        </label>
                                        <input
                                            type="number"
                                            {...register('staffPickOrder', { valueAsNumber: true })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter order"
                                        />
                                    </div>
                                )}

                                {/* Meta */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Meta
                                    </label>
                                    <input
                                        type="text"
                                        {...register('meta')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter meta"
                                    />
                                </div>

                                {/* Checkboxes */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            {...register('staffPick')}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Staff Pick</span>
                                    </label>
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
                                    disabled={isSubmitting || uploadingLogo || uploadingThumbnail}
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

