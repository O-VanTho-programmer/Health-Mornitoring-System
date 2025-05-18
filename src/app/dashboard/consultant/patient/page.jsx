'use client';
import Avatar from '@/component/Avatar/Avatar';
import Table from '@/component/Table/Table';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../layout';

function page() {
    const currentUser = useContext(UserContext);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [madeConsultants, setMadeConsultants] = useState([]);

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const getMadeConsultants = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/get_made_consultants/${currentUser.id}`);
                setMadeConsultants(res.data.consultants);
            } catch (error) {
                console.log("Error getting consultants");
            }
        }

        const getDoctorsData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/get_doctors');
                setDoctors(res.data.doctors);
            } catch (error) {
                console.log("Error while getting doctor datas", error)
            }
        }

        getMadeConsultants();
        getDoctorsData();
    }, [])

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/submit_consultant`, {patient_id: currentUser.id, doctor_id: selectedDoctor, selectedDate})
            
        } catch (error) {
            
        }
    }

    const labels = ["Date", "Doctor", "Subject", "Status"];
    return (
        <div>
            <h1 className='title'>Made Consultants</h1>
            <Table labels={labels} />

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

                    <form className="flex flex-col md:flex-row gap-6 mt-10">
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
        </div>
    )
}

export default page