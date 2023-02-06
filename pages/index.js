import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';

import Head from 'next/head';
import Link from 'next/link';

import styles from '@/styles/Home.module.css';
import DiscordIcon from '@/components/icons/DiscordIcon';


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
            <main className={styles.center} style={{ height: '100vh' }}>
                <Link href={`https://discord.com/api/oauth2/authorize?client_id=1046820104144420934&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_HOST)}%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify%20guilds`}>
                    <Button variant="contained" color="blurple" startIcon={<DiscordIcon />}>Login with Discord</Button>
                </Link>
            </main>
        </>
    );
}