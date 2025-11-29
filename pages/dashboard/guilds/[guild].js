import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { Avatar, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TabContext, TabPanel } from '@mui/lab';

import styles from '@/styles/Guild.module.css';
import TextAvatar from '@/components/TextAvatar';
import TicketsView from '@/components/views/TicketsView';
import InfractionsView from '@/components/views/InfractionsView';

export default function GuildPage(props) {
    const router = useRouter();

    /** @type {Boolean} */ const mobile = props.mobile;
    /** @type {Guild} */ const guild = props.guild;
    /** @type {Array<GuildMember>} */ const members = props.members;
    
    /** @type {[ Number, Function ]} */ const [ tab, setTab ] = React.useState(router.query.tab || 'overview');
    React.useEffect(() => setTab(router.query.tab || 'overview'), [ router.query.tab ]);

    if(!guild && typeof window !== 'undefined') router.push('/dashboard');

    return !guild ? <></> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ 
                display: 'flex', 
                width: '100%', 
                height: '100%',
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
                    flexGrow: 1,
                    padding: 2
                }}>
                    <Box sx={{
                        animation: 'fadeInUp 0.6s ease-out',
                        '@keyframes fadeInUp': {
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}>
                        <TextAvatar variant='column' src={`${guild.iconURL}?size=128`} alt={guild.name.slice(0, 1)} typography='h3'>{guild.name}</TextAvatar>
                    </Box>

                    <Divider sx={{ 
                        width: '100%', 
                        marginTop: '20px', 
                        marginBottom: '20px',
                        borderColor: 'rgba(100, 100, 100, 0.3)',
                        animation: 'fadeIn 0.6s ease-out 0.2s both',
                        '@keyframes fadeIn': {
                            from: { opacity: 0 },
                            to: { opacity: 1 }
                        }
                    }}></Divider>

                    <TabContext value={tab}>
                        <Tabs 
                            value={tab} 
                            onChange={(_, newTab) => router.push(`${guild.id}?tab=${newTab}`, undefined, { shallow: true })}
                            sx={{
                                width: '100%',
                                mb: 2,
                                '& .MuiTabs-indicator': {
                                    background: 'linear-gradient(90deg, #a0a0a0 0%, #808080 100%)',
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                },
                                '& .MuiTab-root': {
                                    color: 'rgba(200, 200, 200, 0.7)',
                                    fontWeight: 500,
                                    textTransform: 'capitalize',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: 'rgba(220, 220, 220, 0.9)',
                                    },
                                    '&.Mui-selected': {
                                        color: '#d0d0d0',
                                        fontWeight: 600
                                    }
                                },
                                animation: 'fadeIn 0.6s ease-out 0.3s both',
                                '@keyframes fadeIn': {
                                    from: { opacity: 0 },
                                    to: { opacity: 1 }
                                }
                            }}
                        >
                            <Tab label='Overview' value='overview' />
                            <Tab label='Infractions' value='infractions' />
                            <Tab label='Tickets' value='tickets' />
                        </Tabs>

                        <TabPanel value='overview' className={`${styles.panel} ${tab == 'overview' ? '' : styles.hidden}`}>
                            TEST 1
                        </TabPanel>

                        <TabPanel value='infractions' className={`${styles.panel} ${tab == 'infractions' ? '' : styles.hidden}`}>
                            <InfractionsView mobile={mobile} guild={guild} members={members} />
                        </TabPanel>

                        <TabPanel value='tickets' className={`${styles.panel} ${tab == 'tickets' ? '' : styles.hidden}`}>
                            <TicketsView mobile={mobile} guild={guild} members={members} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </Box>
        </>
    );
}

export async function getServerSideProps(context){
    const guild = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${context.params.guild}`, { cache: 'no-cache', headers: { Cookie: context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => null);

    const members = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${guild.id}/members`, { cache: 'no-cache', headers: { Cookie: context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => []);

    return { props: { guild: guild, members: members } };
}