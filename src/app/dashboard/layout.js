'use client';
import { useState } from 'react';
import styles from './dashboard.module.css';
import Avatar from '@/component/Avatar/Avatar';
import { FaAngleDown } from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { RiHealthBookFill } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { BiSolidConversation } from "react-icons/bi";

export default function RootLayout({ children }) {

    const [user, setUser] = useState(null);

    return (
        <html lang="en">
            <body className='flex min-h-[100vh] relative justify-end'>
                <aside className={`${styles.sidebar} fixed max-w-[250px] h-screen bg-gradient-primary top-0 left-0 pt-[20px] px-[10px] text-white`}>
                    <h2>Health Mornitoring System</h2>

                    <ul className={styles.side_nav}>
                        <li><a href={`/dashboard/health_status/doctor`}><RiHealthBookFill size={28}/> Health Status</a></li>
                        <li><a href={``}><FaUserDoctor size={28} /> Doctor</a></li>
                        <li><a href='/dashboard/consultant'><BiSolidConversation size={28} /> Consultant</a></li>
                        <li><a href=''><IoExit size={28} /> Logout </a></li>
                    </ul>

                </aside>

                <main className={styles.main_content}>
                    <section className='flex justify-between w-full bg-white p-4 shadow-sm'>
                        <h2 className='text-xl font-medium'>Welcome Back!</h2>

                        <div className='flex items-center group cursor-pointer gap-4 relative'>
                            <div className='w-[35px] h-[35px]'>
                                <Avatar img_url={user ? user.avatar : '/images/default_avatar.jpg'} />
                            </div>

                            <span className='text-base'>{user ? user.name : 'UserName'}</span>
                            <FaAngleDown />

                            <ul className='hidden absolute group-hover:block top-full right-0 bg-white shadow'>
                                <li><a>Profile</a></li>
                                <li><a href='/dashboard/doctor/health_status'>Health Status</a></li>
                                <li><a>Logout <IoExit /></a></li>
                            </ul>
                        </div>
                    </section>

                    <section className='p-7'>
                        {children}
                    </section>
                </main>
            </body>
        </html>
    );
}