'use client';
import React from 'react'
import styles from './table.module.css';

function Table({labels}) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {labels.map((label, idx) => {
                            return (
                                <th key={idx}>{label}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody className='max-h-[300px] overflow-hidden'>
                    {[...Array(10)].map((_, idx) => (
                        <tr key={idx} className={styles.tr}>
                            <td>D542</td>
                            <td>Lam Trung</td>
                            <td>12/05/2025</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table