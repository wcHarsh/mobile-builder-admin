import IntegrationAppList from '@/components/IntegrationAppComponents/IntegrationAppList'
import LoadingSpinner from '@/components/LoadingSpinner'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <IntegrationAppList />
        </Suspense>
    )
}
