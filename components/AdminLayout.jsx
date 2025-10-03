'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import SidePanel from './SidePanel'
import TopBar from './TopBar'
import Breadcrumb from './Breadcrumb'

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
    }

    // Generate breadcrumbs based on current path
    const generateBreadcrumbs = () => {
        const segments = pathname.split('/').filter(Boolean)
        const breadcrumbs = []

        // Skip if we're on the root dashboard
        if (segments.length === 0) {
            return []
        }

        let currentPath = ''

        segments.forEach((segment, index) => {
            currentPath += `/${segment}`
            const isLast = index === segments.length - 1

            // Generate readable labels
            let label = segment
            if (segment === 'themes') {
                label = 'Themes'
            } else if (segment === 'users') {
                label = 'Users'
            } else if (segment === 'settings') {
                label = 'Settings'
            } else if (segment === 'analytics') {
                label = 'Analytics'
            } else if (segment === 'dashboard') {
                label = 'Dashboard'
            } else if (!isNaN(segment)) {
                // If it's a number, it's likely an ID
                const parentSegment = segments[index - 1]
                if (parentSegment === 'themes') {
                    label = `Theme ${segment}`
                } else if (parentSegment && !isNaN(segments[index - 1])) {
                    // This is a nested route like /themes/1/2
                    label = `Screen ${segment}`
                } else {
                    label = segment.charAt(0).toUpperCase() + segment.slice(1)
                }
            } else {
                label = segment.charAt(0).toUpperCase() + segment.slice(1)
            }

            breadcrumbs.push({
                label,
                href: isLast ? null : currentPath
            })
        })

        return breadcrumbs
    }

    const breadcrumbItems = generateBreadcrumbs()

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <SidePanel isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className="w-full">
                <TopBar onMenuToggle={toggleSidebar} />
                <main className="flex-1">
                    <div className="h-[calc(100vh-100px)]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                            {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
