'use client';
import React, { useContext, useEffect, useState } from 'react';
import HealthStatus from '@/component/HealthStatus/HealthStatus';
import { UserContext } from '../../layout';
import axios from 'axios';
import PatientsListTable from '@/component/PatientsListTable/PatientsListTable';
import InformationCard from '@/component/InformationCard/InformationCard';

export default function Page() {

  const currentUser = useContext(UserContext);

  const [myPatients, setMyPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPatientData, setSelectedPatientData] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    const fetchMyPatients = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/get_patients_by_doctor_id/${currentUser.id}`)

        console.log(res.data.patients);
        setMyPatients(res.data.patients);

      } catch (error) {
        console.log("Error fetching my patients");
      }
    }

    fetchMyPatients();
  }, [currentUser])

  useEffect(() => {
    const fetchPatientData = async () => {
      if (selectedPatientId) {
        try {
          const res = await axios.get(`http://localhost:5000/get_health_status_by_patient_id/${selectedPatientId}`);
          setSelectedPatientData(res.data.patient);
        } catch (error) {
          console.log("Error fetching patient data");
        }
      }
    }

    fetchPatientData();
  }, [selectedPatientId]);

  const labels = ["ID", "Full Name", "Date of Birth", "Admission Date", "Status", ""];
  const keys = ["id", "full_name", "dob", "date_start", "status"];
  return (
    <div>
      <div className='max-h-[360px]'>
        <h1 className='title'>Your Patients</h1>
        <PatientsListTable labels={labels} keys={keys} data={myPatients} setSelectedPatientId={setSelectedPatientId} />
      </div>
      
      {selectedPatientId ? (
        <InformationCard user={selectedPatientData} />
      ) : (
        <div className='flex justify-center items-center bg-white h-[300px] mt-6'>
          <h2 className='text-lg font-medium'>Select a patient to view details</h2>
        </div>
      )}

      <HealthStatus temp={selectedPatientData ? selectedPatientData.temperature : ""} heart={selectedPatientData ? selectedPatientData.heart_rate : ""} pressure={selectedPatientData ? selectedPatientData.blood_pressure : ""} />
    </div>
  );
}
