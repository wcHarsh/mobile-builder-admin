'use client'
import React, { useState } from 'react'
import SidePanel from './SidePanel'
import TopBar from './TopBar'

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <SidePanel isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className="w-full">
                <TopBar onMenuToggle={toggleSidebar} />
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
