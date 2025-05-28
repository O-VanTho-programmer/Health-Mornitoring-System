'use client';
import React, { useContext, useEffect, useState } from "react";
import "./my_doctor.css";
import Table from "@/component/Table/Table";
import { UserContext } from "../layout";
import axios from "axios";
import ViewConsultantPopup from "@/component/ViewConsultantPopup/ViewConsultantPopup";
import InformationCard from "@/component/InformationCard/InformationCard";
import QuickMakeConsultant from "@/component/QuickMakeConsultant/QuickMakeConsultant";
import Payment from "@/component/Payment/Payment";

export default function MyDoctor() {
  const currentUser = useContext(UserContext);

  const [myDoctor, setMyDoctor] = useState(null);
  const [madeDoctorConsultants, setMadeDoctorConsultants] = useState([]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [typePopup, setTypePopup] = useState('');
  const [openQuickConsultant, setOpenQuickConsultant] = useState(false);

  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
  const [openViewPopup, setOpenViewPopup] = useState(false);

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
          <InformationCard user={myDoctor} />

          <div className="checkup-table">
            <h3>Consultants History</h3>
            {madeDoctorConsultants.length === 0 ? (
              <>
                <p>No consultant history available.</p>
              </>
            ) : (
              <>
                <Table labels={labels} data={madeDoctorConsultants} keys={keys} role={"patient"} setTypePopup={setTypePopup} onViewDetail={setSelectedRequest} setOpenViewPopup={setOpenViewPopup} onPay={setSelectedRequest} setOpenPaymentPopup={setOpenPaymentPopup} />
              </>
            )}

            <button onClick={() => setOpenQuickConsultant(true)} className="make-consultant-btn">Make Consultant</button>

          </div>

          {selectedRequest && openViewPopup && (
            <ViewConsultantPopup
              request={selectedRequest}
              onClose={() => { setOpenViewPopup(false); setSelectedRequest(null) }}
              type={typePopup}
              currentUser={currentUser}
            />
          )}

          {selectedRequest && openPaymentPopup && (
            <Payment
              onClose={() => { setOpenPaymentPopup(false); setSelectedRequest(null) }}
              data={selectedRequest}
            />
          )}

          {openQuickConsultant && (
            <QuickMakeConsultant myDoctor={myDoctor} currentUser={currentUser} onClose={() => setOpenQuickConsultant(false)} />
          )}

        </div >
      ) : (
        <div>Loading...</div>
      )
      }
    </>
  );
}
