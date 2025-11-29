import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

import TextAvatar from '@/components/TextAvatar';

export default function DashboardPage(props) {
    const router = useRouter();
    /** @type {Array<Guild>} */ const guilds = props.guilds || [];
    /** @type {Boolean} */ const mobile = props.mobile;

    // Filter to show only authorized guilds with bot
    const authorizedGuilds = guilds.filter(guild => guild.hasBot && guild.authorized);

    return (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                padding: 3,
                animation: 'fadeInUp 0.8s ease-out',
                '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                }
            }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        marginBottom: 3,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'fadeInDown 0.6s ease-out',
                        '@keyframes fadeInDown': {
                            from: { opacity: 0, transform: 'translateY(-20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}
                >
                    Welcome to Guardian Dashboard
                </Typography>
                
                {authorizedGuilds.length > 0 ? (
                    <>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                marginBottom: 3, 
                                alignSelf: 'flex-start',
                                color: 'rgba(200, 200, 200, 0.9)',
                                fontWeight: 600,
                                animation: 'fadeIn 0.8s ease-out 0.2s both',
                                '@keyframes fadeIn': {
                                    from: { opacity: 0 },
                                    to: { opacity: 1 }
                                }
                            }}
                        >
                            Your Servers
                        </Typography>
                        <Grid container spacing={2} sx={{ width: '100%', maxWidth: '1200px' }}>
                            {authorizedGuilds.map((guild, index) => (
                                <Grid item key={guild.id} xs={12} sm={6} md={4} lg={3}>
                                    <Card 
                                        sx={{ 
                                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                            border: '1px solid rgba(100, 100, 100, 0.3)',
                                            borderRadius: '12px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                            '@keyframes fadeInUp': {
                                                from: { opacity: 0, transform: 'translateY(20px)' },
                                                to: { opacity: 1, transform: 'translateY(0)' }
                                            },
                                            '&:hover': { 
                                                transform: 'translateY(-4px) scale(1.02)',
                                                borderColor: 'rgba(150, 150, 150, 0.5)',
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                                                background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.95) 0%, rgba(50, 50, 50, 0.95) 100%)'
                                            }
                                        }}
                                        onClick={() => router.push(`/dashboard/guilds/${guild.id}`)}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <TextAvatar 
                                                    variant='column' 
                                                    src={guild.iconURL ? `${guild.iconURL}?size=64` : null} 
                                                    alt={guild.name.slice(0, 1)} 
                                                    typography='h6' 
                                                    size='64px'
                                                >
                                                    {guild.name}
                                                </TextAvatar>
                                                <Typography 
                                                    variant='subtitle1' 
                                                    sx={{ 
                                                        marginTop: 1, 
                                                        textAlign: 'center',
                                                        color: 'rgba(220, 220, 220, 0.9)',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {guild.name}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : (
                    <Box sx={{ 
                        textAlign: 'center', 
                        marginTop: 4,
                        animation: 'fadeIn 0.8s ease-out 0.4s both',
                        '@keyframes fadeIn': {
                            from: { opacity: 0 },
                            to: { opacity: 1 }
                        }
                    }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                marginBottom: 2,
                                color: 'rgba(200, 200, 200, 0.9)',
                                fontWeight: 600
                            }}
                        >
                            No servers available
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(180, 180, 180, 0.7)' }}>
                            {guilds.length === 0 
                                ? "You don't have access to any servers with the Guardian bot."
                                : "You need to authorize access to your servers. Check the sidebar for available servers."}
                        </Typography>
                    </Box>
                )}
            </Box>
        </>
    );
}

DashboardPage.auth = true;