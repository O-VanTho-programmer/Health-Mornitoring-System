'use client';
import Avatar from '@/component/Avatar/Avatar';
import Table from '@/component/Table/Table';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../layout';
import ViewConsultantPopup from '@/component/ViewConsultantPopup/ViewConsultantPopup';
import Payment from '@/component/Payment/Payment';
import Alert from '@/component/Alert/Alert';

function page() {
    const currentUser = useContext(UserContext);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [madeConsultants, setMadeConsultants] = useState([]);

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [typePopup, setTypePopup] = useState('');

    const [selectedRequestFromDoctor, setSelectedRequestFromDoctor] = useState(null);
    const [requestConsultant, setRequestConsultant] = useState([]);

    const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
    const [openViewPopup, setOpenViewPopup] = useState(false);

    const [alert, setAlert] = useState("");
    const [typeAlert, setTypeAlert] = useState("");

    const getMadeConsultants = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/get_made_consultants_patient_side/${currentUser.id}`);
            setMadeConsultants(res.data.consultants);
        } catch (error) {
            console.log("Error getting consultants");
        }
    }

    useEffect(() => {
        const getDoctorsData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/get_doctors');
                setDoctors(res.data.doctors);
            } catch (error) {
                console.log("Error while getting doctor datas", error)
            }
        }

        const getRequestConsultant = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/get_consultant_request_to_patient/${currentUser.id}`);
                setRequestConsultant(res.data.requests);
            } catch (error) {
                console.log("Error while getting request consultant", error)
            }
        }

        getMadeConsultants();
        getDoctorsData();
        getRequestConsultant();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDoctor || !selectedDate || !subject || !message) {
            setAlert("All fields are required");
            setTypeAlert("danger");
            return;
        }

        if (new Date(selectedDate) < new Date()) {
            setAlert("Date should be in the future");
            setTypeAlert("danger");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/submit_consultant`, { sender_id: currentUser.id, receiver_id: selectedDoctor, sender_role: 'patient', receiver_role: 'doctor', selectedDate, message, subject })
            if (res.status === 200) {
                setAlert("Consultant submitted successfully");
                setTypeAlert("success");

                setSubject("");
                setMessage("");
                setSelectedDate(new Date());
                setSelectedDoctor(null);

                //Update lai
                getMadeConsultants();
            }
        } catch (error) {
            console.log("Error while submitting consultant", error)
            setAlert("Failed to submit consultant. Please try again.");
            setTypeAlert("danger");
        } finally {
            setTimeout(() => {
                setAlert('');
                setTypeAlert('');
            }, 3000);
        }
    }

    const labels = ["Date", "Doctor", "Subject", "Status", ""];
    const keys = ["date", "doctor_name", "subject", "status"];

    return (
        <div>
            {alert && (
                <Alert message={alert} type={typeAlert} />
            )}
            <div className='flex justify-between gap-5'>
                <div className='flex-2/3'>
                    <h1 className='title'>Made Consultants</h1>
                    <Table labels={labels} data={madeConsultants} keys={keys} role={"patient"} setTypePopup={setTypePopup} onViewDetail={setSelectedRequest} setOpenViewPopup={setOpenViewPopup} onPay={setSelectedRequest} setOpenPaymentPopup={setOpenPaymentPopup} />
                </div>

                <div className="p-4 bg-white rounded-xl min-w-[340px] shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-[#4e73df] mb-4">🗂️ Consultant Requests</h2>

                    {requestConsultant.length === 0 ? (
                        <div className="text-center text-sm text-gray-500 italic">No consultant requests</div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {requestConsultant.map((request) => (
                                <div
                                    key={request.id}
                                    className="flex justify-between items-start bg-gray-50 hover:shadow transition-shadow duration-200 border border-gray-200 rounded-lg p-4"
                                >
                                    <div>
                                        <div className="font-medium text-gray-800">{request.doctor_name}</div>
                                        <div className="text-sm text-gray-600 mt-1">{request.subject}</div>
                                        <div className="text-xs text-gray-400 mt-1">📅 {request.date}</div>
                                    </div>
                                    <button
                                        className="text-[#4e73df] cursor-pointer font-medium hover:underline hover:text-[#3c5cc5] transition duration-150"
                                        onClick={() => { setSelectedRequestFromDoctor(request); setTypePopup('viewRequest'); setOpenViewPopup(true); }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className='mt-5'>
                <h1 className='title'>New Consultant</h1>

                <div className='p-6 bg-white shadow-md rounded-md'>
                    <div className='flex'>
                        <div className='flex gap-5'>
                            <div className="w-[140px] h-[140px] border-3 border-blue-400 rounded-md overflow-hidden">
                                <Avatar img_url={'/images/default_avatar.jpg'} />
                            </div>
                            <div className='flex flex-col gap-2 '>
                                <div className='text-xl font-bold'>
                                    <label className='text-gray-700' htmlFor='id' >Dr.</label>
                                    <select onChange={(e) => setSelectedDoctor(Number(e.target.value))} className='border-b-2 border-blue-600 px-1' id='id'>
                                        <option value={''} hidden className=''>Select your doctor</option>
                                        {doctors.map((d) => (
                                            <option key={d.doctor_id} value={d.doctor_id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className='label' htmlFor='gender' >Gender: </label>
                                    <span className='span' id='gender'>
                                        {selectedDoctor !== null ?
                                            (doctors.find(d => d.doctor_id == selectedDoctor)?.gender || 'Unknow')
                                            : ("Unknown")}
                                    </span>
                                </div>

                                <div>
                                    <label className='label' htmlFor='exp' >Expertise: </label>
                                    <span className='span' id='exp'>
                                        {selectedDoctor !== null ?
                                            (doctors.find(d => d.doctor_id === selectedDoctor)?.expertise || 'Unknown')
                                            : ("Unknown")}
                                    </span>
                                </div>

                                <div>
                                    <label className='label' htmlFor='YoE' >Year of experience: </label>
                                    <span className='span' id='YoE'>
                                        <span className='span' id='exp'>
                                            {selectedDoctor !== null ?
                                                (doctors.find(d => d.doctor_id === selectedDoctor)?.YoE || 'Unknown')
                                                : ("Unknown")}
                                        </span>
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className='bg-gradient-primary'>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 mt-10">
                        {/* Left Section */}
                        <div className="w-full md:w-1/2 space-y-4">
                            <div className="flex flex-col">
                                <label className="label mb-1" htmlFor="date">Date:</label>
                                <input value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} type="date" id="date" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div className="flex flex-col">
                                <label className="label mb-1" htmlFor="subject">Subject:</label>
                                <input value={subject} onChange={(e) => setSubject(e.target.value)} type="text" id="subject" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="w-full md:w-1/2 flex flex-col gap-4">
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type your message"></textarea>
                            <button type="submit" className="send_btn self-start">Send</button>
                        </div>
                    </form>
                </div>
            </div>

            {(selectedRequest || selectedRequestFromDoctor) && openViewPopup && (
                <ViewConsultantPopup
                    request={selectedRequest || selectedRequestFromDoctor}
                    onClose={() => { setOpenViewPopup(false); setSelectedRequest(null); setSelectedRequestFromDoctor(null); }}
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
        </div>
    )
}

export default page