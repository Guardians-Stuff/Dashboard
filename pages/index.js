import Head from 'next/head';
import Link from 'next/link';

import { Button, Typography, Box as MuiBox, Card, CardContent, Grid, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Box } from '@mui/system';
import {
    Security,
    SupportAgent,
    Shield,
    VerifiedUser,
    AutoAwesome,
    Description,
    Code,
    Dashboard,
    Groups,
    Speed,
    ExpandMore,
    Gavel,
    Info,
    Book,
    QuestionAnswer
} from '@mui/icons-material';

import styles from '@/styles/Home.module.css';
import DiscordIcon from '@/components/icons/DiscordIcon';
    
export default function Home(props) {
    const stats = props.stats || { servers: 0, commands: 0, uptime: 99.9 };
    const profile = props.profile || {
        name: 'Guardian Bot',
        avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
        description: 'The most powerful and advanced multi-purpose Discord bot'
    };
    
    return (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box className={styles.background}>
                <main className={styles.container} style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem', justifyContent: 'flex-start' }}>
                    <MuiBox
                        sx={{
                            mb: 4,
                            display: 'flex',
                            justifyContent: 'center',
                            animation: 'fadeIn 1.5s ease-out 0.2s both',
                            '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'scale(0.8)' },
                                to: { opacity: 1, transform: 'scale(1)' }
                            },
                            position: 'relative'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -15,
                                    left: -15,
                                    right: -15,
                                    bottom: -15,
                                    background: 'conic-gradient(from 0deg, #7877c6, #ff77c6, #78dbff, #7877c6)',
                                    borderRadius: '50%',
                                    filter: 'blur(25px)',
                                    opacity: 0.7,
                                    animation: 'rotateGradient 4s linear infinite',
                                    zIndex: -1
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -8,
                                    left: -8,
                                    right: -8,
                                    bottom: -8,
                                    background: 'conic-gradient(from 180deg, rgba(120, 119, 198, 0.8), rgba(255, 119, 198, 0.8), rgba(120, 219, 255, 0.8))',
                                    borderRadius: '50%',
                                    filter: 'blur(15px)',
                                    opacity: 0.5,
                                    animation: 'pulseGlow 2s ease-in-out infinite',
                                    zIndex: -1
                                }
                            }}
                        >
                            <img
                                src={profile.avatar}
                                alt={profile.name}
                                style={{
                                    width: 'clamp(180px, 20vw, 220px)',
                                    height: 'clamp(180px, 20vw, 220px)',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid transparent',
                                    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #7877c6, #ff77c6, #78dbff) border-box',
                                    boxShadow:
                                        '0 0 60px rgba(120, 119, 198, 0.6), ' +
                                        '0 0 100px rgba(120, 119, 198, 0.3), ' +
                                        '0 0 140px rgba(255, 119, 198, 0.2), ' +
                                        '0 12px 40px rgba(0, 0, 0, 0.8), ' +
                                        'inset 0 0 20px rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    zIndex: 1,
                                    filter: 'drop-shadow(0 0 30px rgba(120, 119, 198, 0.4))'
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'scale(1.08) rotate(2deg)';
                                    e.target.style.boxShadow =
                                        '0 0 80px rgba(120, 119, 198, 0.8), ' +
                                        '0 0 120px rgba(120, 119, 198, 0.5), ' +
                                        '0 0 160px rgba(255, 119, 198, 0.3), ' +
                                        '0 15px 50px rgba(0, 0, 0, 0.9), ' +
                                        'inset 0 0 30px rgba(255, 255, 255, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1) rotate(0deg)';
                                    e.target.style.boxShadow =
                                        '0 0 60px rgba(120, 119, 198, 0.6), ' +
                                        '0 0 100px rgba(120, 119, 198, 0.3), ' +
                                        '0 0 140px rgba(255, 119, 198, 0.2), ' +
                                        '0 12px 40px rgba(0, 0, 0, 0.8), ' +
                                        'inset 0 0 20px rgba(255, 255, 255, 0.1)';
                                }}
                            />
                        </Box>
                    </MuiBox>
                    <Typography
                        sx={{
                            typography: { xs: 'h2', sm: 'h1' },
                            mb: 2
                        }}
                        className={styles.header}
                    >
                        {profile.name.toUpperCase()}
                    </Typography>
                    <Typography
                        sx={{
                            typography: { xs: 'h7', sm: 'h6' },
                            mb: 4,
                            maxWidth: '700px',
                            textAlign: 'center'
                        }}
                        className={styles.subheader}
                    >
                        {profile.description}
                    </Typography>

                    <MuiBox
                        sx={{
                            mt: 3,
                            mb: 8,
                            display: 'flex',
                            justifyContent: 'center',
                            animation: 'fadeIn 1.5s ease-out 0.8s both',
                            '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'translateY(30px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            },
                            position: 'relative'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(45deg, #7877c6, #ff77c6)',
                                    borderRadius: '16px',
                                    filter: 'blur(20px)',
                                    opacity: 0.4,
                                    zIndex: -1
                                }
                            }}
                        >
                            <Link href='https://discord.com/oauth2/authorize?client_id=1469385720270426358&scope=bot&permissions=8' style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<DiscordIcon />}
                                    sx={{
                                        px: 6,
                                        py: 2.5,
                                        fontSize: '1.3rem',
                                        fontWeight: 800,
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        background: 'conic-gradient(from 0deg at 50% 50%, #5865F2, #7289DA, #7877c6, #5865F2)',
                                        backgroundSize: '200% 200%',
                                        boxShadow:
                                            '0 6px 25px rgba(88, 101, 242, 0.5), ' +
                                            '0 0 50px rgba(88, 101, 242, 0.3), ' +
                                            '0 0 80px rgba(120, 119, 198, 0.2), ' +
                                            'inset 0 1px 0 rgba(255, 255, 255, 0.3), ' +
                                            'inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
                                        border: '2px solid transparent',
                                        backgroundClip: 'padding-box',
                                        color: '#ffffff',
                                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                                            transition: 'left 0.8s ease'
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-4px) scale(1.03)',
                                            backgroundPosition: '100% 50%',
                                            boxShadow:
                                                '0 12px 40px rgba(88, 101, 242, 0.7), ' +
                                                '0 0 80px rgba(88, 101, 242, 0.5), ' +
                                                '0 0 120px rgba(120, 119, 198, 0.3), ' +
                                                'inset 0 1px 0 rgba(255, 255, 255, 0.5), ' +
                                                'inset 0 -1px 0 rgba(0, 0, 0, 0.3)',
                                            border: '2px solid rgba(255, 255, 255, 0.4)',
                                            '&::before': {
                                                left: '100%'
                                            }
                                        },
                                        '&:active': {
                                            transform: 'translateY(-2px) scale(1.01)'
                                        }
                                    }}
                                >
                                    Invite to Server
                                </Button>
                            </Link>
                        </Box>
                    </MuiBox>

                    {/* Statistics Section */}
                    <MuiBox
                        sx={{
                            width: '100%',
                            maxWidth: '1200px',
                            mb: 8,
                            px: { xs: 2, sm: 3 },
                            animation: 'fadeInUp 1s ease-out 0.7s both',
                            '@keyframes fadeInUp': {
                                from: { opacity: 0, transform: 'translateY(20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}
                    >
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={4}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '24px',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1) 0%, transparent 50%)',
                                            borderRadius: '24px',
                                            zIndex: -1
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.03)',
                                            boxShadow: '0 20px 40px rgba(76, 175, 80, 0.3), 0 0 30px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)',
                                            mb: 2,
                                            border: '1px solid rgba(76, 175, 80, 0.3)'
                                        }}>
                                            <Groups sx={{ fontSize: '3rem', color: 'rgba(76, 175, 80, 1)' }} />
                                        </Box>
                                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', mb: 1, textShadow: '0 2px 10px rgba(76, 175, 80, 0.5)' }}>
                                            {stats.servers.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', fontWeight: 600 }}>
                                            Servers
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '24px',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 0%, transparent 50%)',
                                            borderRadius: '24px',
                                            zIndex: -1
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.03)',
                                            boxShadow: '0 20px 40px rgba(33, 150, 243, 0.3), 0 0 30px rgba(33, 150, 243, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.1) 100%)',
                                            mb: 2,
                                            border: '1px solid rgba(33, 150, 243, 0.3)'
                                        }}>
                                            <Code sx={{ fontSize: '3rem', color: 'rgba(33, 150, 243, 1)' }} />
                                        </Box>
                                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', mb: 1, textShadow: '0 2px 10px rgba(33, 150, 243, 0.5)' }}>
                                            {stats.commands.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', fontWeight: 600 }}>
                                            Commands
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '24px',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.1) 0%, transparent 50%)',
                                            borderRadius: '24px',
                                            zIndex: -1
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.03)',
                                            boxShadow: '0 20px 40px rgba(156, 39, 176, 0.3), 0 0 30px rgba(156, 39, 176, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(156, 39, 176, 0.1) 100%)',
                                            mb: 2,
                                            border: '1px solid rgba(156, 39, 176, 0.3)'
                                        }}>
                                            <Speed sx={{ fontSize: '3rem', color: 'rgba(156, 39, 176, 1)' }} />
                                        </Box>
                                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', mb: 1, textShadow: '0 2px 10px rgba(156, 39, 176, 0.5)' }}>
                                            {stats.uptime}%
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', fontWeight: 600 }}>
                                            Uptime
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </MuiBox>

                    {/* Features Section */}
                    <MuiBox
                        sx={{
                            width: '100%',
                            maxWidth: '1200px',
                            mb: 6,
                            px: { xs: 2, sm: 3 },
                            animation: 'fadeInUp 1s ease-out 0.8s both',
                            '@keyframes fadeInUp': {
                                from: { opacity: 0, transform: 'translateY(20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 4,
                                fontWeight: 700,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Powerful Features
                        </Typography>
                        <Grid container spacing={3}>
                            {[
                                { icon: Security, title: 'Advanced Moderation', desc: 'Comprehensive moderation tools with infraction tracking and automated actions', color: '#f44336' },
                                { icon: SupportAgent, title: 'Ticket System', desc: 'Create and manage support tickets directly from Discord with ease', color: '#2196f3' },
                                { icon: Shield, title: 'Anti-Raid Protection', desc: 'Automatically detect and prevent raid attacks with smart lockdown features', color: '#ff9800' },
                                { icon: VerifiedUser, title: 'Verification System', desc: 'Multiple verification methods including button, command, and CAPTCHA', color: '#4caf50' },
                                { icon: AutoAwesome, title: 'Auto-Role', desc: 'Automatically assign roles to new members and bots when they join', color: '#9c27b0' },
                                { icon: Description, title: 'Logging & Suggestions', desc: 'Comprehensive logging system and community suggestion channels', color: '#00bcd4' }
                            ].map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(100, 100, 100, 0.3)',
                                                borderRadius: '16px',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 8px 24px ${feature.color}40`,
                                                    borderColor: `${feature.color}60`
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 2
                                                }}>
                                                    <IconComponent sx={{ color: feature.color, fontSize: '2rem', mr: 1.5 }} />
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#e0e0e0'
                                                        }}
                                                    >
                                                        {feature.title}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'rgba(200, 200, 200, 0.8)',
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {feature.desc}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </MuiBox>

                    {/* FAQ Section */}
                    <MuiBox
                        sx={{
                            width: '100%',
                            maxWidth: '900px',
                            mb: 6,
                            px: { xs: 2, sm: 3 },
                            animation: 'fadeInUp 1s ease-out 1s both',
                            '@keyframes fadeInUp': {
                                from: { opacity: 0, transform: 'translateY(20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 4,
                                fontWeight: 700,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Frequently Asked Questions
                        </Typography>
                        {[
                            { question: 'How do I invite Guardian to my server?', answer: 'Click the "Invite to server" button at the top of this page, select your server, and authorize the bot. Guardian will automatically join your server with the necessary permissions.' },
                            { question: 'What permissions does Guardian need?', answer: 'Guardian requires Administrator permissions (or specific moderation permissions) to function properly. This allows it to manage roles, kick/ban members, manage channels, and perform other moderation tasks.' },
                            { question: 'How do I set up the dashboard?', answer: 'After inviting Guardian, log in to this dashboard using your Discord account. You\'ll see all servers where you have admin permissions. Click on a server to configure its settings.' },
                            { question: 'Is Guardian free to use?', answer: 'Yes! Guardian is completely free to use. All features are available without any cost or subscription requirements.' },
                            { question: 'How do I report a bug or request a feature?', answer: 'You can report bugs or request features by joining our Discord support server or opening an issue on our GitHub repository. Links are available in the Support section below.' },
                            { question: 'Can I customize Guardian\'s commands?', answer: 'Guardian comes with a comprehensive set of pre-configured commands. While you cannot create custom commands, you can configure how existing features work through the web dashboard.' }
                        ].map((faq, index) => (
                            <Accordion
                                key={index}
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    borderRadius: '12px !important',
                                    mb: 2,
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': {
                                        margin: '0 0 16px 0'
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />}
                                    sx={{
                                        '& .MuiAccordionSummary-content': {
                                            my: 2
                                        }
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 600, color: '#e0e0e0' }}>
                                        {faq.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ color: 'rgba(200, 200, 200, 0.8)', lineHeight: 1.6 }}>
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </MuiBox>

                    {/* Support & Documentation Section */}
                    <MuiBox
                        sx={{
                            width: '100%',
                            maxWidth: '1000px',
                            mb: 6,
                            px: { xs: 2, sm: 3 },
                            animation: 'fadeInUp 1s ease-out 1.1s both',
                            '@keyframes fadeInUp': {
                                from: { opacity: 0, transform: 'translateY(20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 4,
                                fontWeight: 700,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Support & Resources
                        </Typography>
                        <Grid container spacing={3}>
                            {[
                                { icon: QuestionAnswer, title: 'Discord Support', desc: 'Get help from our community and support team', link: 'https://discord.gg/m5vhwUDQvz', color: '#5865F2' },
                                { icon: Book, title: 'Documentation', desc: 'Comprehensive guides and setup instructions', link: '/documentation', color: '#2196f3' },
                                { icon: Code, title: 'GitHub', desc: 'View source code, report issues, and contribute', link: 'https://github.com/Guardians-Stuff', color: '#333' },
                                { icon: Info, title: 'Commands', desc: 'Browse all available commands and their usage', link: '/commands', color: '#4caf50' },
                                { icon: Gavel, title: 'Terms of Service', desc: 'Read our terms and conditions', link: '/tos', color: '#ff9800' }
                            ].map((support, index) => {
                                const IconComponent = support.icon;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Link href={support.link} style={{ textDecoration: 'none' }} target={support.link.startsWith('http') ? '_blank' : undefined} rel={support.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                                    borderRadius: '16px',
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: `0 8px 24px ${support.color}40`,
                                                        borderColor: `${support.color}60`
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                                    <IconComponent sx={{ color: support.color, fontSize: '2.5rem', mb: 1.5 }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#e0e0e0', mb: 1 }}>
                                                        {support.title}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)', lineHeight: 1.6 }}>
                                                        {support.desc}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </MuiBox>

                    {/* Quick Links */}
                    <MuiBox
                        sx={{
                            width: '100%',
                            maxWidth: '800px',
                            display: 'flex',
                            justifyContent: 'center',
                            animation: 'fadeIn 1s ease-out 1.3s both',
                            '@keyframes fadeIn': {
                                from: { opacity: 0 },
                                to: { opacity: 1 }
                            }
                        }}
                    >
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Link href="/commands" style={{ textDecoration: 'none' }}>
                                    <Chip
                                        icon={<Code sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />}
                                        label="View Commands"
                                        clickable
                                        sx={{
                                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                            border: '1px solid rgba(100, 100, 100, 0.3)',
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontSize: '0.95rem',
                                            padding: '12px 16px',
                                            height: 'auto',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                                borderColor: 'rgba(150, 150, 150, 0.5)'
                                            }
                                        }}
                                    />
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/changelog" style={{ textDecoration: 'none' }}>
                                    <Chip
                                        icon={<Description sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />}
                                        label="Changelog"
                                        clickable
                                        sx={{
                                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                            border: '1px solid rgba(100, 100, 100, 0.3)',
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontSize: '0.95rem',
                                            padding: '12px 16px',
                                            height: 'auto',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                                borderColor: 'rgba(150, 150, 150, 0.5)'
                                            }
                                        }}
                                    />
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                                    <Chip
                                        icon={<Dashboard sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />}
                                        label="Dashboard"
                                        clickable
                                        sx={{
                                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                            border: '1px solid rgba(100, 100, 100, 0.3)',
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontSize: '0.95rem',
                                            padding: '12px 16px',
                                            height: 'auto',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                                borderColor: 'rgba(150, 150, 150, 0.5)'
                                            }
                                        }}
                                    />
                                </Link>
                            </Grid>
                        </Grid>
                    </MuiBox>
                </main>
            </Box>
        </>
    );
}

export async function getServerSideProps(context) {
    try {
        // Force IPv4 to avoid connection issues
        const baseUrl = process.env.NEXT_PUBLIC_HOST?.replace('::1', '127.0.0.1') || 'http://127.0.0.1:3000';
        
        // Fetch both stats and profile data
        const [ statsResponse, profileResponse ] = await Promise.all([
            fetch(`${baseUrl}/api/bot/stats`, { cache: 'no-cache' }),
            fetch(`${baseUrl}/api/bot/profile`, { cache: 'no-cache' })
        ]);
        
        let stats = { servers: 0, commands: 0, uptime: 99.9 };
        if (statsResponse.ok) {
            stats = await statsResponse.json();
        }
        
        let profile = {
            name: 'Guardian Bot',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            description: 'The most powerful and advanced multi-purpose Discord bot'
        };
        if (profileResponse.ok) {
            profile = await profileResponse.json();
        }
        
        return { props: { stats, profile } };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: {
                stats: { servers: 0, commands: 0, uptime: 99.9 },
                profile: {
                    name: 'Guardian Bot',
                    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
                    description: 'The most powerful and advanced multi-purpose Discord bot'
                }
            }
        };
    }
}