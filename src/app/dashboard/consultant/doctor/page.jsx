'use client';
import Table from '@/component/Table/Table';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../layout';
import Avatar from '@/component/Avatar/Avatar';
import ViewConsultantPopup from '@/component/ViewConsultantPopup/ViewConsultantPopup';

function page() {
    const currentUser = useContext(UserContext);
    const [myPatients, setMyPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);

    const [madeConsultants, setMadeConsultants] = useState([]);

    const [requestConsultant, setRequestConsultant] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [typePopup, setTypePopup] = useState('');

    const handleAccept = async (price) => {
        try {
            await axios.post('http://localhost:5000/accept_consultant', {
                request_id: selectedRequest.request_id,
                price,
            });
            alert('Consultant accepted!');
            setSelectedRequest(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async () => {
        try {
            await axios.post('http://localhost:5000/reject_consultant', {
                request_id: selectedRequest.request_id,
            });
            alert('Consultant rejected.');
            setSelectedRequest(null);
        } catch (err) {
            console.error(err);
        }
    };

    // 

    useEffect(() => {
        const fetchMyPatients = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/get_patients_by_doctor_id/${currentUser.id}`)
                setMyPatients(res.data.patients);
            } catch (error) {
                console.log('error fetching', error)
            }
        }
        fetchMyPatients();

        const fetchConsultantRequests = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/get_consultant_requests_by_doctor_id/${currentUser.id}`);
                console.log(res.data.requests);
                setRequestConsultant(res.data.requests);
            } catch (error) {
                console.error('Error fetching consultant requests:', error);
            }
        }
        fetchConsultantRequests();

        const fetchMadeConsultants = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/get_made_consultants_by_doctor_id/${currentUser.id}`);

                console.log(res.data.consultants);
                setMadeConsultants(res.data.consultants);
            } catch (error) {
                console.error('Error fetching made consultants:', error);
            }
        }
        fetchMadeConsultants();

        
    }, [currentUser.id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatientId || !selectedDate || !subject || !message) {
            console.log("All fields are required");
            return;
        }

        if (new Date(selectedDate) < new Date()) {
            console.log("Date should be in the future");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/submit_consultant`, { sender_id: currentUser.id, receiver_id: selectedPatientId, sender_role: 'doctor', receiver_role: 'patient', selectedDate, message, subject })

        } catch (error) {
            console.log("Error while submitting consultant", error)
        }
    }

    const labels = ["Date", "Patient", "Subject", "Status", ""];
    const keys = ["date", "patient_name", "subject", "status"];
    return (
        <div>
            <div className='flex justify-between gap-5'>
                <div className='flex-2/3'>
                    <h1 className='title'>Made Consultants</h1>
                    <Table labels={labels} keys={keys} data={madeConsultants} role={"doctor"} setTypePopup={setTypePopup} onViewDetail={setSelectedRequest}/>
                </div>

                <div className="p-4 bg-white rounded-xl min-w-[400px] shadow-lg border border-gray-200">
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
                                        <div className="font-medium text-gray-800">{request.patient_name}</div>
                                        <div className="text-sm text-gray-600 mt-1">{request.subject}</div>
                                        <div className="text-xs text-gray-400 mt-1">📅 {request.date}</div>
                                    </div>
                                    <button
                                        className="text-[#4e73df] cursor-pointer font-medium hover:underline hover:text-[#3c5cc5] transition duration-150"
                                        onClick={() => {setSelectedRequest(request); setTypePopup('viewRequest')}}
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
                                <Avatar img_url={currentUser ? currentUser.avatar : ''} />
                            </div>
                            <div className='flex flex-col gap-2 '>
                                <div className='text-xl font-bold'>
                                    <label className='text-gray-700' htmlFor='id' >Patient's Name: </label>
                                    <select onChange={(e) => setSelectedPatientId(Number(e.target.value))} className='border-b-2 border-blue-600 px-1' id='id'>
                                        <option value={''} hidden className=''>Select your patient</option>
                                        {myPatients.map((p) => (
                                            <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className='label' htmlFor='gender' >Gender: </label>
                                    <span className='span' id='gender'>
                                        {selectedPatientId !== null ?
                                            (myPatients.find(d => d.patient_id == selectedPatientId)?.gender || 'Unknow')
                                            : ("Unknown")}
                                    </span>
                                </div>

                                <div>
                                    <label className='label' htmlFor='age' >Age: </label>
                                    <span className='span' id='age'>
                                        {selectedPatientId !== null ?
                                            (myPatients.find(d => d.patient_id === selectedPatientId)?.age || 'Unknown')
                                            : ("Unknown")}
                                    </span>
                                </div>

                                <div>
                                    <label className='label' htmlFor='dob' >Date of Birth: </label>
                                    <span className='span' id='dob'>
                                        <span className='span' id='dob'>
                                            {selectedPatientId !== null ?
                                                (myPatients.find(d => d.patient_id === selectedPatientId)?.dob || 'Unknown')
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

            {selectedRequest && (
                <ViewConsultantPopup
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    type={typePopup}
                    currentUser={currentUser}
                />
            )}
        </div>
    )
}

export default page