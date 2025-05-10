'use client';
import React, { useState } from 'react';
import styles from '../health_status.module.css';
import InformationCard from '@/component/InformationCard/InformationCard';
import Table from '@/component/Table/Table';

export default function Page() {
  const [user, setUser] = useState(null);
  const labels = ["ID", "Name", "Admission Date"];
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6 p-6 max-h-[360px]">
        {/* Table */}
        <div>
          <h1 className='title'>Your Patients</h1>
          <Table labels={labels} />
        </div>

        {/* Patient Info */}
        <div className="px-6 py-4 bg-white shadow-md rounded-md flex-1">
          <h1 className="text-xl font-semibold mb-6 border-b pb-2 border-gray-200">
            Patient's Information
          </h1>
          <InformationCard dataType={'Patient'} />
        </div>
      </div>

      <div className={styles.patient_health_status}>

      </div>
    </div>
  );
}
