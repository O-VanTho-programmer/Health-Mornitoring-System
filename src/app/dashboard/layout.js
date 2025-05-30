'use client';
import { createContext, useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import Avatar from '@/component/Avatar/Avatar';
import { FaAngleDown } from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { RiHealthBookFill } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { BiSolidConversation } from "react-icons/bi";
import logout from '@/utils/logout';
import axios from 'axios';
import { usePathname } from 'next/navigation';

export const UserContext = createContext(null);

export default function RootLayout({ children }) {

    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('http://localhost:5000/me', {
                    withCredentials: true
                });

                setUser(res.data.user);
            } catch (err) {
                console.error(err);
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <UserContext.Provider value={user}>
            <div className='flex min-h-[100vh] relative justify-end'>
                <aside className={`${styles.sidebar} fixed max-w-[250px] h-screen bg-gradient-primary top-0 left-0 pt-[20px] px-[10px] text-white`}>
                    <h2>Health Mornitoring System</h2>

                    <ul className={styles.side_nav}>
                        <li><a className={pathname.includes('/dashboard/health_status') ? 'active' : ''} 
                        href={`/dashboard/health_status/${user.role === 'patient' ? 'patient' : 'doctor'}`}><RiHealthBookFill size={28} /> Health Status</a></li>
                        {user.role === 'patient' && (
                            <li><a className={pathname.includes('/dashboard/my_doctor') ? 'active' : ''} href={`/dashboard/my_doctor`}><FaUserDoctor size={28} />My Doctor</a></li>
                        )}
                        <li><a className={pathname.includes('/dashboard/consultant') ? 'active' : ''} href={`/dashboard/consultant/${user.role === 'patient' ? 'patient' : 'doctor'}`}><BiSolidConversation size={28} /> Consultant</a></li>
                        <li> <a href='' onClick={logout}><IoExit size={28} /> Logout</a> </li>
                    </ul>

                </aside>

                <main className={styles.main_content}>
                    <section className='flex justify-between w-full bg-white p-4 shadow-sm'>
                        <h2 className='text-xl font-medium'>Welcome Back!</h2>

                        <div className='flex items-center group cursor-pointer gap-4 relative'>
                            <div className='w-[35px] h-[35px]'>
                                <Avatar img_url={user.avatar} />
                            </div>

                            <span className='text-base'>{user ? user.name : 'UserName'}</span>
                            <FaAngleDown />

                            <ul className='hidden absolute group-hover:block top-full right-0 bg-white shadow'>
                                {user.role === 'patient' && (
                                    <li><a href='/dashboard/my_doctor'>My Doctor</a></li>
                                )}
                                <li><a href={user.role === 'patient' ? '/dashboard/health_status/patient' : '/dashboard/health_status/doctor'}>Health Status</a></li>
                                <li><a href={user.role === 'patient' ? '/dashboard/consultant/patient' : '/dashboard/consultant/doctor'}>Consultants</a></li>
                                <li><a onClick={logout}>Logout <IoExit /></a></li>
                            </ul>
                        </div>
                    </section>

                    <section className='p-7'>
                        {children}
                    </section>
                </main>
            </div>
        </UserContext.Provider>
    );
}