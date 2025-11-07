import LoadingSpinner from '@/components/LoadingSpinner'
import ScreenList from '@/components/SectionComponents/ScreenList'
import { ApiGet } from '@/Utils/axiosFunctions'
import { Suspense } from 'react'

export default async function page({ params }) {
    const { screenid } = await params
    const res = await ApiGet(`admin/screens?themeId=${screenid}`)
    const screenData = res?.data || []

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ScreenList {...{ screenid, screenData }} />
        </Suspense>
    )
}
