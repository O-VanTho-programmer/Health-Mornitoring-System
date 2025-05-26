import React, { useState } from 'react';
import ConfirmRemove from '../ConfirmRemove/ConfirmRemove';

function ViewConsultantPopup({ request, onClose, onAccept, onReject, type, currentUser }) {
    const [price, setPrice] = useState(request?.price || 50);

    const [confirmRemove, setConfirmRemove] = useState(false);

    const handleOnchangePrice = (e) => {
        const value = e.target.value;
        if (value < 50) {
            setPrice(50);
        } else {
            setPrice(Number(value));
        }
    };

    const handleAccept = () => {
        if (!price) {
            alert('Please enter a price before accepting.');
            return;
        }
        onAccept(price);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg z-50 p-6 border border-gray-200">
                <div className='flex items-center justify-between mb-4'>
                    <h2 className="text-2xl font-semibold text-[#4e73df]">Consultant Request</h2>
                    <span className="text-sm text-gray-500">{request.status}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                    {currentUser.role === 'doctor' && (
                        <p><span className="font-medium">Patient:</span> {request.patient_name}</p>
                    )}
                    {currentUser.role === 'patient' && (
                        <p><span className="font-medium">Doctor:</span> {request.doctor_name}</p>
                    )}
                    <p><span className="font-medium">Subject:</span> {request.subject}</p>
                    <p><span className="font-medium">Message:</span> {request.message}</p>
                    <p><span className="font-medium">Date:</span> {request.date}</p>
                </div>

                <div className="mt-5">
                    <label className="block font-medium text-sm text-gray-800 mb-1">
                        Set Price (VND):
                    </label>
                    <input
                        disabled={type === 'viewConsultant'}
                        type="number"
                        min={50}
                        value={price}
                        onChange={handleOnchangePrice}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4e73df]"
                        placeholder="Enter price..."
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition duration-150 cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    {type === 'viewRequest' && (
                        <>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-150 cursor-pointer"
                                onClick={onReject}
                            >
                                Reject
                            </button>
                            <button
                                className="bg-[#4e73df] hover:bg-[#3c5cc5] text-white px-4 py-2 rounded-lg transition duration-150 cursor-pointer"
                                onClick={handleAccept}
                            >
                                Accept
                            </button>
                        </>
                    )}

                    {type === 'viewConsultant' && (
                        <div className="relative group">
                            <button
                                className={`px-4 py-2 rounded-lg transition duration-150 cursor-pointer 
        ${currentUser.id !== request.sender_id
                                        ? 'bg-red-400 text-white cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 text-white'}`}
                                onClick={() => {
                                    if (currentUser.id === request.sender_id) {
                                        setConfirmRemove(true);
                                    }
                                }}
                                disabled={currentUser.id !== request.sender_id}
                            >
                                Remove
                            </button>

                            {currentUser.id !== request.sender_id && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                    Only the sender can remove this
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {confirmRemove && (
                <ConfirmRemove onClose={() => setConfirmRemove(false)} />
            )}
        </div>
    );
}

export default ViewConsultantPopup;
