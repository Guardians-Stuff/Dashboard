import Head from 'next/head';
import Link from 'next/link';

import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';

import styles from '@/styles/Home.module.css';
import DiscordIcon from '@/components/icons/DiscordIcon';
    
export default function Home() {
    return (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box className={styles.background}>
                <main className={styles.container}>
                    <Typography sx={{ typography: { xs: 'h2', sm: 'h1' } }} className={styles.header}>GUARDIAN</Typography>
                    <Typography sx={{ typography: { xs: 'h7', sm: 'h6' } }} className={styles.subheader}>The most powerful and advanced multi-purpose Discord bot with a web dashboard focused on advanced moderation to secure servers.</Typography>

                    <Link href='https://discord.com/oauth2/authorize?client_id=1053736067129421884&scope=bot&permissions=8' style={{ marginTop: 25 }}>
                        <Button variant="contained" color="blurple" startIcon={<DiscordIcon />}>Invite to server</Button>
                    </Link>
                </main>
            </Box>
        </>
    );
}