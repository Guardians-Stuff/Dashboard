import Head from 'next/head';

import { Box } from '@mui/system';
import { Divider, Typography } from '@mui/material';

import styles from '@/styles/Home.module.css';
import { changes } from '../changes';

export default function Changelog() {
    return(
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box className={styles.background}>
                <Box style={{ padding: '24px 0 0 24px' }}>
                    <Typography variant='h3'>Changelog</Typography>

                    {Object.keys(changes).map(date => (
                        <Box key={date}>
                            <Typography variant='h4' style={{ marginTop: '32px' }}>{date}</Typography>
                            <Divider />

                            <ul>
                                {Object.keys(changes[date]).map((category) => (
                                    <Box key={`${date}-${category}`}>
                                        <Typography variant='h5' style={{ marginTop: 20 }}>{category}</Typography>
                                        {changes[date][category].map((change, index) => (
                                            <li key={`${date}-${category}-${index}`} style={{ marginLeft: 40 }}>{change}</li>
                                        ))}
                                    </Box>
                                ))}
                            </ul>
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
}