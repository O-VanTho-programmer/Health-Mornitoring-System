import React, { useState } from 'react'
import Avatar from '../Avatar/Avatar';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import Alert from '../Alert/Alert';

function QuickMakeConsultant({ myDoctor, currentUser, onClose }) {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const [alert, setAlert] = useState("");
    const [typeAlert, setTypeAlert] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !subject || !message) {
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
            const res = await axios.post(`http://localhost:5000/submit_consultant`, { sender_id: currentUser.id, receiver_id: myDoctor.doctor_id, sender_role: 'patient', receiver_role: 'doctor', selectedDate, message, subject })
            if (res.status === 200) {
                setAlert("Consultant submitted successfully");
                setTypeAlert("success");

                setSubject("");
                setMessage("");
                setSelectedDate(new Date());
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

    return (
        <div className='fixed flex items-center justify-center z-50 w-screen h-screen top-0 left-0 '>
            {alert && (
                <Alert message={alert} type={typeAlert} />
            )}
            <div className='absolute w-full h-full bg-black opacity-20'></div>
            <div className='relative p-6 bg-white shadow-md rounded-md z-10'>
                <button onClick={onClose} className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer'>
                    <IoClose size={35} />
                </button>
                <div className='flex'>
                    <div className='flex gap-5'>
                        <div className="w-[140px] h-[140px] border-3 border-blue-400 rounded-md overflow-hidden">
                            <Avatar img_url={myDoctor.avatar ? myDoctor.avatar : '/images/default_avatar.jpg'} />
                        </div>
                        <div className='flex flex-col gap-2 '>
                            <div className='text-xl font-bold'>
                                <label className='text-gray-700' htmlFor='id' >Dr.</label>
                                <span>{myDoctor.doctor_name}</span>
                            </div>

                            <div>
                                <label className='label' htmlFor='gender' >Gender: </label>
                                <span className='span' id='gender'>
                                    {myDoctor.gender}
                                </span>
                            </div>

                            <div>
                                <label className='label' htmlFor='exp' >Expertise: </label>
                                <span className='span' id='exp'>
                                    {myDoctor.expertise}
                                </span>
                            </div>

                            <div>
                                <label className='label' htmlFor='YoE'>Year of experience: </label>
                                <span className='span' id='YoE'>
                                    <span className='span' id='exp'>
                                        {myDoctor.YoE}
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
    )
}

export default QuickMakeConsultant