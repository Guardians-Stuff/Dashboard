import Head from 'next/head';

import { Box } from '@mui/system';
import { Divider, Typography, Card, CardContent } from '@mui/material';

import styles from '@/styles/Home.module.css';
import { changes } from '../changes';

export default function Changelog() {
    const dates = Object.keys(changes);
    
    return(
        <>
            <Head>
                <title>Guardian Dashboard - Changelog</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box className={styles.background}>
                <Box className={styles.changelogContainer}>
                    <Typography 
                        variant='h3' 
                        sx={{ 
                            mb: 4,
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
                        Changelog
                    </Typography>

                    {dates.map((date, dateIndex) => (
                        <Card
                            key={date}
                            sx={{
                                mb: 4,
                                background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(100, 100, 100, 0.3)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                animation: `fadeInUp 0.6s ease-out ${dateIndex * 0.1}s both`,
                                '@keyframes fadeInUp': {
                                    from: { opacity: 0, transform: 'translateY(30px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' }
                                },
                                '&:hover': {
                                    borderColor: 'rgba(150, 150, 150, 0.5)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                                }
                            }}
                        >
                            <CardContent>
                                <Typography 
                                    variant='h4' 
                                    sx={{ 
                                        mb: 2,
                                        fontWeight: 600,
                                        color: '#d0d0d0',
                                        pb: 1,
                                        borderBottom: '2px solid rgba(100, 100, 100, 0.3)'
                                    }}
                                >
                                    {date}
                                </Typography>

                                {Object.keys(changes[date]).map((category, categoryIndex) => (
                                    <Box 
                                        key={`${date}-${category}`}
                                        sx={{
                                            mb: 3,
                                            animation: `fadeInLeft 0.5s ease-out ${(dateIndex * 0.1) + (categoryIndex * 0.05)}s both`,
                                            '@keyframes fadeInLeft': {
                                                from: { opacity: 0, transform: 'translateX(-20px)' },
                                                to: { opacity: 1, transform: 'translateX(0)' }
                                            }
                                        }}
                                    >
                                        <Typography 
                                            variant='h5' 
                                            sx={{ 
                                                mt: 2,
                                                mb: 1.5,
                                                fontWeight: 600,
                                                color: '#b0b0b0'
                                            }}
                                        >
                                            {category}
                                        </Typography>
                                        <Box component="ul" sx={{ listStyle: 'none', pl: 0, m: 0 }}>
                                            {changes[date][category].map((change, changeIndex) => (
                                                <Card
                                                    key={`${date}-${category}-${changeIndex}`}
                                                    component="li"
                                                    sx={{
                                                        mb: 1,
                                                        background: 'rgba(40, 40, 40, 0.5)',
                                                        border: '1px solid rgba(100, 100, 100, 0.2)',
                                                        borderLeft: '4px solid rgba(120, 120, 120, 0.5)',
                                                        borderRadius: '8px',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            borderLeftColor: '#a0a0a0',
                                                            background: 'rgba(50, 50, 50, 0.7)',
                                                            transform: 'translateX(4px)',
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ py: 1.5, px: 2 }}>
                                                        <Typography 
                                                            variant='body1' 
                                                            sx={{ 
                                                                color: 'rgba(220, 220, 220, 0.9)',
                                                                lineHeight: 1.6,
                                                                '&::before': {
                                                                    content: '"•"',
                                                                    color: '#a0a0a0',
                                                                    fontWeight: 'bold',
                                                                    display: 'inline-block',
                                                                    width: '1em',
                                                                    marginRight: '0.5em'
                                                                }
                                                            }}
                                                        >
                                                            {change}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </>
    );
}