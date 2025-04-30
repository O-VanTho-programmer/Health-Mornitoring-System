import styles from './dashboard.module.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className='flex min-h-[100vh]'>
                <aside className={`${styles.sidebar} bg-gradient-primary`}>
                    <h2>Health Mornitoring System</h2>


                </aside>

                <main className={styles.main_content}>
                    <h1>Dashboard</h1>

                </main>
            </body>
        </html>
    );
}