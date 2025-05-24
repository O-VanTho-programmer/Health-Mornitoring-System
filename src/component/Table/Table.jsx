'use client';
import React from 'react'
import styles from './table.module.css';

function Table({labels, data}) {
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
                            <tr key={idx} className={styles.tr}>
                                {row.map((cell, cidx) => (
                                    <td key={cidx}>{cell}</td>
                                ))}
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