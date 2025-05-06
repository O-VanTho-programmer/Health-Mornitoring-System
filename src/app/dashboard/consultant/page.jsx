'use client';
import InformationCard from '@/component/InformationCard/InformationCard';
import Table from '@/component/Table/Table';
import React from 'react'

function page() {
    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-6 p-6 max-h-[360px]">
                <Table dataType={'Doctor'} />
                <div className="px-6 py-4 bg-white shadow-md rounded-md flex-1">
                    <h1 className="text-xl font-semibold mb-6 border-b pb-2 border-gray-200">
                        Doctor's Information
                    </h1>
                    <InformationCard dataType={'Doctor'} />
                </div>
            </div>
        </div>
    )
}

export default page