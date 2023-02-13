import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';

import Head from 'next/head';
import Link from 'next/link';

import styles from '@/styles/Home.module.css';
import LinkIcon from '@/components/icons/LinkIcon';
import Navbar from '@/components/Navbar';


export default function Home() {
    const router = useRouter();
    const { data: session } = useSession();
    if(session) router.push('/dashboard');

    return (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.container}>
                <Navbar />
                <div className={styles.grid}>
                    <div></div>
                    <div className={styles.center}>
                        <div className={styles.body}>
                            <h1 className={styles.header}>GUARDIAN</h1>
                            <h3 className={styles.subheader}>The most powerful and advanced multi-purpose Discord bot with a web dashboard focused on advanced moderation to secure servers.</h3>
                            { /* TODO: Add href for server invite */ }
                            <Link href={'#'} style={{ marginTop: 25, marginBottom: 200 }}>
                                <Button variant="contained" color="blurple" startIcon={<LinkIcon />} onClick={() => {
                                    alert('Server invite not implemented yet');
                                }}>Invite to server</Button>
                            </Link>
                            <div className={styles.description}>
                                <h3>&#9889; Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</h3>
                                <h3>&#128170; Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</h3>
                                <h3>&#128274; Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h3>
                            </div>
                            { /* TODO: Add href for server invite */ }
                            <Link href={'#'} style={{ marginTop: 25, marginBottom: 200 }}>
                                <Button variant="contained" color="blurple" startIcon={<LinkIcon />} onClick={() => {
                                    alert('Server invite not implemented yet');
                                }}>Invite to server</Button>
                            </Link>
                        </div>
                    </div>
                    <div></div>
                </div>
                <div className={styles.footer}>
          
                </div>
            </main>
        </>
    );
}
Home.noLayout = true;