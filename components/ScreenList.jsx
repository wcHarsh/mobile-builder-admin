'use client'
import { ApiGet } from '@/Utils/axiosFunctions'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function ScreenList({ screenid }) {
    const [screenData, setScreenData] = useState([])
    const [loading, setLoading] = useState(false)
    const getScreenData = async () => {
        try {
            setLoading(true)
            const res = await ApiGet(`admin/screens?themeId=${screenid}`)
            setScreenData(res?.data)
        } catch (err) {
            toast.error(err?.message || "Failed to fetch screen data")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getScreenData()
    }, [screenid])
    return (
        <div>
            {loading ? <LoadingSpinner /> : <div>ScreenList {screenid}</div>}
        </div>
    )
}
