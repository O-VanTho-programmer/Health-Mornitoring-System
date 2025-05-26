'use client';
import React from 'react'
import styles from './table.module.css';
import { FaEye, FaMoneyCheck } from 'react-icons/fa';

function Table({ labels, data, keys, role, onViewDetail, setTypePopup }) {

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {labels.map((label, idx) => (
                            <th key={idx}>{label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className='max-h-[300px] overflow-hidden'>
                    {data && data.length > 0 ? (
                        data.map((row, idx) => (
                            <tr key={idx}>
                                {keys.map((key, labelIdx) => (
                                    <td key={labelIdx}>
                                        {row[key] || 'N/A'}
                                    </td>
                                ))}

                                <td className="flex gap-2">
                                    <button
                                        className="cursor-pointer group flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 hover:gap-1 transition-all"
                                        onClick={() =>{
                                            onViewDetail(row); 
                                            setTypePopup('viewConsultant');
                                        }}
                                    >
                                        <FaEye />
                                        <span className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
                                            View
                                        </span>
                                    </button>

                                    {role === 'patient' && row.status === 'Accepted (Unpaid)' && (
                                        <button
                                            className="cursor-pointer group flex items-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 hover:gap-1 transition-all"
                                        >
                                            <FaMoneyCheck />
                                            <span className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
                                                Pay
                                            </span>
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={labels.length} style={{ textAlign: 'center' }}>No data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Table