import IconList from '@/components/IconList'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ApiGet } from '@/Utils/axiosFunctions'
import React, { Suspense } from 'react'

export default async function page() {
    const res = await ApiGet(`admin/icons`)
    const iconData = res?.data || []
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <IconList {...{ iconData }} />
        </Suspense>
    )
}
