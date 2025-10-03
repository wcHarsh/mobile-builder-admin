import ScreenList from '@/components/ScreenList'
import Breadcrumb from '@/components/Breadcrumb'
import { ApiGet } from '@/Utils/axiosFunctions'

export default async function page({ params }) {
    const { screenid } = params
    const res = await ApiGet(`admin/screens?themeId=${screenid}`)
    const screenData = res?.data || []

    const breadcrumbItems = [
        { label: 'Themes', href: '/themes' },
        { label: `Theme ${screenid}`, href: `/themes/${screenid}` }
    ]

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <ScreenList {...{ screenid, screenData }} />
        </div>
    )
}
