'use client'
import React, { useEffect, useState } from 'react'
import { ApiGet } from '@/Utils/axiosFunctions'
import Image from 'next/image'
export default function Theme() {
    const [theme, setTheme] = useState([])
    const getTheme = async () => {
        const res = await ApiGet('admin/themes')
        setTheme(res?.data || [])
    }
    useEffect(() => {
        getTheme()
    }, [])
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-10'>
            {theme?.map((item) => (
                <div key={item?.id} className='rounded-lg  border border-gray-200 p-4'>
                    <Image src={item?.images[0]} alt={item?.name} width={100} height={100} className='size-full cursor-pointer' />
                </div>
            ))}
        </div>
    )
}
