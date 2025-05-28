import React from "react";

export default function InformationCard({ user }) {
    return (
        <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{user.role === "patient" ? "Patient Role" : "Doctor Role"}</h2>

            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:w-1/3 border-r border-gray-200 pr-6">
                    <img
                        src={user.avatar ? user.avatar : "/images/default_avatar.jpg"}
                        alt="User Avatar"
                        className="w-28 h-28 rounded-full object-cover mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.role === 'patient' ? 'Patient' : 'Doctor'}</p>
                </div>

                <div className="flex-1 space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-600 mb-2">User Profile</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                            <p><span className="font-medium">Gender:</span> {user.gender}</p>
                            <p><span className="font-medium">Date of Birth:</span> {user.dob}</p>
                            <p><span className="font-medium">Email:</span> {user.email}</p>
                        </div>
                    </div>

                    {user.role === "patient" && (
                        <>
                            <div>
                                <h4 className="font-semibold text-gray-600 mb-2">Health Metrics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                    <p><span className="font-medium">Weight:</span> {user.weight} (kg)</p>
                                    <p><span className="font-medium">Height:</span> {user.height} (cm)</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-600 mb-2">Admission Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                    <p><span className="font-medium">Admission Date:</span> {user.date_start}</p>
                                </div>
                            </div>
                        </>
                    )}

                    {user.role === "doctor" && (
                        <>
                            <div>
                                <h4 className="font-semibold text-gray-600 mb-2">Doctor Info</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                    <p><span className="font-medium">Expertise:</span> {user.expertise}</p>
                                    <p><span className="font-medium">Years of Experience:</span> {user.YoE}</p>
                                    <p>
                                        <span className="font-medium">Available:</span>{" "}
                                        <span className={user.available ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                                            {user.available ? "Yes" : "No"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-600 mb-2">Statistics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                    <p><span className="font-medium">Max Patients:</span> {user.maxPatient}</p>
                                    <p><span className="font-medium">Currently Assigned:</span> {user.currentAssigned}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
