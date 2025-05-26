'use client';
import React from 'react'
import Avatar from '../Avatar/Avatar';
import styles from './information_card.module.css';

function InformationCard({ data, dataType, keys }) {
  let label = [];

  if (dataType === 'Patient') {
    label = ["Weight", "Age", "Height", "Gender"];
  } else {
    label = ["Expertise", "Age", "YoE", "Gender"];
  }

  return (
    <div className="flex sm:flex-row items-center justify-between">
      <div className='flex gap-[100px]'>
        <div className="w-[160px] h-[160px] border-3 border-blue-400 rounded-full overflow-hidden">
          <Avatar img_url={data.avatar ? data.avatar : '/images/default_avatar.jpg'} />
        </div>

        <div className='text-2xl self-start'>
          <h1 className='role my-4 font-bold'>
            {dataType === 'Patient' ? 'Patient\'s Information' : 'Doctor\'s Information'}
          </h1>
          <h1 className='name'>{data ? data.name : 'Unknown'}</h1>
        </div>
      </div>

      <div className={styles.patient_info}>
        {label.map((l, idx) => {
          return (
            <div key={idx}>
              <label>{l}</label>
              <span>{data ? data[keys[idx]] : 'Unknown'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InformationCard