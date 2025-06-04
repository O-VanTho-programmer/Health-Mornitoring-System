import { UserContext } from "@/app/dashboard/layout";
import React, { useContext, useState } from "react";
import axios from "axios";
import Alert from "../Alert/Alert";

export default function Payment({ onClose, data }) {
    const currentUser = useContext(UserContext);
    const [paymentMethod, setPaymentMethod] = useState("card");
    
    const [alert, setAlert] = useState("");
    const [typeAlert, setTypeAlert] = useState("");

    const [cardInfo, setCardInfo] = useState({
        card_number: "",
        card_holder: "",
        expiry: "",
        cvc: "",
    });

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardInfo({ ...cardInfo, [name]: value });
    };

    const handleConfirm = async () => {
        const payload = {
            patient_id: currentUser?.id,
            doctor_id: data?.doctor_id,
            request_id: data?.request_id,
            patient_name: currentUser?.name,
            doctor_name: data?.doctor_name,
            service: data?.subject,
            date: data?.date,
            price: data?.price,
            payment_method: paymentMethod,
            ...(paymentMethod === "card" ? cardInfo : {}),
        };

        try {
            const res = await axios.post("http://localhost:5000/pay_consultant", payload);
            setAlert(res.data.message || "Payment success");
            onClose(); // close popup
        } catch (err) {
            console.error(err);
            setAlert("Payment failed. Try again.");
        }
    };

    return (
        <div className="fixed w-screen h-screen top-0 left-0 flex items-center justify-center z-50 font-sans">
            {alert && (
                <Alert message={alert} type={typeAlert} onClose={() => setAlert("")} />
            )}
            
            <div onClick={onClose} className="bg-black opacity-50 w-full h-full absolute top-0 left-0"></div>
            <div className="max-w-3xl w-[90%] bg-white rounded-lg shadow-lg p-6 z-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment for Consultation</h2>

                <div className="mb-6 text-sm text-gray-700 space-y-1">
                    <p><strong>Doctor:</strong> {data?.doctor_name}</p>
                    <p><strong>Date:</strong> {data?.date}</p>
                    <p><strong>Price:</strong> <span className="text-green-600 font-semibold">{data?.price}đ</span></p>
                    <p><strong>Service:</strong> {data?.subject}</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Method</h3>
                    <div className="space-y-2">
                        {["card", "momo", "clinic"].map((method) => (
                            <label key={method} className={`flex items-center gap-3 border rounded-lg px-4 py-2 cursor-pointer ${paymentMethod === method ? "border-blue-500 bg-blue-50" : "hover:border-blue-300"}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="accent-blue-600"
                                />
                                {method === "card" ? "Credit/Debit Card" : method === "momo" ? "Momo Wallet" : "Pay at Clinic"}
                            </label>
                        ))}
                    </div>
                </div>

                {paymentMethod === "card" && (
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Card Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="card_number" value={cardInfo.card_number} onChange={handleCardInputChange} placeholder="Card Number" className="border px-4 py-2 rounded-md w-full" />
                            <input type="text" name="card_holder" value={cardInfo.card_holder} onChange={handleCardInputChange} placeholder="Cardholder Name" className="border px-4 py-2 rounded-md w-full" />
                            <input type="text" name="expiry" value={cardInfo.expiry} onChange={handleCardInputChange} placeholder="Expiry (MM/YY)" className="border px-4 py-2 rounded-md w-full" />
                            <input type="text" name="cvc" value={cardInfo.cvc} onChange={handleCardInputChange} placeholder="CVC" className="border px-4 py-2 rounded-md w-full" />
                        </div>
                    </div>
                )}

                <div className="text-right">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition" onClick={handleConfirm}>
                        Confirm & Pay
                    </button>
                </div>
            </div>
        </div>
    );
}
