'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumb = ({ items = [] }) => {
    if (!items || items.length === 0) {
        return null
    }

    return (
        <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
            <Link
                href="/"
                className="flex items-center hover:text-gray-700 transition-colors"
            >
                <Home className="w-4 h-4 mr-1" />
                Dashboard
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-gray-700 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    )
}

export default Breadcrumb
