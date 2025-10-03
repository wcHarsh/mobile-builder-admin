import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, View } from 'lucide-react'

export default function SectionSettings({ sectionSettingsData, section, screenid }) {
    console.log('sectionSettingsData', sectionSettingsData)

    if (!sectionSettingsData || sectionSettingsData.length === 0) {
        return (
            <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Settings Found</h3>
                    <p className="text-gray-600">No settings are available for this section.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Section Settings</h2>
                <Button className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700">
                    Add New Setting
                </Button>
            </div>

            <input
                type="text"
                placeholder="Search settings..."
                className="w-1/3 outline-none bg-white p-2 border border-gray-200 rounded-lg"
            />

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">Label</TableHead>
                            <TableHead className="font-semibold text-gray-700">Type</TableHead>
                            <TableHead className="font-semibold text-gray-700">Value</TableHead>
                            <TableHead className="font-semibold text-gray-700">Order Index</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sectionSettingsData.map((setting) => (
                            <TableRow key={setting.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <TableCell className="font-medium text-gray-900">
                                    {setting.label}
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600 capitalize">
                                        {setting.type}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                    {setting.type === 'color' ? (
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-6 h-6 rounded border border-gray-300"
                                                style={{ backgroundColor: setting.value }}
                                            ></div>
                                            <span>{setting.value}</span>
                                        </div>
                                    ) : (
                                        setting.value || 'No value'
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                    {setting.orderIndex}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer hover:bg-blue-50 hover:border-blue-300 group transition-all duration-200"
                                        >
                                            <Pencil className="size-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-all duration-200"
                                        >
                                            <Trash className="size-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="size-8 p-0 cursor-pointer hover:bg-green-50 hover:border-green-300 group transition-all duration-200"
                                        >
                                            <View className="size-4 text-gray-600 group-hover:text-green-600 transition-colors duration-200" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
