import { redirect } from 'next/navigation'

export default async function page({ params }) {
    const { section, screenid } = await params
    return (
        redirect(`/themes/${screenid}/${section}`)
    )
}
