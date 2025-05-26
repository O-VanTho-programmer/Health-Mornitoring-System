import React from 'react';

function ConfirmRemove({ onClose }) {
    const handleRemove = async () => {
        try {
            const res = await axios.post("http://localhost:5000/remove_consultant", { request_id: request.request_id });
            if (res.data.success) {
                onClose();
                alert("Consultant removed successfully.");
            } else {
                alert("Failed to remove consultant. Please try again.");
            }
        } catch (error) {

        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm z-50 p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Removal</h3>
                <p className="text-sm text-gray-600 mb-6">Are you sure you want to remove this consultant? This action cannot be undone.</p>

                <div className="flex justify-end gap-3">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition duration-150"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-150"
                        onClick={handleRemove}
                    >
                        Yes, Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmRemove;
