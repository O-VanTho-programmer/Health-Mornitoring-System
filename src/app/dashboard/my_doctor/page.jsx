'use client';
import React, { useContext, useEffect, useState } from "react";
import "./my_doctor.css";
import Table from "@/component/Table/Table";
import { UserContext } from "../layout";
import axios from "axios";

const doctor = {
  fullName: "Dr. John Smith",
  specialty: "Cardiology",
  experience: 12,
  email: "john.smith@hospital.com",
  avatar: "https://i.ibb.co/6RhjqDR/doctor-avatar.png",
  consultants: [
    { date: "2025-04-01", diagnosis: "High Blood Pressure", treatment: "Medication + Diet" },
    { date: "2025-02-15", diagnosis: "Chest Pain", treatment: "ECG + Rest" }
  ]
};

export default function MyDoctor() {
  const currentUser = useContext(UserContext);

  const [myDoctor, setMyDoctor] = useState(null);
  const [madeDoctorConsultants, setMadeDoctorConsultants] = useState([]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/get_doctor_by_patient_id/${currentUser.id}`);
        setMyDoctor(res.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  useEffect(() => {
    if (!myDoctor) {
      return;
    }

    const fetchConsultantsData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/get_made_consultants_patient_doctor/${currentUser.id}/${myDoctor.id}`);
        setMadeDoctorConsultants(res.data.consultants);
      } catch (error) {
        console.error("Error fetching consultants data:", error);
      }
    }

    fetchConsultantsData();
  },[myDoctor])

  return (
    <div className="my-doctor-wrapper">
      <h2>My Doctor</h2>
      <div className="my-doctor-container">
        <div className="doctor-info-card">
          <img src={doctor.avatar} alt="Doctor Avatar" />
          <div className="info-item"><span className="info-label">Full Name:</span> {doctor.fullName}</div>
          <div className="info-item"><span className="info-label">Specialty:</span> {doctor.specialty}</div>
          <div className="info-item"><span className="info-label">Years of Experience:</span> {doctor.experience}</div>
          <div className="info-item"><span className="info-label">Email:</span> {doctor.email}</div>
        </div>

        <div className="checkup-table">
          <h3>Consultants History</h3>
          {doctor.consultants.length === 0 ? (
            <>
              <p>No consultant history available.</p>
              <button className="make-consultant-btn">Make Consultant</button>
            </>
          ) : (
            <>
              <Table
                labels={["Date", "Diagnosis", "Treatment"]}
            
              />
              <button className="make-consultant-btn">Make Consultant</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
