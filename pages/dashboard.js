import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

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
                padding: 3,
                animation: 'fadeInUp 0.8s ease-out',
                '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                }
            }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        marginBottom: 3,
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
                    Welcome to Guardian Dashboard
                </Typography>
                
                {adminGuilds.length > 0 ? (
                    <>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                marginBottom: 3, 
                                alignSelf: 'flex-start',
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
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 3, 
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: '1400px'
                        }}>
                            {adminGuilds.map((guild, index) => {
                                const hasBot = guild.hasBot && guild.authorized;
                                return (
                                    <Box
                                        key={guild.id}
                                        onClick={() => {
                                            if (hasBot) {
                                                router.push(`/dashboard/guilds/${guild.id}`);
                                            } else {
                                                setInviteDialog({ open: true, guild: guild });
                                            }
                                        }}
                                        sx={{
                                            position: 'relative',
                                            width: { xs: '80px', sm: '100px', md: '120px' },
                                            height: { xs: '80px', sm: '100px', md: '120px' },
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                            '@keyframes fadeInUp': {
                                                from: { opacity: 0, transform: 'translateY(20px) scale(0.8)' },
                                                to: { opacity: 1, transform: 'translateY(0) scale(1)' }
                                            },
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                                                zIndex: 1
                                            }
                                        }}
                                    >
                                        <Avatar
                                            src={guild.iconURL ? `${guild.iconURL}?size=256` : null}
                                            alt={guild.name}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                                bgcolor: 'rgba(50, 50, 50, 0.8)'
                                            }}
                                        >
                                            {guild.name.slice(0, 1).toUpperCase()}
                                        </Avatar>
                                        {/* Green tint overlay for guilds with bot */}
                                        {hasBot && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.35) 0%, rgba(56, 142, 60, 0.35) 100%)',
                                                    borderRadius: '50%',
                                                    border: '3px solid rgba(76, 175, 80, 0.7)',
                                                    boxSizing: 'border-box',
                                                    transition: 'all 0.3s ease',
                                                    pointerEvents: 'none',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.45) 0%, rgba(56, 142, 60, 0.45) 100%)',
                                                        borderColor: 'rgba(76, 175, 80, 0.9)'
                                                    }
                                                }}
                                            />
                                        )}
                                        {/* Grey tint overlay for guilds without bot */}
                                        {!hasBot && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'linear-gradient(135deg, rgba(120, 120, 120, 0.4) 0%, rgba(100, 100, 100, 0.4) 100%)',
                                                    borderRadius: '50%',
                                                    border: '3px solid rgba(120, 120, 120, 0.6)',
                                                    boxSizing: 'border-box',
                                                    transition: 'all 0.3s ease',
                                                    pointerEvents: 'none',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, rgba(120, 120, 120, 0.5) 0%, rgba(100, 100, 100, 0.5) 100%)',
                                                        borderColor: 'rgba(120, 120, 120, 0.8)'
                                                    }
                                                }}
                                            />
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
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