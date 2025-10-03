import LoadingSpinner from '@/components/LoadingSpinner'
import SectionList from '@/components/SectionList'
import { ApiGet } from '@/Utils/axiosFunctions'
import { Suspense } from 'react'

export default async function Page({ params }) {
    const { section } = await params

    // Fetch data on the server
    const res = await ApiGet(`admin/sections?screenId=${section}`)
    const screen = await ApiGet(`admin/screens/single?id=${section}`)
    const sectionData = res?.data || []
    const screenData = screen?.data?.type || ''
    console.log('screenData', sectionData)
    // Pass fetched data as props to client component
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SectionList {...{ section, sectionData, screenData }} />
        </Suspense>
    )
}
