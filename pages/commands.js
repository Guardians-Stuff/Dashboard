import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import Head from 'next/head';

import styles from '@/styles/Commands.module.css';
import Navbar from '@/components/Navbar';

import { commandsRef } from '../commandsRef';

export default function Commands() {
    const router = useRouter();
    const { data: session } = useSession();
    if(session) router.push('/dashboard');

    const [ activeCategory, setCategory ] = useState('Public');

    return(
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
                            <h1 className={styles.header}>Commands</h1>
                            <ul className={styles.categories} style={{ listStyle: 'none' }}>
                                {Object.keys(commandsRef).map((category, index) => (
                                    <li key={index} onClick={() => {
                                        setCategory(category);
                                    }}>{category}</li>
                                ))}
                            </ul>
                            <ul className={styles.commands} style={{ listStyle: 'none' }}>
                                {commandsRef[activeCategory].map((command) => (
                                    <li key={command[0]}>
                                        <h3>{command[0]}</h3>
                                        <p>{command[1]}</p>
                                    </li>
                                ))}
                            </ul>
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
Commands.noLayout = true;