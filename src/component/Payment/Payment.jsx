import React, { useState } from "react";

export default function Payment({ onClose, data }) {
    const [paymentMethod, setPaymentMethod] = useState("card");

    return (
        <div className="fixed w-screen h-screen top-0 left-0 flex items-center justify-center z-50">
            <div onClick={onClose} className="bg-black opacity-50 w-full h-full absolute top-0 left-0"></div>
            <div className="max-w-3xl bg-white rounded-lg shadow-lg p-6 z-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Payment for Consultation
                </h2>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Order Summary
                    </h3>
                    <div className="border rounded-lg p-4 bg-gray-50 text-sm text-gray-700">

                        <p>
                            <span className="font-medium">Doctor:</span> {data?.doctor_name || "Unknown"}
                        </p>
                        <p>
                            <span className="font-medium">Date:</span> {data?.date || "Unknown"}
                        </p>
                        <p>
                            <span className="font-medium">Price:</span>
                            <span className="text-green-600 font-semibold"> {data?.price}đ</span>
                        </p>

                        <p className="mt-4">
                            <span className="font-medium">For consultant:</span>
                            <span className="font-semibold"> {data.subject || "Error Data"}</span>
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Payment Method
                    </h3>
                    <div className="space-y-3">
                        {["card", "momo", "clinic"].map((method) => (
                            <label
                                key={method}
                                className={`flex items-center gap-3 border rounded-lg px-4 py-2 cursor-pointer ${paymentMethod === method ? "border-blue-500" : "hover:border-blue-300"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="accent-blue-600"
                                />
                                <span>
                                    {method === "card"
                                        ? "Credit/Debit Card"
                                        : method === "momo"
                                            ? "Momo Wallet"
                                            : "Pay at Clinic"}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {paymentMethod === "card" && (
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            Card Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Card Number"
                                className="border px-4 py-2 rounded-md w-full"
                            />
                            <input
                                type="text"
                                placeholder="Cardholder Name"
                                className="border px-4 py-2 rounded-md w-full"
                            />
                            <input
                                type="text"
                                placeholder="Expiry (MM/YY)"
                                className="border px-4 py-2 rounded-md w-full"
                            />
                            <input
                                type="text"
                                placeholder="CVC"
                                className="border px-4 py-2 rounded-md w-full"
                            />
                        </div>
                    </div>
                )}

                {/* Confirm Button */}
                <div className="text-right">
                    <button
                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition duration-150"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button className="cursor-pointer ml-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Confirm & Pay
                    </button>
                </div>
            </div>
        </div>
    );
}
