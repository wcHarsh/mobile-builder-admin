'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ApiPost } from '@/Utils/axiosFunctions'
import { Eye, EyeOff } from 'lucide-react'

// Yup validation schema
const loginSchema = yup.object({
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    password: yup
        .string()
        .required('Password is required')
        .min(3, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })


    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            const response = await ApiPost('admin/auth/login', data, {}, false)

            console.log('response', response)
            if (response?.success === true) {
                // Set authentication cookie
                const token = response.data?.token || response.token || 'your-auth-token-here'
                document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
                localStorage.setItem('mobile_builder_user_data', JSON.stringify(response.data))
                toast.success(response?.message || 'Login successful!')
                router.push('/dashboard')
            } else {
                console.log('response', response)
                toast.error(response?.error?.message || 'Login failed. Please try again.')
            }
        } catch (error) {
            console.log('error', error)
            toast.error(error?.response?.data?.message || error?.error?.message || 'Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Left Section - Image */}
            <div className="hidden lg:flex items-center lg:w-1/2 bg-gray-100 relative overflow-hidden">
                <div className="size-full mx-auto flex items-center justify-center">
                    <Image
                        width={600}
                        height={400}
                        src="/assets/webcontrive.webp"
                        alt="Login illustration"
                        className="object-cover w-full h-full"
                        priority
                        onError={(e) => {
                            console.error('Image failed to load:', e)
                        }}
                    />
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8">
                        {/* App Logo */}
                        <div className="flex justify-center mb-6">
                            {/* <img
                                src="https://webcontrive.com/cdn/shop/files/footer_logo.svg?v=1686044046&width=760"
                                alt="App Logo"
                                className="h-auto w-auto"
                            /> */}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back!
                        </h1>
                        <p className="text-gray-600">
                            Please sign in to your account
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <input
                                {...register('email')}
                                type="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-black text-gray-400 rounded-r-lg transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5" />
                                    ) : (
                                        <Eye className="size-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className="w-full cursor-pointer bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting || isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 size-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
