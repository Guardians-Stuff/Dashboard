import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    Box, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, Grid, Chip, Tooltip,
    IconButton, Menu, MenuItem, Badge, TextField, InputAdornment,
    Paper, ListItemIcon, ListItemText
} from '@mui/material';
import {
    Groups, CheckCircle, Cancel, Dashboard as DashboardIcon, Person, Settings, Code, Book,
    MoreVert, Search, FilterList, Add, TrendingUp, Security,
    NotificationsActive, Assessment, Analytics, Speed, Star,
    ArrowUpward, ArrowDownward, Refresh, Download, Upload,
    Schedule, Timeline, PieChart, BarChart, ViewModule, ViewList,
    Brightness7, DarkMode
} from '@mui/icons-material';

export default function DashboardPage(props) {
    const router = useRouter();
    /** @type {Array<Guild>} */ const guilds = props.guilds || [];
    /** @type {Boolean} */ const mobile = props.mobile;
    const [ inviteDialog, setInviteDialog ] = React.useState({ open: false, guild: null });
    const [ searchTerm, setSearchTerm ] = React.useState('');
    const [ filterStatus, setFilterStatus ] = React.useState('all');
    const [ viewMode, setViewMode ] = React.useState('grid');
    const [ selectedGuild, setSelectedGuild ] = React.useState(null);
    const [ anchorEl, setAnchorEl ] = React.useState(null);
    const [ darkMode, setDarkMode ] = React.useState(true);

    // Guilds are already filtered server-side to only include owner/admin guilds
    const ADMINISTRATOR_PERMISSION = BigInt(0x8);
    const adminGuilds = guilds.filter(guild => {
        if (guild.owner === true) return true;
        if (guild.permissions) {
            const perms = BigInt(guild.permissions);
            const hasAdminPerm = (perms & ADMINISTRATOR_PERMISSION) === ADMINISTRATOR_PERMISSION;
            return hasAdminPerm;
        }
        return false;
    });

    // Calculate statistics
    const stats = {
        total: adminGuilds.length,
        withBot: adminGuilds.filter(g => g.hasBot && g.authorized).length,
        withoutBot: adminGuilds.filter(g => !g.hasBot || !g.authorized).length,
        owned: adminGuilds.filter(g => g.owner).length
    };

    // Filter guilds based on search and status
    const filteredGuilds = adminGuilds.filter(guild => {
        const matchesSearch = guild.name.toLowerCase().includes(searchTerm.toLowerCase());
        const hasBot = guild.hasBot && guild.authorized;
        
        if (filterStatus === 'all') return matchesSearch;
        if (filterStatus === 'withBot') return matchesSearch && hasBot;
        if (filterStatus === 'withoutBot') return matchesSearch && !hasBot;
        if (filterStatus === 'owned') return matchesSearch && guild.owner;
        return matchesSearch;
    });

    const handleMenuClick = (event, guild) => {
        setAnchorEl(event.currentTarget);
        setSelectedGuild(guild);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedGuild(null);
    };

    return (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
                <style jsx global>{`
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 0.8; }
                        50% { opacity: 1; }
                    }
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateX(-20px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                `}</style>
            </Head>
            
            <Box sx={{
                minHeight: '100vh',
                background: '#0a0a0a',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.05) 0%, transparent 50%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }
            }}>
                {/* Floating Background Elements */}
                <Box sx={{
                    position: 'fixed',
                    top: '10%',
                    left: '5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(120, 119, 198, 0.03) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    animation: 'float 6s ease-in-out infinite',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'fixed',
                    top: '60%',
                    right: '10%',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(255, 119, 198, 0.03) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(30px)',
                    animation: 'float 8s ease-in-out infinite reverse',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <Box sx={{
                    position: 'relative',
                    zIndex: 1,
                    p: { xs: 2, sm: 3, md: 4 },
                    maxWidth: '1600px',
                    margin: '0 auto'
                }}>
                    {/* Header Section */}
                    <Paper
                        elevation={24}
                        sx={{
                            mb: 4,
                            p: 3,
                            background: 'rgba(20, 20, 20, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '24px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(120, 119, 198, 0.05)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, rgba(120, 119, 198, 0.3), transparent)',
                                animation: 'pulse 2s ease-in-out infinite'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #7877c6 0%, #ff77c6 50%, #78dbff 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                                        textShadow: '0 0 30px rgba(120, 119, 198, 0.3)',
                                        animation: 'slideIn 0.8s ease-out'
                                    }}
                                >
                                    Guardian Dashboard
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                        mt: 0.5
                                    }}
                                >
                                    Advanced Server Management & Analytics
                                </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                    onClick={() => setDarkMode(!darkMode)}
                                    sx={{
                                        color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                                        background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            background: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    {darkMode ? <Brightness7 /> : <DarkMode />}
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Statistics Overview */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={6} sm={3}>
                                <Card sx={{
                                    background: 'rgba(25, 25, 25, 0.9)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: '0 20px 40px rgba(33, 150, 243, 0.2), 0 0 60px rgba(33, 150, 243, 0.05)',
                                        border: '1px solid rgba(33, 150, 243, 0.2)',
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
                                        background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.1), transparent)',
                                        transition: 'left 0.6s ease'
                                    }
                                }}>
                                    <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative', zIndex: 1 }}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '16px',
                                            background: 'rgba(33, 150, 243, 0.15)',
                                            mb: 2,
                                            border: '1px solid rgba(33, 150, 243, 0.25)'
                                        }}>
                                            <Groups sx={{ fontSize: '2.5rem', color: 'rgba(33, 150, 243, 0.9)' }} />
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                                            {stats.total.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            Total Servers
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <Card sx={{
                                    background: 'rgba(25, 25, 25, 0.9)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: '0 20px 40px rgba(76, 175, 80, 0.2), 0 0 60px rgba(76, 175, 80, 0.05)',
                                        border: '1px solid rgba(76, 175, 80, 0.2)',
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
                                        background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.1), transparent)',
                                        transition: 'left 0.6s ease'
                                    }
                                }}>
                                    <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative', zIndex: 1 }}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '16px',
                                            background: 'rgba(76, 175, 80, 0.15)',
                                            mb: 2,
                                            border: '1px solid rgba(76, 175, 80, 0.25)'
                                        }}>
                                            <CheckCircle sx={{ fontSize: '2.5rem', color: 'rgba(76, 175, 80, 0.9)' }} />
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                                            {stats.withBot.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            Active Bots
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <Card sx={{
                                    background: 'rgba(25, 25, 25, 0.9)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: '0 20px 40px rgba(244, 67, 54, 0.2), 0 0 60px rgba(244, 67, 54, 0.05)',
                                        border: '1px solid rgba(244, 67, 54, 0.2)',
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
                                        background: 'linear-gradient(90deg, transparent, rgba(244, 67, 54, 0.1), transparent)',
                                        transition: 'left 0.6s ease'
                                    }
                                }}>
                                    <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative', zIndex: 1 }}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '16px',
                                            background: 'rgba(244, 67, 54, 0.15)',
                                            mb: 2,
                                            border: '1px solid rgba(244, 67, 54, 0.25)'
                                        }}>
                                            <Cancel sx={{ fontSize: '2.5rem', color: 'rgba(244, 67, 54, 0.9)' }} />
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                                            {stats.withoutBot.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            Need Setup
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <Card sx={{
                                    background: 'rgba(25, 25, 25, 0.9)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: '0 20px 40px rgba(255, 152, 0, 0.2), 0 0 60px rgba(255, 152, 0, 0.05)',
                                        border: '1px solid rgba(255, 152, 0, 0.2)',
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
                                        background: 'linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.1), transparent)',
                                        transition: 'left 0.6s ease'
                                    }
                                }}>
                                    <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative', zIndex: 1 }}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '16px',
                                            background: 'rgba(255, 152, 0, 0.15)',
                                            mb: 2,
                                            border: '1px solid rgba(255, 152, 0, 0.25)'
                                        }}>
                                            <DashboardIcon sx={{ fontSize: '2.5rem', color: 'rgba(255, 152, 0, 0.9)' }} />
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                                            {stats.owned.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            Owned
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Search and Filter Bar */}
                        <Paper sx={{
                            mb: 4,
                            p: 2,
                            background: 'rgba(20, 20, 20, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <TextField
                                fullWidth
                                placeholder="Search servers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        color: '#ffffff',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(255, 255, 255, 0.2)'
                                        }
                                    }
                                }}
                                sx={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.2)'
                                    }
                                }}
                            />

                            <Chip
                                icon={<FilterList />}
                                label="All"
                                onClick={() => setFilterStatus('all')}
                                color={filterStatus === 'all' ? 'primary' : 'default'}
                                sx={{
                                    background: filterStatus === 'all'
                                        ? 'linear-gradient(135deg, #7877c6 0%, #ff77c6 100%)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                    color: filterStatus === 'all' ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 12px rgba(120, 119, 198, 0.3)'
                                    }
                                }}
                            />
                            <Chip
                                icon={<CheckCircle />}
                                label="With Bot"
                                onClick={() => setFilterStatus('withBot')}
                                color={filterStatus === 'withBot' ? 'success' : 'default'}
                                sx={{
                                    background: filterStatus === 'withBot'
                                        ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                    color: filterStatus === 'withBot' ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                                    }
                                }}
                            />
                            <Chip
                                icon={<Cancel />}
                                label="Without Bot"
                                onClick={() => setFilterStatus('withoutBot')}
                                color={filterStatus === 'withoutBot' ? 'error' : 'default'}
                                sx={{
                                    background: filterStatus === 'withoutBot'
                                        ? 'linear-gradient(135deg, #f44336 0%, #e57373 100%)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                    color: filterStatus === 'withoutBot' ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                                    }
                                }}
                            />
                            <Chip
                                icon={<Star />}
                                label="Owned"
                                onClick={() => setFilterStatus('owned')}
                                color={filterStatus === 'owned' ? 'warning' : 'default'}
                                sx={{
                                    background: filterStatus === 'owned'
                                        ? 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                    color: filterStatus === 'owned' ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                                    }
                                }}
                            />

                            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                                <IconButton
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                    sx={{
                                        color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                                        background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            background: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
                                </IconButton>
                            </Box>
                        </Paper>

                        {/* Quick Actions */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                startIcon={<Code />}
                                href="/commands"
                                sx={{
                                    background: 'linear-gradient(135deg, #7877c6 0%, #ff77c6 100%)',
                                    boxShadow: '0 4px 15px rgba(120, 119, 198, 0.3)',
                                    borderRadius: '12px',
                                    px: 3,
                                    py: 1.5,
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #ff77c6 0%, #7877c6 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(120, 119, 198, 0.4)'
                                    }
                                }}
                            >
                                Commands
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Book />}
                                href="/documentation"
                                sx={{
                                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                                    borderRadius: '12px',
                                    px: 3,
                                    py: 1.5,
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
                                    }
                                }}
                            >
                                Documentation
                            </Button>
                            {props.session && (
                                <Button
                                    variant="contained"
                                    startIcon={<Person />}
                                    href={`/dashboard/users/${props.session.id}`}
                                    sx={{
                                        background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                                        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                        borderRadius: '12px',
                                        px: 3,
                                        py: 1.5,
                                        fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                                        }
                                    }}
                                >
                                    My Profile
                                </Button>
                            )}
                        </Box>

                        {/* Server Grid/List */}
                        {filteredGuilds.length > 0 ? (
                            <>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 3,
                                        fontWeight: 700,
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        textAlign: 'center',
                                        fontSize: '1.5rem'
                                    }}
                                >
                                    Your Servers
                                </Typography>
                                
                                <Grid container spacing={3}>
                                    {filteredGuilds.map((guild, index) => {
                                        const hasBot = guild.hasBot && guild.authorized;
                                        return (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={guild.id}>
                                                <Card
                                                    onClick={() => {
                                                        if (hasBot) {
                                                            router.push(`/dashboard/guilds/${guild.id}`);
                                                        } else {
                                                            setInviteDialog({ open: true, guild: guild });
                                                        }
                                                    }}
                                                    sx={{
                                                        position: 'relative',
                                                        background: 'rgba(25, 25, 25, 0.9)',
                                                        backdropFilter: 'blur(20px)',
                                                        border: hasBot
                                                            ? '2px solid rgba(76, 175, 80, 0.5)'
                                                            : '2px solid rgba(120, 120, 120, 0.5)',
                                                        borderRadius: '20px',
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        animation: `slideIn 0.5s ease-out ${index * 0.05}s both`,
                                                        '&:hover': {
                                                            transform: 'translateY(-12px) scale(1.03)',
                                                            boxShadow: hasBot
                                                                ? '0 20px 40px rgba(76, 175, 80, 0.3), 0 0 60px rgba(76, 175, 80, 0.1)'
                                                                : '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 60px rgba(120, 119, 198, 0.1)',
                                                            borderColor: hasBot
                                                                ? '2px solid rgba(76, 175, 80, 0.8)'
                                                                : '2px solid rgba(150, 150, 150, 0.8)',
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
                                                            background: hasBot
                                                                ? 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.2), transparent)'
                                                                : 'linear-gradient(90deg, transparent, rgba(120, 120, 120, 0.2), transparent)',
                                                            transition: 'left 0.6s ease'
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ position: 'relative', width: '100%', pt: '100%' }}>
                                                        <Avatar
                                                            src={guild.iconURL ? `${guild.iconURL}?size=256` : null}
                                                            alt={guild.name}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                fontSize: '3rem',
                                                                bgcolor: 'rgba(50, 50, 60, 0.8)',
                                                                border: `3px solid ${hasBot ? 'rgba(76, 175, 80, 0.6)' : 'rgba(120, 120, 120, 0.6)'}`
                                                            }}
                                                        >
                                                            {guild.name.slice(0, 1).toUpperCase()}
                                                        </Avatar>
                                                        {hasBot && (
                                                            <Badge
                                                                badgeContent={<CheckCircle sx={{ fontSize: '14px', color: '#fff' }} />}
                                                                color="success"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 8,
                                                                    right: 8,
                                                                    '& .MuiBadge-badge': {
                                                                        background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                                                                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 700,
                                                                color: '#ffffff',
                                                                mb: 1,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {guild.name}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 1 }}>
                                                            {guild.owner && (
                                                                <Chip
                                                                    label="Owner"
                                                                    size="small"
                                                                    sx={{
                                                                        background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
                                                                        color: '#ffffff',
                                                                        fontSize: '0.7rem',
                                                                        height: '20px',
                                                                        fontWeight: 600
                                                                    }}
                                                                />
                                                            )}
                                                            <Chip
                                                                label={hasBot ? 'Bot Active' : 'No Bot'}
                                                                size="small"
                                                                sx={{
                                                                    background: hasBot
                                                                        ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
                                                                        : 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
                                                                    color: '#ffffff',
                                                                    fontSize: '0.7rem',
                                                                    height: '20px',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                                                                {hasBot ? 'Click to manage' : 'Click to setup'}
                                                            </Typography>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMenuClick(e, guild);
                                                                }}
                                                                sx={{
                                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                                    '&:hover': {
                                                                        background: 'rgba(255, 255, 255, 0.1)'
                                                                    }
                                                                }}
                                                            >
                                                                <MoreVert />
                                                            </IconButton>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </>
                        ) : (
                            <Paper sx={{
                                textAlign: 'center',
                                p: 6,
                                background: 'rgba(20, 20, 20, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '20px'
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontWeight: 600
                                    }}
                                >
                                    {guilds.length === 0 ? 'No servers available' : 'No accessible servers'}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
                                    {guilds.length === 0
                                        ? 'You don\'t have access to any servers.'
                                        : 'You don\'t own or administrate any servers with required permissions.'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    href="https://discord.com/oauth2/authorize?client_id=1469385720270426358&scope=bot&permissions=8"
                                    target="_blank"
                                    sx={{
                                        background: 'linear-gradient(135deg, #7877c6 0%, #ff77c6 100%)',
                                        boxShadow: '0 4px 15px rgba(120, 119, 198, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #ff77c6 0%, #7877c6 100%)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    Invite Guardian to Server
                                </Button>
                            </Paper>
                        )}
                    </Paper>

                    {/* Invite Dialog */}
                    <Dialog
                        open={inviteDialog.open}
                        onClose={() => setInviteDialog({ open: false, guild: null })}
                        PaperProps={{
                            sx: {
                                background: 'rgba(20, 20, 20, 0.98)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '20px',
                                color: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(120, 119, 198, 0.05)'
                            }
                        }}
                    >
                        <DialogTitle sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                            Invite Guardian Bot
                        </DialogTitle>
                        <DialogContent>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                                {inviteDialog.guild && `The Guardian bot is not in "${inviteDialog.guild.name}". Click the button below to invite it!`}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setInviteDialog({ open: false, guild: null })}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (inviteDialog.guild) {
                                        const botClientId = '1469385720270426358';
                                        window.open(
                                            `https://discord.com/api/oauth2/authorize?client_id=${botClientId}&permissions=8&scope=bot&guild_id=${inviteDialog.guild.id}`,
                                            '_blank'
                                        );
                                    }
                                }}
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(135deg, #7877c6 0%, #ff77c6 100%)',
                                    boxShadow: '0 4px 15px rgba(120, 119, 198, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #ff77c6 0%, #7877c6 100%)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Invite Bot
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Context Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                background: 'rgba(20, 20, 20, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                            }
                        }}
                    >
                        <MenuItem onClick={() => {
                            if (selectedGuild) {
                                router.push(`/dashboard/guilds/${selectedGuild.id}`);
                            }
                            handleMenuClose();
                        }}>
                            <ListItemIcon><Settings /></ListItemIcon>
                            <ListItemText>Manage Server</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            if (selectedGuild) {
                                setInviteDialog({ open: true, guild: selectedGuild });
                            }
                            handleMenuClose();
                        }}>
                            <ListItemIcon><Add /></ListItemIcon>
                            <ListItemText>Reinvite Bot</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
        </>
    );
}

DashboardPage.auth = true;