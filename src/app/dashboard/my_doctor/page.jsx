'use client';
import React, { useContext, useEffect, useState } from "react";
import "./my_doctor.css";
import Table from "@/component/Table/Table";
import { UserContext } from "../layout";
import axios from "axios";
import Avatar from "@/component/Avatar/Avatar";
import ViewConsultantPopup from "@/component/ViewConsultantPopup/ViewConsultantPopup";

export default function MyDoctor() {
  const currentUser = useContext(UserContext);

  const [myDoctor, setMyDoctor] = useState(null);
  const [madeDoctorConsultants, setMadeDoctorConsultants] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [typePopup, setTypePopup] = useState('');

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
        const res = await axios.get(`http://localhost:5000/get_made_consultants_patient_doctor/${currentUser.id}/${myDoctor.doctor_id}`);
        setMadeDoctorConsultants(res.data.consultants);
        console.log("Consultants data:", res.data.consultants);
      } catch (error) {
        console.error("Error fetching consultants data:", error);
      }
    }

    fetchConsultantsData();
  }, [myDoctor])

  const labels = ["Date", "Subject", "Status", ""];
  const keys = ["date", "subject", "status"];

  return (
    <>
      {myDoctor ? (
        <div className="my-doctor-wrapper">
          <h2>My Doctor</h2>
          <div className="my-doctor-container">
            <div className="doctor-info-card">
              <Avatar img_url={myDoctor.avatar} />
              <div className="info-item"><span className="info-label">Full Name:</span> {myDoctor.doctor_name}</div>
              <div className="info-item"><span className="info-label">Specialty:</span> {myDoctor.expertise}</div>
              <div className="info-item"><span className="info-label">Years of Experience:</span> {myDoctor.YoE}</div>
              <div className="info-item"><span className="info-label">Email:</span> {myDoctor.email}</div>
            </div>

            <div className="checkup-table">
              <h3>Consultants History</h3>
              {madeDoctorConsultants.length === 0 ? (
                <>
                  <p>No consultant history available.</p>
                </>
              ) : (
                <>
                  <Table labels={labels} data={madeDoctorConsultants} keys={keys} role={"patient"} setTypePopup={setTypePopup} onViewDetail={setSelectedRequest} />
                </>
              )}

              <button className="make-consultant-btn">Make Consultant</button>

            </div>
          </div>
          {selectedRequest && (
            <ViewConsultantPopup
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
              type={typePopup}
              currentUser={currentUser}
            />
          )}
        </div >
      ) : (
        <div>Loading...</div>
      )
      }
    </>
  );
}
