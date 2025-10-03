import ScreenList from '@/components/ScreenList'

export default function page({ params }) {
    const { screenid } = params
    return (
        <ScreenList {...{ screenid }} />
    )
}
