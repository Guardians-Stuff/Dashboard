import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import Head from 'next/head';

import styles from '@/styles/Commands.module.css';
import Navbar from '@/components/Navbar';

export default function Commands(props) {
    const router = useRouter();
    const { data: session } = useSession();
    if(session) router.push('/dashboard');

    const commands = props.commands;
    const categories = [ ...new Set(commands.map(command => command.category)) ];

    const [ activeCategory, setCategory ] = useState('public');

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
                                {categories.map(category => (
                                    <li key={category} onClick={() => {
                                        setCategory(category);
                                    }}>{category.charAt(0).toUpperCase() + category.slice(1)}</li>
                                ))}
                            </ul>
                            <ul className={styles.commands} style={{ listStyle: 'none' }}>
                                {commands.filter(command => command.category == activeCategory).map(command => (
                                    <div key={command.name}>
                                        <li>
                                            <h3>/{command.name}</h3>
                                            <p>{command.description}</p>
                                        </li>
                                        {command.subcommands.map(subcommand => (
                                            <li key={`${command.name}-${subcommand.name}`}>
                                                <h3>/{command.name} {subcommand.name}</h3>
                                                <p>{subcommand.description}</p>
                                            </li>
                                        ))}
                                    </div>
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

export async function getServerSideProps(context){
    const commands = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/commands`, { cache: 'no-cache', headers: { 'Cookie': context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => []);

    return { props: { commands: commands } };
}