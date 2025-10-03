import LoadingSpinner from '@/components/LoadingSpinner'
import SectionList from '@/components/SectionList'
import Breadcrumb from '@/components/Breadcrumb'
import { ApiGet } from '@/Utils/axiosFunctions'
import { Suspense } from 'react'

export default async function Page({ params }) {
    const { screenid, section } = params

    // Fetch data on the server
    const res = await ApiGet(`admin/sections?screenId=${section}`)
    const sectionData = res?.data || []

    const breadcrumbItems = [
        { label: 'Themes', href: '/themes' },
        { label: `Theme ${screenid}`, href: `/themes/${screenid}` },
        { label: `Screen ${section}`, href: `/themes/${screenid}/${section}` }
    ]

    // Pass fetched data as props to client component
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <div>
                <Breadcrumb items={breadcrumbItems} />
                <SectionList {...{ section, sectionData }} />
            </div>
        </Suspense>
    )
}
