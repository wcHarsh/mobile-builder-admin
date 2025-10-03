import ScreenList from '@/components/ScreenList'
import { ApiGet } from '@/Utils/axiosFunctions'

export default async function page({ params }) {
    const { screenid } = params
    const res = await ApiGet(`admin/screens?themeId=${screenid}`)
    const screenData = res?.data || []

    return (
        <ScreenList {...{ screenid, screenData }} />
    )
}
