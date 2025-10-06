import BlockList from '@/components/BlockList'
import LoadingSpinner from '@/components/LoadingSpinner'
import SectionSettings from '@/components/SectionSettings'
import { ApiGet } from '@/Utils/axiosFunctions'
import React, { Suspense } from 'react'

export default async function page({ params }) {
    const { section, screenid, sectionsettings, blockid } = await params
    const res = await ApiGet(`admin/sections/blocks?sectionId=${blockid}`)

    const blockData = res?.data || []
    console.log('blockData', blockid, blockData)
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <BlockList {...{ blockData, section, screenid, blockid }} />
        </Suspense>
    )
}
