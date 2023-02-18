import Head from 'next/head';
import { useState } from 'react';

import { Box, Collapse, Tab, Tabs, Typography } from '@mui/material';
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
    const [ collapsedCommands, setCollapsedCommands ] = useState(commands
        .filter(command => command.subcommands.length != 0)
        .map(command => command.name)
        .reduce((object, command) => ({ ...object, [command]: false }), {})
    );

    return(
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box className={styles.background}>
                <Typography variant='h3' style={{ padding: '24px 0 0 24px' }}>Commands</Typography>
                <TabContext value={activeCategory}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', margin: '0 24px 0 24px' }}>
                        <Tabs
                            variant='scrollable'
                            allowScrollButtonsMobile
                            value={activeCategory}
                            onChange={(_, newTab) => setActiveCategory(newTab)}
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
                        >
                            <ul className={styles.commandContainer}>
                                {commands.filter(command => command.category == category).map(command => (
                                    <Box key={command.name}>
                                        <Box className={styles.command}>
                                            <Typography variant='h6'>/{command.name}</Typography>
                                            <Typography variant='h7'>{command.description}</Typography>
                                            {command.subcommands.length != 0 ?
                                                <>
                                                    {collapsedCommands[command.name] ?
                                                        <ExpandLessIcon
                                                            className={styles.commandIcon}
                                                            onClick={() => setCollapsedCommands({ [command.name]: false })}
                                                        />
                                                        :
                                                        <ExpandMore
                                                            className={styles.commandIcon}
                                                            onClick={() => setCollapsedCommands({ [command.name]: true })}
                                                        />
                                                    }
                                                    <Collapse in={collapsedCommands[command.name]} timeout='auto' unmountOnExit>
                                                        {command.subcommands.map(subcommand => (
                                                            <Box key={`${command.name}-${subcommand.name}`}>
                                                                <Box className={styles.command}>
                                                                    <h3>/{command.name} {subcommand.name}</h3>
                                                                    <p>{subcommand.description}</p>
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Collapse>
                                                </>
                                                : ''
                                            }
                                        </Box>
                                    </Box>
                                ))}
                            </ul>
                        </TabPanel>
                    ))}
                </TabContext>
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