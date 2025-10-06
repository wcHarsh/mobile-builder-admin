import LoadingSpinner from '@/components/LoadingSpinner'
import SectionSettings from '@/components/SectionSettings'
import { ApiGet } from '@/Utils/axiosFunctions'
import React, { Suspense } from 'react'

export default async function page({ params }) {
    const { section, screenid, sectionsettings } = await params
    const res = await ApiGet(`admin/sections/settings?sectionId=${sectionsettings}`)

    const sectionSettingsData = res?.data || []
    console.log('sectionSettingsData', sectionsettings, sectionSettingsData)
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SectionSettings {...{ sectionSettingsData, section, screenid }} />
        </Suspense>
    )
}
