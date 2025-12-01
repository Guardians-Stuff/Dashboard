import Head from 'next/head';

import { Box, Chip } from '@mui/system';
import { Typography, Card, CardContent, IconButton } from '@mui/material';
import { CalendarToday, Category, CheckCircle, ArrowRight } from '@mui/icons-material';

import styles from '@/styles/Home.module.css';
import { changes } from '../changes';

// Helper function to get category color
const getCategoryColor = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('fix') || categoryLower.includes('bug')) {
        return { bg: 'rgba(244, 67, 54, 0.15)', border: 'rgba(244, 67, 54, 0.4)', text: '#f44336' };
    }
    if (categoryLower.includes('feature') || categoryLower.includes('add')) {
        return { bg: 'rgba(76, 175, 80, 0.15)', border: 'rgba(76, 175, 80, 0.4)', text: '#4caf50' };
    }
    if (categoryLower.includes('update') || categoryLower.includes('improve')) {
        return { bg: 'rgba(33, 150, 243, 0.15)', border: 'rgba(33, 150, 243, 0.4)', text: '#2196f3' };
    }
    if (categoryLower.includes('revamp') || categoryLower.includes('redesign')) {
        return { bg: 'rgba(156, 39, 176, 0.15)', border: 'rgba(156, 39, 176, 0.4)', text: '#9c27b0' };
    }
    return { bg: 'rgba(255, 152, 0, 0.15)', border: 'rgba(255, 152, 0, 0.4)', text: '#ff9800' };
};

export default function Changelog() {
    const dates = Object.keys(changes).reverse(); // Show newest first
    
    return(
        <>
            <Head>
                <title>Guardian Dashboard - Changelog</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box className={styles.background}>
                <Box className={styles.changelogContainer}>
                    <Box sx={{ 
                        mb: 5, 
                        textAlign: 'center',
                        animation: 'fadeInDown 0.6s ease-out',
                        '@keyframes fadeInDown': {
                            from: { opacity: 0, transform: 'translateY(-20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}>
                        <Typography 
                            variant='h2' 
                            sx={{ 
                                mb: 1,
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 50%, #808080 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Changelog
                        </Typography>
                        <Typography 
                            variant='body1' 
                            sx={{ 
                                color: 'rgba(200, 200, 200, 0.7)',
                                fontSize: '1rem',
                                mt: 1
                            }}
                        >
                            Track all updates and improvements
                        </Typography>
                    </Box>

                    {dates.map((date, dateIndex) => (
                        <Card
                            key={date}
                            sx={{
                                mb: 4,
                                background: 'linear-gradient(135deg, rgba(25, 25, 25, 0.95) 0%, rgba(35, 35, 35, 0.95) 100%)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(120, 120, 120, 0.2)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                position: 'relative',
                                animation: `fadeInUp 0.6s ease-out ${dateIndex * 0.1}s both`,
                                '@keyframes fadeInUp': {
                                    from: { opacity: 0, transform: 'translateY(30px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' }
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, rgba(100, 100, 100, 0.5) 0%, rgba(150, 150, 150, 0.5) 50%, rgba(100, 100, 100, 0.5) 100%)',
                                },
                                '&:hover': {
                                    borderColor: 'rgba(150, 150, 150, 0.4)',
                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 3,
                                    pb: 2,
                                    borderBottom: '2px solid rgba(100, 100, 100, 0.2)'
                                }}>
                                    <CalendarToday sx={{ 
                                        color: 'rgba(200, 200, 200, 0.8)', 
                                        mr: 1.5,
                                        fontSize: '1.5rem'
                                    }} />
                                    <Typography 
                                        variant='h4' 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: '#e0e0e0',
                                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                            letterSpacing: '-0.01em'
                                        }}
                                    >
                                        {date}
                                    </Typography>
                                </Box>

                                {Object.keys(changes[date]).map((category, categoryIndex) => {
                                    const categoryColors = getCategoryColor(category);
                                    return (
                                        <Box 
                                            key={`${date}-${category}`}
                                            sx={{
                                                mb: 4,
                                                animation: `fadeInLeft 0.5s ease-out ${(dateIndex * 0.1) + (categoryIndex * 0.05)}s both`,
                                                '@keyframes fadeInLeft': {
                                                    from: { opacity: 0, transform: 'translateX(-20px)' },
                                                    to: { opacity: 1, transform: 'translateX(0)' }
                                                }
                                            }}
                                        >
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                mb: 2,
                                                gap: 1.5
                                            }}>
                                                <Category sx={{ 
                                                    color: categoryColors.text,
                                                    fontSize: '1.25rem'
                                                }} />
                                                <Typography 
                                                    variant='h5' 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        color: categoryColors.text,
                                                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                                        flex: 1
                                                    }}
                                                >
                                                    {category}
                                                </Typography>
                                            </Box>
                                            <Box component="ul" sx={{ listStyle: 'none', pl: 0, m: 0 }}>
                                                {changes[date][category].map((change, changeIndex) => (
                                                    <Card
                                                        key={`${date}-${category}-${changeIndex}`}
                                                        component="li"
                                                        sx={{
                                                            mb: 1.5,
                                                            background: `linear-gradient(135deg, ${categoryColors.bg} 0%, rgba(40, 40, 40, 0.3) 100%)`,
                                                            border: `1px solid ${categoryColors.border}`,
                                                            borderLeft: `4px solid ${categoryColors.border}`,
                                                            borderRadius: '12px',
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            position: 'relative',
                                                            overflow: 'hidden',
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: 0,
                                                                bottom: 0,
                                                                width: '4px',
                                                                background: categoryColors.border,
                                                                transform: 'scaleY(0)',
                                                                transformOrigin: 'bottom',
                                                                transition: 'transform 0.3s ease',
                                                            },
                                                            '&:hover': {
                                                                borderLeftColor: categoryColors.text,
                                                                background: `linear-gradient(135deg, ${categoryColors.bg.replace('0.15', '0.25')} 0%, rgba(50, 50, 50, 0.5) 100%)`,
                                                                transform: 'translateX(6px)',
                                                                boxShadow: `0 4px 12px ${categoryColors.border}40`,
                                                                '&::before': {
                                                                    transform: 'scaleY(1)',
                                                                },
                                                                '& .change-icon': {
                                                                    opacity: 1,
                                                                    transform: 'translateX(0)',
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <CardContent sx={{ 
                                                            py: 2, 
                                                            px: 2.5,
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            gap: 1.5
                                                        }}>
                                                            <CheckCircle sx={{ 
                                                                color: categoryColors.text,
                                                                fontSize: '1.1rem',
                                                                mt: 0.25,
                                                                flexShrink: 0
                                                            }} />
                                                            <Typography 
                                                                variant='body1' 
                                                                sx={{ 
                                                                    color: 'rgba(240, 240, 240, 0.95)',
                                                                    lineHeight: 1.7,
                                                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                                                    flex: 1
                                                                }}
                                                            >
                                                                {change}
                                                            </Typography>
                                                            <ArrowRight 
                                                                className="change-icon"
                                                                sx={{ 
                                                                    color: categoryColors.text,
                                                                    fontSize: '1rem',
                                                                    opacity: 0,
                                                                    transform: 'translateX(-8px)',
                                                                    transition: 'all 0.3s ease',
                                                                    flexShrink: 0,
                                                                    mt: 0.25
                                                                }} 
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </>
    );
}