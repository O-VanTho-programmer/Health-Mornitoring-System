'use client';
import InformationCard from '@/component/InformationCard/InformationCard';
import Table from '@/component/Table/Table';
import React from 'react';
import { FaThermometerHalf, FaHeartbeat, FaSyringe } from 'react-icons/fa';

// Function to determine background color based on health metric values
const getHealthStatusColor = (metric, value) => {
    if (metric === 'temp') {
        const temp = parseFloat(value);
        if (temp >= 36.1 && temp <= 37.2) return 'bg-green-100 text-green-800';
        if ((temp >= 37.3 && temp <= 38) || (temp >= 35 && temp <= 36)) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    } else if (metric === 'heart') {
        const heart = parseInt(value);
        if (heart >= 60 && heart <= 100) return 'bg-green-100 text-green-800';
        if ((heart >= 50 && heart <= 59) || (heart >= 101 && heart <= 120)) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    } else if (metric === 'pressure') {
        const [systolic, diastolic] = value.split('/').map(Number);
        if (systolic >= 90 && systolic <= 120 && diastolic >= 60 && diastolic <= 80) return 'bg-green-100 text-green-800';
        if ((systolic >= 121 && systolic <= 139) || (diastolic >= 81 && diastolic <= 89)) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
};

function HealthStatusGrid() {
    const healthData = {
        temp: '36.8°C',
        heart: '72 bpm',
        pressure: '120/80 mmHg',
    };

    return (
        <div className="mt-6">
            <h1 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200">
                Health Status
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`flex items-center p-4 rounded-md ${getHealthStatusColor('temp', healthData.temp)}`}>
                    <FaThermometerHalf className="text-2xl mr-3" />
                    <div>
                        <p className="text-sm font-medium">TEMP</p>
                        <p className="text-lg">{healthData.temp}</p>
                    </div>
                </div>
                <div className={`flex items-center p-4 rounded-md ${getHealthStatusColor('heart', healthData.heart)}`}>
                    <FaHeartbeat className="text-2xl mr-3" />
                    <div>
                        <p className="text-sm font-medium">HEART</p>
                        <p className="text-lg">{healthData.heart}</p>
                    </div>
                </div>
                <div className={`flex items-center p-4 rounded-md ${getHealthStatusColor('pressure', healthData.pressure)}`}>
                    <FaSyringe className="text-2xl mr-3" />
                    <div>
                        <p className="text-sm font-medium">PRESSURE</p>
                        <p className="text-lg">{healthData.pressure}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Page() {
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
            <div className="p-6">
                <HealthStatusGrid />
            </div>
        </div>
    );
}

export default Page;