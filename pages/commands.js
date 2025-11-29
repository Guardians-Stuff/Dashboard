import Head from 'next/head';
import { useState } from 'react';

import { Box, Collapse, Tab, Tabs, Typography, Card, CardContent } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';

import styles from '@/styles/Home.module.css';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMore } from '@mui/icons-material';

export default function Commands(props) {
    // TODO: Add JSDOC
    const commands = props.commands;
    const categories = [ ...new Set(commands.map(command => command.category)) ];

    const [ activeCategory, setActiveCategory ] = useState('public');
    const [ collapsedCommands, setCollapsedCommands ] = useState(() => {
        const initial = {};
        commands
            .filter(command => command.subcommands && command.subcommands.length != 0)
            .forEach(command => {
                initial[command.name] = false;
            });
        return initial;
    });

    return(
        <>
            <Head>
                <title>Guardian Dashboard - Commands</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box className={styles.background}>
                <Box sx={{ 
                    padding: { xs: '24px 16px', sm: '32px 24px' },
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    <Typography 
                        variant='h3' 
                        sx={{ 
                            mb: 3,
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
                        Commands
                    </Typography>
                    <TabContext value={activeCategory}>
                        <Box sx={{ 
                            borderBottom: 1, 
                            borderColor: 'rgba(100, 100, 100, 0.3)',
                            mb: 3,
                            '& .MuiTabs-indicator': {
                                background: 'linear-gradient(90deg, #a0a0a0 0%, #808080 100%)',
                                height: 3,
                                borderRadius: '3px 3px 0 0'
                            }
                        }}>
                            <Tabs
                                variant='scrollable'
                                allowScrollButtonsMobile
                                value={activeCategory}
                                onChange={(_, newTab) => setActiveCategory(newTab)}
                                sx={{
                                    '& .MuiTab-root': {
                                        color: 'rgba(200, 200, 200, 0.7)',
                                        fontWeight: 500,
                                        textTransform: 'capitalize',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: 'rgba(220, 220, 220, 0.9)',
                                        },
                                        '&.Mui-selected': {
                                            color: '#d0d0d0',
                                            fontWeight: 600
                                        }
                                    }
                                }}
                            >
                                {categories.map(category => (
                                    <Tab
                                        label={category.charAt(0).toUpperCase() + category.slice(1)}
                                        key={category}
                                        value={category}
                                    />
                                ))}
                            </Tabs>
                        </Box>

                        {categories.map(category => (
                            <TabPanel
                                key={`${category}-panel`}
                                value={category}
                                sx={{ p: { xs: 2, sm: 3 } }}
                            >
                                <Box className={styles.commandContainer}>
                                    {commands.filter(command => command.category == category).map((command, index) => (
                                        <Card
                                            key={command.name}
                                            sx={{
                                                mb: 2,
                                                background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(100, 100, 100, 0.3)',
                                                borderRadius: '12px',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                                '@keyframes fadeInUp': {
                                                    from: { opacity: 0, transform: 'translateY(20px)' },
                                                    to: { opacity: 1, transform: 'translateY(0)' }
                                                },
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    borderColor: 'rgba(150, 150, 150, 0.5)',
                                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ position: 'relative', pr: 6 }}>
                                                <Typography 
                                                    variant='h6' 
                                                    sx={{ 
                                                        mb: 1,
                                                        fontWeight: 600,
                                                        color: '#d0d0d0'
                                                    }}
                                                >
                                                    /{command.name}
                                                </Typography>
                                                <Typography 
                                                    variant='body1' 
                                                    sx={{ 
                                                        color: 'rgba(220, 220, 220, 0.9)',
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {command.description}
                                                </Typography>
                                                {command.subcommands && command.subcommands.length != 0 && (
                                                    <>
                                                        {collapsedCommands[command.name] ? (
                                                            <ExpandLessIcon
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '1rem',
                                                                right: '1rem',
                                                                color: 'rgba(200, 200, 200, 0.8)',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    color: '#ffffff',
                                                                    transform: 'scale(1.2)'
                                                                }
                                                            }}
                                                                onClick={() => setCollapsedCommands({ ...collapsedCommands, [command.name]: false })}
                                                            />
                                                        ) : (
                                                            <ExpandMore
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '1rem',
                                                                right: '1rem',
                                                                color: 'rgba(200, 200, 200, 0.8)',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    color: '#ffffff',
                                                                    transform: 'scale(1.2)'
                                                                }
                                                            }}
                                                                onClick={() => setCollapsedCommands({ ...collapsedCommands, [command.name]: true })}
                                                            />
                                                        )}
                                                        <Collapse in={collapsedCommands[command.name]} timeout='auto' unmountOnExit>
                                                            <Box sx={{ mt: 2, pl: 2, borderLeft: '3px solid rgba(102, 126, 234, 0.5)' }}>
                                                                {command.subcommands.map(subcommand => (
                                                                    <Card
                                                                        key={`${command.name}-${subcommand.name}`}
                                                                        sx={{
                                                                            mb: 1.5,
                                                                            background: 'rgba(40, 40, 40, 0.5)',
                                                                            border: '1px solid rgba(100, 100, 100, 0.2)',
                                                                            borderRadius: '8px'
                                                                        }}
                                                                    >
                                                                        <CardContent>
                                                                            <Typography variant='h6' sx={{ fontSize: '1rem', fontWeight: 600, color: '#b0b0b0', mb: 0.5 }}>
                                                                                /{command.name} {subcommand.name}
                                                                            </Typography>
                                                                            <Typography variant='body2' sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                                                                {subcommand.description}
                                                                            </Typography>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                            </Box>
                                                        </Collapse>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </TabPanel>
                        ))}
                    </TabContext>
                </Box>
            </Box>
            {/* <main className={styles.container}>
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
            </main> */}
        </>
    );
}

export async function getServerSideProps(context){
    const commands = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/commands`, { cache: 'no-cache', headers: { 'Cookie': context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => []);

    return { props: { commands: commands } };
}