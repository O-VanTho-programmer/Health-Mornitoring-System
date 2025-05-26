'use client';
import { FaThermometerHalf, FaHeartbeat, FaSyringe } from 'react-icons/fa';

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

import React from 'react'

function HealthStatus({temp, heart, pressure}) {
    const healthData = {
        temp: '36.8°C',
        heart: '72 bpm',
        pressure: '120/80 mmHg',
    };

    return (
        <div className="mt-6">
            <h1 className="title border-b pb-2 border-gray-200">
                Health Status
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`flex items-center p-4 rounded-md ${getHealthStatusColor('temp', temp ? temp : healthData.temp)}`}>
                    <FaThermometerHalf className="text-2xl mr-3" />
                    <div>
                        <p className="text-sm font-medium">TEMP</p>
                        <p className="text-lg">{temp ? temp + "°C" : "N/A"}</p>
                    </div>
                </div>
                <div className={`flex items-center p-4 rounded-md ${getHealthStatusColor('heart', heart ? heart : healthData.heart)}`}>
                    <FaHeartbeat className="text-2xl mr-3" />
                    <div>
                        <p className="text-sm font-medium">HEART</p>
                        <p className="text-lg">{heart ? heart + " bpm" : "N/A"}</p>
                    </div>
                </div>
                <div className={`flex items-center p-4 rounded-md ${getHealthStatusColor('pressure', pressure ? pressure : healthData.pressure)}`}>
                    <FaSyringe className="text-2xl mr-3" />
                    <div>
                        <p className="text-sm font-medium">PRESSURE</p>
                        <p className="text-lg">{pressure ? pressure + " mmHg" : "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HealthStatus