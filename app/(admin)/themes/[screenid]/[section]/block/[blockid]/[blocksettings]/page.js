import BlockSettings from '@/components/BlockSettings'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ApiGet } from '@/Utils/axiosFunctions'
import React, { Suspense } from 'react'

export default async function page({ params }) {
    const { section, screenid, sectionsettings, blockid, blocksettings } = await params
    const res = await ApiGet(`admin/blocks/settings?blockId=${blocksettings}`)

    const blockSettingsData = res?.data || []
    console.log('blockData', blocksettings, blockSettingsData)
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <BlockSettings {...{ blockSettingsData, section, screenid, blockid, blocksettings }} />
        </Suspense>
    )
}
