import Head from 'next/head';
import Link from 'next/link';

import { Button, Typography, Box as MuiBox } from '@mui/material';
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
                    <MuiBox
                        sx={{
                            mb: 3,
                            animation: 'fadeIn 1s ease-out 0.2s both',
                            '@keyframes fadeIn': {
                                from: { opacity: 0 },
                                to: { opacity: 1 }
                            },
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            src="https://media.discordapp.net/attachments/1442949704240464015/1444607500778213446/b0fc77e52e5d00cfd644c5bbe85551d6.jpg?ex=692d5313&is=692c0193&hm=24bc85c8657a412be716f8d3412f282f3662fa1d1ac5e0ec6e95d211ffdffd47&=&format=webp&width=320&height=320"
                            alt="Guardian Bot"
                            style={{
                                width: 'clamp(140px, 16vw, 160px)',
                                height: 'clamp(140px, 16vw, 160px)',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                                border: '3px solid rgba(255, 255, 255, 0.1)',
                            }}
                        />
                    </MuiBox>
                    <Typography 
                        sx={{ 
                            typography: { xs: 'h2', sm: 'h1' },
                            mb: 2
                        }} 
                        className={styles.header}
                    >
                        GUARDIAN
                    </Typography>
                    <Typography 
                        sx={{ 
                            typography: { xs: 'h7', sm: 'h6' },
                            mb: 4
                        }} 
                        className={styles.subheader}
                    >
                        The most powerful and advanced multi-purpose Discord bot with a web dashboard focused on advanced moderation to secure servers.
                    </Typography>

                    <MuiBox 
                        sx={{ 
                            mt: 3,
                            animation: 'fadeIn 1s ease-out 0.6s both',
                            '@keyframes fadeIn': {
                                from: { opacity: 0 },
                                to: { opacity: 1 }
                            }
                        }}
                    >
                        <Link href='https://discord.com/oauth2/authorize?client_id=1053736067129421884&scope=bot&permissions=8'>
                            <Button 
                                variant="contained" 
                                color="blurple"
                                startIcon={<DiscordIcon />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    background: 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    color: '#e0e0e0',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.7)',
                                        background: 'linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%)',
                                        borderColor: 'rgba(150, 150, 150, 0.5)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    }
                                }}
                            >
                                Invite to server
                            </Button>
                        </Link>
                    </MuiBox>
                </main>
            </Box>
        </>
    );
}