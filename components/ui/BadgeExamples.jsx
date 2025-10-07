import React from 'react'
import Badge from './Badge'

export default function BadgeExamples() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">Badge Variants</h2>
                <div className="flex flex-wrap gap-4">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="gray">Gray</Badge>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Badge Sizes</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <Badge size="sm">Small</Badge>
                    <Badge size="default">Default</Badge>
                    <Badge size="lg">Large</Badge>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
                <div className="space-y-4">
                    {/* Status Badges */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Status</h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="success">Active</Badge>
                            <Badge variant="warning">Pending</Badge>
                            <Badge variant="destructive">Inactive</Badge>
                            <Badge variant="info">Processing</Badge>
                        </div>
                    </div>

                    {/* Count Badges */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Counts</h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="default">5</Badge>
                            <Badge variant="secondary">12</Badge>
                            <Badge variant="info">99+</Badge>
                        </div>
                    </div>

                    {/* Category Badges */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="info">Technology</Badge>
                            <Badge variant="success">Business</Badge>
                            <Badge variant="warning">Design</Badge>
                            <Badge variant="gray">Marketing</Badge>
                        </div>
                    </div>

                    {/* Priority Badges */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Priority</h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="destructive">High</Badge>
                            <Badge variant="warning">Medium</Badge>
                            <Badge variant="success">Low</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Custom Styling</h2>
                <div className="flex flex-wrap gap-4">
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                        Custom Purple
                    </Badge>
                    <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">
                        Custom Pink
                    </Badge>
                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                        Custom Indigo
                    </Badge>
                </div>
            </div>
        </div>
    )
}
