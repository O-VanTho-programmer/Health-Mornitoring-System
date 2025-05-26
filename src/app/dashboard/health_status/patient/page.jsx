'use client';
import HealthStatus from '@/component/HealthStatus/HealthStatus'
import InformationCard from '@/component/InformationCard/InformationCard';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../layout';
import axios from 'axios';

function page() {

  const currentUser = useContext(UserContext);
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:5000/get_health_status_by_patient_id/${currentUser.id}`);
      console.log(res.data.patient);
      setPatientData(res.data.patient);
    }
    fetchData();
  }, []);

  return (
    <>
      {patientData ? (
          <div>
            <InformationCard dataType={'Patient'} data={patientData} keys={['weight', 'age', 'height', 'gender']} />
            <HealthStatus temp={patientData.temperature} heart={patientData.heart_rate} pressure={patientData.blood_pressure} />

          </div >
        ) : (
          <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-2xl font-bold'>No data available</h1>
          </div>
        )
      }
    </>
  )
}

export default page