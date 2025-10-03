import Image from 'next/image'
import Link from 'next/link'

export default function Theme({ themeData }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5'>
            {themeData?.map((item) => (
                <div key={item?.id} className='rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
                    <Link href={`/themes/${item?.id}`}>
                        <div className="relative">
                            <Image
                                src={item?.images[0]}
                                alt={item?.name}
                                width={100}
                                height={100}
                                className='size-full cursor-pointer rounded-lg'
                            />
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium text-gray-900">{item?.name}</h3>
                            <p className="text-sm text-gray-500">Click to view details</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}
