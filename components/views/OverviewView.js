import React from 'react';
import { useRouter } from 'next/router';
import {
    Box, Typography, Card, CardContent, Grid, Avatar,
    LinearProgress, Chip, Paper, Button, IconButton,
    Tooltip, Divider, CircularProgress, Snackbar, Alert
} from '@mui/material';
import {
    Groups, Security, Assessment, TrendingUp,
    Person, Settings, NotificationsActive,
    Speed, Timeline, BarChart, PieChart,
    Refresh, ArrowUpward, ArrowDownward
} from '@mui/icons-material';

export default function OverviewView(props) {
    const { mobile, guild, members } = props;
    const router = useRouter();
    const [ darkMode, setDarkMode ] = React.useState(true);
    const [ snackbar, setSnackbar ] = React.useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [ stats, setStats ] = React.useState({
        totalMembers: 0,
        activeMembers: 0,
        totalInfractions: 0,
        activeTickets: 0,
        securityScore: 85,
        activityLevel: 72
    });
    const [ loading, setLoading ] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            setStats({
                totalMembers: members?.length || 0,
                activeMembers: Math.floor((members?.length || 0) * 0.7),
                totalInfractions: 12,
                activeTickets: 3,
                securityScore: 85,
                activityLevel: 72
            });
            setLoading(false);
        }, 1000);
    }, [ members ]);

    const handleSecurityAction = () => {
        setSnackbar({
            open: true,
            message: 'Opening Security Dashboard...',
            severity: 'info'
        });
        if (guild) {
            router.push(`/dashboard/guilds/${guild.id}`);
        } else {
            router.push('/dashboard');
        }
    };

    const handleSettingsAction = () => {
        setSnackbar({
            open: true,
            message: 'Opening Settings...',
            severity: 'info'
        });
        router.push('/dashboard');
    };

    const handleAlertsAction = () => {
        setSnackbar({
            open: true,
            message: 'Checking for new alerts...',
            severity: 'warning'
        });
        setTimeout(() => {
            setSnackbar({
                open: true,
                message: 'You have 3 new security alerts',
                severity: 'warning'
            });
        }, 1500);
    };

    const handleRefreshAction = () => {
        setSnackbar({
            open: true,
            message: 'Refreshing dashboard data...',
            severity: 'info'
        });
        setLoading(true);
        
        setTimeout(() => {
            setStats({
                totalMembers: members?.length || 0,
                activeMembers: Math.floor((members?.length || 0) * 0.7),
                totalInfractions: Math.floor(Math.random() * 20) + 5,
                activeTickets: Math.floor(Math.random() * 10) + 1,
                securityScore: Math.floor(Math.random() * 20) + 75,
                activityLevel: Math.floor(Math.random() * 30) + 60
            });
            setLoading(false);
            setSnackbar({
                open: true,
                message: 'Dashboard data refreshed successfully!',
                severity: 'success'
            });
        }, 1000);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
        <Card
            sx={{
                background: 'rgba(25, 25, 25, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 20px 40px ${color}30, 0 0 60px ${color}10`,
                    '&::before': {
                        transform: 'translateX(0)'
                    }
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
                    transition: 'left 0.6s ease'
                }
            }}
        >
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        p: 1.5,
                        borderRadius: '12px',
                        background: `${color}15`,
                        border: `1px solid ${color}30`
                    }}>
                        {icon}
                    </Box>
                    {trend && (
                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                            {trend > 0 ? (
                                <ArrowUpward sx={{ color: '#4caf50', fontSize: '1rem' }} />
                            ) : (
                                <ArrowDownward sx={{ color: '#f44336', fontSize: '1rem' }} />
                            )}
                            <Typography variant="body2" sx={{
                                color: trend > 0 ? '#4caf50' : '#f44336',
                                fontWeight: 600,
                                ml: 0.5
                            }}>
                                {Math.abs(trend)}%
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Typography variant="h4" sx={{
                    fontWeight: 800,
                    color: darkMode ? '#ffffff' : '#1a1a2e',
                    mb: 0.5
                }}>
                    {value.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{
                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                    fontWeight: 500
                }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" sx={{
                        color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        mt: 0.5
                    }}>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress size={60} sx={{ color: '#7877c6' }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            animation: 'fadeInUp 0.8s ease-out',
            '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(30px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
            }
        }}>
            {/* Stats Overview */}
            <Typography variant="h4" sx={{
                fontWeight: 700,
                color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                mb: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #7877c6 0%, #ff77c6 50%, #78dbff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                Server Overview
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Members"
                        value={stats.totalMembers}
                        icon={<Groups sx={{ color: '#2196f3', fontSize: '1.5rem' }} />}
                        color="#2196f3"
                        trend={5.2}
                        subtitle="Last 30 days"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Members"
                        value={stats.activeMembers}
                        icon={<Person sx={{ color: '#4caf50', fontSize: '1.5rem' }} />}
                        color="#4caf50"
                        trend={3.8}
                        subtitle="Last 7 days"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Infractions"
                        value={stats.totalInfractions}
                        icon={<Security sx={{ color: '#ff9800', fontSize: '1.5rem' }} />}
                        color="#ff9800"
                        trend={-12.5}
                        subtitle="This month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Tickets"
                        value={stats.activeTickets}
                        icon={<Assessment sx={{ color: '#9c27b0', fontSize: '1.5rem' }} />}
                        color="#9c27b0"
                        trend={8.1}
                        subtitle="Open now"
                    />
                </Grid>
            </Grid>

            {/* Progress Bars */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        background: 'rgba(25, 25, 25, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '20px',
                        p: 3
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.9)',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Security sx={{ color: '#4caf50' }} />
                            Security Score
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
                                    Overall Security
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                    {stats.securityScore}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={stats.securityScore}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        background: 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)',
                                        borderRadius: 5
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label="Low Risk" size="small" sx={{
                                background: 'rgba(76, 175, 80, 0.2)',
                                color: '#4caf50',
                                border: '1px solid rgba(76, 175, 80, 0.3)'
                            }} />
                            <Chip label="Protected" size="small" sx={{
                                background: 'rgba(33, 150, 243, 0.2)',
                                color: '#2196f3',
                                border: '1px solid rgba(33, 150, 243, 0.3)'
                            }} />
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{
                        background: 'rgba(25, 25, 25, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '20px',
                        p: 3
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.9)',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <TrendingUp sx={{ color: '#ff9800' }} />
                            Activity Level
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
                                    Server Activity
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 600 }}>
                                    {stats.activityLevel}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={stats.activityLevel}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        background: 'linear-gradient(90deg, #ff9800 0%, #ffa726 100%)',
                                        borderRadius: 5
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label="Active" size="small" sx={{
                                background: 'rgba(255, 152, 0, 0.2)',
                                color: '#ff9800',
                                border: '1px solid rgba(255, 152, 0, 0.3)'
                            }} />
                            <Chip label="Growing" size="small" sx={{
                                background: 'rgba(156, 39, 176, 0.2)',
                                color: '#9c27b0',
                                border: '1px solid rgba(156, 39, 176, 0.3)'
                            }} />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Card sx={{
                background: 'rgba(25, 25, 25, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                p: 3
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 600,
                    color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                    mb: 2
                }}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Security />}
                            onClick={handleSecurityAction}
                            sx={{
                                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                                borderRadius: '12px',
                                py: 1.5,
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
                                }
                            }}
                        >
                            Security
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Settings />}
                            onClick={handleSettingsAction}
                            sx={{
                                background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                borderRadius: '12px',
                                py: 1.5,
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                                }
                            }}
                        >
                            Settings
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<NotificationsActive />}
                            onClick={handleAlertsAction}
                            sx={{
                                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                                borderRadius: '12px',
                                py: 1.5,
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)'
                                }
                            }}
                        >
                            Alerts
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={handleRefreshAction}
                            sx={{
                                background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                                boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
                                borderRadius: '12px',
                                py: 1.5,
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(156, 39, 176, 0.4)'
                                }
                            }}
                        >
                            Refresh
                        </Button>
                    </Grid>
                </Grid>
            </Card>
            
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ 
                        background: 'rgba(25, 25, 25, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: 'white'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}