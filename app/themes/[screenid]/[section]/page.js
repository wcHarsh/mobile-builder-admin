import LoadingSpinner from '@/components/LoadingSpinner'
import SectionList from '@/components/SectionList'
import { ApiGet } from '@/Utils/axiosFunctions'
import { Suspense } from 'react'

export default async function Page({ params }) {
    const { screenid, section } = params

    // Fetch data on the server
    const res = await ApiGet(`admin/sections?screenId=${section}`)
    const sectionData = res?.data || []

    // Pass fetched data as props to client component
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SectionList {...{ section, sectionData }} />
        </Suspense>
    )
}
