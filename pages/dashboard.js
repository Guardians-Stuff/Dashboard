import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, Grid, Chip, Tooltip } from '@mui/material';
import { Groups, CheckCircle, Cancel, Dashboard as DashboardIcon, Person, Settings, Code, Book } from '@mui/icons-material';

export default function DashboardPage(props) {
    const router = useRouter();
    /** @type {Array<Guild>} */ const guilds = props.guilds || [];
    /** @type {Boolean} */ const mobile = props.mobile;
    const [inviteDialog, setInviteDialog] = React.useState({ open: false, guild: null });

    // Guilds are already filtered server-side to only include owner/admin guilds
    // But we'll keep this as a safety check
    const ADMINISTRATOR_PERMISSION = BigInt(0x8);
    const adminGuilds = guilds.filter(guild => {
        // Check if user is owner
        if (guild.owner === true) return true;
        
        // Check if user has ADMINISTRATOR permission
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
                padding: { xs: 2, sm: 3, md: 4 },
                width: '100%',
                maxWidth: '1400px',
                margin: '0 auto',
                animation: 'fadeInUp 0.8s ease-out',
                '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                }
            }}>
                {/* Header Section */}
                <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            marginBottom: 1,
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 50%, #808080 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                            animation: 'fadeInDown 0.6s ease-out',
                            '@keyframes fadeInDown': {
                                from: { opacity: 0, transform: 'translateY(-20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}
                    >
                        Guardian Dashboard
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: 'rgba(200, 200, 200, 0.8)',
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                    >
                        Manage your servers and configure Guardian settings
                    </Typography>
                </Box>

                {/* Statistics Cards */}
                {adminGuilds.length > 0 && (
                    <Grid container spacing={2} sx={{ width: '100%', mb: 4 }}>
                        <Grid item xs={6} sm={3}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <Groups sx={{ fontSize: '2rem', color: 'rgba(33, 150, 243, 0.9)', mb: 0.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
                                        {stats.total}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(200, 200, 200, 0.7)', textTransform: 'uppercase' }}>
                                        Total Servers
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <CheckCircle sx={{ fontSize: '2rem', color: 'rgba(76, 175, 80, 0.9)', mb: 0.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
                                        {stats.withBot}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(200, 200, 200, 0.7)', textTransform: 'uppercase' }}>
                                        With Bot
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
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
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <Cancel sx={{ fontSize: '2rem', color: 'rgba(244, 67, 54, 0.9)', mb: 0.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
                                        {stats.withoutBot}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(200, 200, 200, 0.7)', textTransform: 'uppercase' }}>
                                        Without Bot
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(255, 152, 0, 0.3)',
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <DashboardIcon sx={{ fontSize: '2rem', color: 'rgba(255, 152, 0, 0.9)', mb: 0.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
                                        {stats.owned}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(200, 200, 200, 0.7)', textTransform: 'uppercase' }}>
                                        Owned
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* Quick Actions */}
                <Box sx={{ width: '100%', mb: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/commands" style={{ textDecoration: 'none' }}>
                        <Chip
                            icon={<Code />}
                            label="View Commands"
                            clickable
                            sx={{
                                background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                border: '1px solid rgba(100, 100, 100, 0.3)',
                                color: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                }
                            }}
                        />
                    </Link>
                    <Link href="/documentation" style={{ textDecoration: 'none' }}>
                        <Chip
                            icon={<Book />}
                            label="Documentation"
                            clickable
                            sx={{
                                background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                border: '1px solid rgba(100, 100, 100, 0.3)',
                                color: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                }
                            }}
                        />
                    </Link>
                    {props.session && (
                        <Link href={`/dashboard/users/${props.session.id}`} style={{ textDecoration: 'none' }}>
                            <Chip
                                icon={<Person />}
                                label="My Profile"
                                clickable
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                    }
                                }}
                            />
                        </Link>
                    )}
                </Box>
                
                {adminGuilds.length > 0 ? (
                    <>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                marginBottom: 3, 
                                width: '100%',
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
                        <Grid container spacing={3} sx={{ width: '100%' }}>
                            {adminGuilds.map((guild, index) => {
                                const hasBot = guild.hasBot && guild.authorized;
                                return (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={guild.id}>
                                        <Tooltip title={hasBot ? `Click to manage ${guild.name}` : `Click to invite bot to ${guild.name}`} arrow>
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
                                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: hasBot ? '2px solid rgba(76, 175, 80, 0.5)' : '2px solid rgba(120, 120, 120, 0.5)',
                                                    borderRadius: '20px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                                                    '@keyframes fadeInUp': {
                                                        from: { opacity: 0, transform: 'translateY(20px)' },
                                                        to: { opacity: 1, transform: 'translateY(0)' }
                                                    },
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: hasBot 
                                                            ? '0 12px 32px rgba(76, 175, 80, 0.4)' 
                                                            : '0 12px 32px rgba(0, 0, 0, 0.6)',
                                                        borderColor: hasBot ? 'rgba(76, 175, 80, 0.8)' : 'rgba(150, 150, 150, 0.8)',
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
                                                            bgcolor: 'rgba(50, 50, 50, 0.8)'
                                                        }}
                                                    >
                                                        {guild.name.slice(0, 1).toUpperCase()}
                                                    </Avatar>
                                                    {hasBot && (
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 8,
                                                                right: 8,
                                                                background: 'rgba(76, 175, 80, 0.9)',
                                                                borderRadius: '50%',
                                                                width: 24,
                                                                height: 24,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                                                            }}
                                                        >
                                                            <CheckCircle sx={{ fontSize: '16px', color: '#fff' }} />
                                                        </Box>
                                                    )}
                                                </Box>
                                                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            color: '#e0e0e0',
                                                            mb: 0.5,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {guild.name}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                                                        {guild.owner && (
                                                            <Chip 
                                                                label="Owner" 
                                                                size="small" 
                                                                sx={{ 
                                                                    background: 'rgba(255, 152, 0, 0.2)',
                                                                    color: '#ff9800',
                                                                    fontSize: '0.7rem',
                                                                    height: '20px'
                                                                }} 
                                                            />
                                                        )}
                                                        <Chip 
                                                            label={hasBot ? "Bot Active" : "No Bot"} 
                                                            size="small" 
                                                            sx={{ 
                                                                background: hasBot ? 'rgba(76, 175, 80, 0.2)' : 'rgba(120, 120, 120, 0.2)',
                                                                color: hasBot ? '#4caf50' : '#9e9e9e',
                                                                fontSize: '0.7rem',
                                                                height: '20px'
                                                            }} 
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Tooltip>
                                    </Grid>
                                );
                            })}
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
                                ? "You don't have access to any servers."
                                : "You don't own or administrate any servers."}
                        </Typography>
                    </Box>
                )}

                {/* Invite Dialog */}
                <Dialog
                    open={inviteDialog.open}
                    onClose={() => setInviteDialog({ open: false, guild: null })}
                    PaperProps={{
                        sx: {
                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(40, 40, 40, 0.98) 100%)',
                            border: '1px solid rgba(100, 100, 100, 0.3)',
                            borderRadius: '16px',
                            color: 'rgba(255, 255, 255, 0.9)'
                        }
                    }}
                >
                    <DialogTitle sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                        Invite Guardian Bot
                    </DialogTitle>
                    <DialogContent>
                        <Typography sx={{ color: 'rgba(220, 220, 220, 0.9)', mb: 2 }}>
                            {inviteDialog.guild && `The Guardian bot is not in "${inviteDialog.guild.name}". Click the button below to invite it!`}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setInviteDialog({ open: false, guild: null })}
                            sx={{
                                color: 'rgba(200, 200, 200, 0.9)',
                                '&:hover': {
                                    background: 'rgba(60, 60, 60, 0.3)'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (inviteDialog.guild) {
                                    const botClientId = '1422311269658005635';
                                    window.open(
                                        `https://discord.com/api/oauth2/authorize?client_id=${botClientId}&permissions=8&scope=bot&guild_id=${inviteDialog.guild.id}`,
                                        '_blank'
                                    );
                                }
                                setInviteDialog({ open: false, guild: null });
                            }}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)',
                                border: '1px solid rgba(100, 100, 100, 0.3)',
                                color: '#e0e0e0',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%)',
                                    borderColor: 'rgba(150, 150, 150, 0.5)'
                                }
                            }}
                        >
                            Invite Bot
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}

DashboardPage.auth = true;