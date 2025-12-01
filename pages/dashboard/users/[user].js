import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { Avatar, Divider, Tab, Tabs, Typography, Card, CardContent, Grid, Chip, Box as MuiBox, Button } from '@mui/material';
import { Box } from '@mui/system';
import { TabContext, TabPanel } from '@mui/lab';
import { ArrowBack, Groups, Gavel, SupportAgent, CalendarToday, VerifiedUser, Badge } from '@mui/icons-material';

import styles from '@/styles/User.module.css';
import TextAvatar from '@/components/TextAvatar';
import GuildsView from '@/components/views/GuildsView';
import InfractionsView from '@/components/views/InfractionsView';
import TicketsView from '@/components/views/TicketsView';

export default function UserPage(props) {
    const router = useRouter();

    /** @type {User} */ const user = props.user;
    /** @type {[ Number, Function ]} */ const [ tab, setTab ] = React.useState(router.query.tab || 'servers');
    const [stats, setStats] = React.useState({ guilds: 0, infractions: 0, tickets: 0 });
    
    React.useEffect(() => setTab(router.query.tab || 'servers'), [ router.query.tab ]);
    
    React.useEffect(() => {
        if (!user) return;
        
        async function fetchStats() {
            try {
                const [guildsRes, infractionsRes, ticketsRes] = await Promise.all([
                    fetch(`/api/users/${user.id}/guilds`, { cache: 'no-cache' }).catch(() => ({ ok: false })),
                    fetch(`/api/users/${user.id}/infractions?pagination=1`, { cache: 'no-cache' }).catch(() => ({ ok: false })),
                    fetch(`/api/users/${user.id}/tickets?pagination=1`, { cache: 'no-cache' }).catch(() => ({ ok: false }))
                ]);
                
                const guilds = guildsRes.ok ? await guildsRes.json().then(d => d.guilds?.length || 0).catch(() => 0) : 0;
                const infractions = infractionsRes.ok ? await infractionsRes.json().then(d => d.pagination?.totalPages || 0).catch(() => 0) : 0;
                const tickets = ticketsRes.ok ? await ticketsRes.json().then(d => d.pagination?.totalPages || 0).catch(() => 0) : 0;
                
                setStats({ guilds, infractions, tickets });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        }
        
        fetchStats();
    }, [user]);

    if(!user && typeof window !== 'undefined') router.push('/dashboard');

    // Calculate account age
    const accountCreated = user ? new Date(parseInt(user.id) / 4194304 + 1420070400000) : null;
    const accountAge = accountCreated ? Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Get Discord badges
    const badges = [];
    if (user?.public_flags) {
        const flags = user.public_flags;
        if ((flags >> 0) & 1) badges.push({ name: 'Discord Staff', icon: 'https://discord.id/img/flags/0.png' });
        if ((flags >> 1) & 1) badges.push({ name: 'Discord Partner', icon: 'https://discord.id/img/flags/1.png' });
        if ((flags >> 2) & 1) badges.push({ name: 'Hypesquad Event', icon: 'https://discord.id/img/flags/2.png' });
        if ((flags >> 3) & 1) badges.push({ name: 'Bug Hunter', icon: 'https://discord.id/img/flags/3.png' });
        if ((flags >> 6) & 1) badges.push({ name: 'Hypesquad Bravery', icon: 'https://discord.id/img/flags/6.png' });
        if ((flags >> 7) & 1) badges.push({ name: 'Hypesquad Brilliance', icon: 'https://discord.id/img/flags/7.png' });
        if ((flags >> 8) & 1) badges.push({ name: 'Hypesquad Balance', icon: 'https://discord.id/img/flags/8.png' });
        if ((flags >> 9) & 1) badges.push({ name: 'Early Supporter', icon: 'https://discord.id/img/flags/9.png' });
        if ((flags >> 14) & 1) badges.push({ name: 'Bug Hunter Level 2', icon: 'https://discord.id/img/flags/14.png' });
        if ((flags >> 17) & 1) badges.push({ name: 'Verified Bot Developer', icon: 'https://discord.id/img/flags/17.png' });
        if ((flags >> 18) & 1) badges.push({ name: 'Discord Certified Moderator', icon: 'https://discord.id/img/flags/18.png' });
        if ((flags >> 22) & 1) badges.push({ name: 'Active Developer', icon: 'https://discord.id/img/flags/22.png' });
    }

    return !user ? <></> : (
        <>
            <Head>
                <title>{user.username} - Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ 
                display: 'flex', 
                height: '100%', 
                width: '100%',
                animation: 'fadeIn 0.6s ease-out',
                '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                }
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    flexDirection: 'column', 
                    width: '100%',
                    padding: { xs: 2, sm: 3, md: 4 },
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    {/* Back Button */}
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                            <Button
                                startIcon={<ArrowBack />}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        background: 'rgba(60, 60, 60, 0.3)',
                                    }
                                }}
                            >
                                Back to Dashboard
                            </Button>
                        </Link>
                    </Box>

                    {/* Profile Header Card */}
                    <Card
                        sx={{
                            width: '100%',
                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(100, 100, 100, 0.3)',
                            borderRadius: '20px',
                            mb: 4,
                            overflow: 'hidden',
                            animation: 'fadeInUp 0.6s ease-out',
                            '@keyframes fadeInUp': {
                                from: { opacity: 0, transform: 'translateY(20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: 3 }}>
                                <Avatar
                                    src={`${user.displayAvatarURL}?size=256`}
                                    sx={{
                                        width: { xs: 120, sm: 150, md: 180 },
                                        height: { xs: 120, sm: 150, md: 180 },
                                        fontSize: '4rem',
                                        border: '4px solid rgba(100, 100, 100, 0.3)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                                    }}
                                >
                                    {user.username.slice(0, 1).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
                                            {user.username}
                                        </Typography>
                                        {user.discriminator && user.discriminator !== '0' && (
                                            <Typography variant="h5" sx={{ color: 'rgba(200, 200, 200, 0.7)', fontWeight: 400 }}>
                                                #{user.discriminator}
                                            </Typography>
                                        )}
                                        {user.bot && (
                                            <Chip 
                                                label="Bot" 
                                                size="small" 
                                                sx={{ 
                                                    background: 'rgba(88, 101, 242, 0.2)',
                                                    color: '#5865F2',
                                                    fontWeight: 600
                                                }} 
                                            />
                                        )}
                                        {user.verified && (
                                            <VerifiedUser sx={{ color: '#5865F2', fontSize: '1.5rem' }} />
                                        )}
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.7)', mb: 2 }}>
                                        User ID: {user.id}
                                    </Typography>
                                    {badges.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
                                            {badges.map((badge, index) => (
                                                <Chip
                                                    key={index}
                                                    icon={<img src={badge.icon} alt={badge.name} width={16} height={16} style={{ borderRadius: '50%' }} />}
                                                    label={badge.name}
                                                    size="small"
                                                    sx={{
                                                        background: 'rgba(60, 60, 60, 0.5)',
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        border: '1px solid rgba(100, 100, 100, 0.3)'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    {accountCreated && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(200, 200, 200, 0.8)' }}>
                                            <CalendarToday sx={{ fontSize: '1rem' }} />
                                            <Typography variant="body2">
                                                Account created {accountAge.toLocaleString()} days ago
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Statistics Cards */}
                    <Grid container spacing={2} sx={{ width: '100%', mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(33, 150, 243, 0.3)',
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                                    <Groups sx={{ fontSize: '2.5rem', color: 'rgba(33, 150, 243, 0.9)', mb: 1 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#e0e0e0', mb: 0.5 }}>
                                        {stats.guilds}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
                                        Servers
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(244, 67, 54, 0.3)',
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                                    <Gavel sx={{ fontSize: '2.5rem', color: 'rgba(244, 67, 54, 0.9)', mb: 1 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#e0e0e0', mb: 0.5 }}>
                                        {stats.infractions}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
                                        Infractions
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(33, 150, 243, 0.3)',
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                                    <SupportAgent sx={{ fontSize: '2.5rem', color: 'rgba(33, 150, 243, 0.9)', mb: 1 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#e0e0e0', mb: 0.5 }}>
                                        {stats.tickets}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
                                        Tickets
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ 
                        width: '100%', 
                        mb: 3,
                        borderColor: 'rgba(100, 100, 100, 0.3)',
                        animation: 'fadeIn 0.6s ease-out 0.3s both',
                        '@keyframes fadeIn': {
                            from: { opacity: 0 },
                            to: { opacity: 1 }
                        }
                    }} />

                    <TabContext value={tab}>
                        <Box sx={{ width: '100%', mb: 3 }}>
                            <Tabs 
                                value={tab} 
                                onChange={(_, newTab) => router.push(`${user.id}?tab=${newTab}`, undefined, { shallow: true })}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    width: '100%',
                                    borderBottom: '2px solid rgba(100, 100, 100, 0.2)',
                                    '& .MuiTabs-indicator': {
                                        background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.8) 0%, rgba(76, 175, 80, 0.8) 100%)',
                                        height: 3,
                                        borderRadius: '3px 3px 0 0'
                                    },
                                    '& .MuiTab-root': {
                                        color: 'rgba(200, 200, 200, 0.7)',
                                        fontWeight: 500,
                                        textTransform: 'capitalize',
                                        fontSize: '1rem',
                                        minHeight: 48,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: 'rgba(220, 220, 220, 0.9)',
                                            background: 'rgba(60, 60, 60, 0.2)',
                                        },
                                        '&.Mui-selected': {
                                            color: '#e0e0e0',
                                            fontWeight: 600
                                        }
                                    },
                                    animation: 'fadeIn 0.6s ease-out 0.4s both',
                                    '@keyframes fadeIn': {
                                        from: { opacity: 0 },
                                        to: { opacity: 1 }
                                    }
                                }}
                            >
                                <Tab icon={<Groups />} iconPosition="start" label='Servers' value='servers' />
                                <Tab icon={<Gavel />} iconPosition="start" label='Infractions' value='infractions' />
                                <Tab icon={<SupportAgent />} iconPosition="start" label='Tickets' value='tickets' />
                            </Tabs>
                        </Box>

                        <TabPanel value='servers' className={`${styles.panel} ${tab == 'servers' ? '' : styles.hidden}`}>
                            <GuildsView />
                        </TabPanel>

                        <TabPanel value='infractions' className={`${styles.panel} ${tab == 'infractions' ? '' : styles.hidden}`}>
                            <InfractionsView user={user} />
                        </TabPanel>

                        <TabPanel value='tickets' className={`${styles.panel} ${tab == 'tickets' ? '' : styles.hidden}`}>
                            <TicketsView user={user} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </Box>
        </>
    );
}
UserPage.auth = true;

export async function getServerSideProps(context){
    /** @type {User} */ const user = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${context.params.user}`, { cache: 'no-cache', headers: { 'Cookie': context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => null);

    return { props: { user: user } };
}