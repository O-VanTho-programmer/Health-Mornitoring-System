'use client';
import React from 'react'
import Avatar from '../Avatar/Avatar';
import styles from './information_card.module.css';

function InformationCard({ dataType }) {
  let label = [];

  if (dataType === 'Patient') {
    label = ["Full Name", "Weight", "Age", "Height", "Gender", "Health Score"];
  } else {
    label = ["Full Name", "Expertise", "Age", "YoE", "Gender"];
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="w-[140px] h-[140px] border rounded-md overflow-hidden">
        <Avatar img_url={'/images/default_avatar.jpg'} />
      </div>

      <div className={styles.patient_info}>
        {label.map((l) => {
          return (
            <div>
              <label>{l}</label>
              <span>Unknow</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InformationCard