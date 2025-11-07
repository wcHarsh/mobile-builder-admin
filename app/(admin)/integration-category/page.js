import IntegrationCategoryList from '@/components/IntegrationCategory/IntegrationCategoryList'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ApiGet } from '@/Utils/axiosFunctions'
import React, { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function page() {
    const res = await ApiGet(`admin/integration-category`)
    const integrationCategoryData = res?.data || []
    console.log('integrationCategoryData', integrationCategoryData)
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <IntegrationCategoryList {...{ integrationCategoryData }} />
        </Suspense>
    )
}
