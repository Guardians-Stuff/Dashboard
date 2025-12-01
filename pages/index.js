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
                            mb: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            animation: 'fadeIn 1s ease-out 0.2s both',
                            '@keyframes fadeIn': {
                                from: { opacity: 0 },
                                to: { opacity: 1 }
                            }
                        }}
                    >
                        <img
                            src="https://media.discordapp.net/attachments/1442949704240464015/1444607500778213446/b0fc77e52e5d00cfd644c5bbe85551d6.jpg?ex=692d5313&is=692c0193&hm=24bc85c8657a412be716f8d3412f282f3662fa1d1ac5e0ec6e95d211ffdffd47&=&format=webp&width=320&height=320"
                            alt="Guardian Bot"
                            style={{
                                width: 'clamp(140px, 16vw, 160px)',
                                height: 'clamp(140px, 16vw, 160px)',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                                border: '3px solid rgba(255, 255, 255, 0.1)',
                            }}
                        />
                    </MuiBox>
                    <Typography 
                        sx={{ 
                            typography: { xs: 'h2', sm: 'h1' },
                            mb: 2
                        }} 
                        className={styles.header}
                    >
                        GUARDIAN
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
                        The most powerful and advanced multi-purpose Discord bot with a web dashboard focused on advanced moderation to secure servers.
                    </Typography>

                    <MuiBox 
                        sx={{ 
                            mt: 2,
                            mb: 6,
                            display: 'flex',
                            justifyContent: 'center',
                            animation: 'fadeIn 1s ease-out 0.6s both',
                            '@keyframes fadeIn': {
                                from: { opacity: 0 },
                                to: { opacity: 1 }
                            }
                        }}
                    >
                        <Link href='https://discord.com/oauth2/authorize?client_id=1422311269658005635&scope=bot&permissions=8' style={{ textDecoration: 'none' }}>
                            <Button 
                                variant="contained" 
                                startIcon={<DiscordIcon />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    background: 'linear-gradient(135deg, #5865F2 0%, #4752C4 100%)',
                                    boxShadow: '0 4px 15px rgba(88, 101, 242, 0.4)',
                                    border: '1px solid rgba(100, 100, 100, 0.3)',
                                    color: '#ffffff',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(88, 101, 242, 0.6)',
                                        background: 'linear-gradient(135deg, #4752C4 0%, #3C45A5 100%)',
                                        borderColor: 'rgba(150, 150, 150, 0.5)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    }
                                }}
                            >
                                Invite to server
                            </Button>
                        </Link>
                    </MuiBox>

                    {/* Statistics Section */}
                    <MuiBox 
                        sx={{ 
                            width: '100%',
                            maxWidth: '1000px',
                            mb: 6,
                            px: { xs: 2, sm: 3 },
                            animation: 'fadeInUp 1s ease-out 0.7s both',
                            '@keyframes fadeInUp': {
                                from: { opacity: 0, transform: 'translateY(20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
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
                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                        <Groups sx={{ fontSize: '2.5rem', color: 'rgba(76, 175, 80, 0.9)', mb: 1 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#e0e0e0', mb: 0.5 }}>
                                            {stats.servers.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
                                            Servers
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(100, 100, 100, 0.3)',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(33, 150, 243, 0.3)',
                                        }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                        <Code sx={{ fontSize: '2.5rem', color: 'rgba(33, 150, 243, 0.9)', mb: 1 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#e0e0e0', mb: 0.5 }}>
                                            {stats.commands.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
                                            Commands
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(100, 100, 100, 0.3)',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(156, 39, 176, 0.3)',
                                        }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                        <Speed sx={{ fontSize: '2.5rem', color: 'rgba(156, 39, 176, 0.9)', mb: 1 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#e0e0e0', mb: 0.5 }}>
                                            {stats.uptime}%
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
                                            Uptime
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </MuiBox>

                    {/* Why Guardian Section */}
                    <MuiBox 
                        sx={{ 
                            width: '100%',
                            maxWidth: '1200px',
                            mb: 6,
                            px: { xs: 2, sm: 3 },
                            animation: 'fadeInUp 1s ease-out 0.9s both',
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
                                backgroundClip: 'text',
                            }}
                        >
                            Why Choose Guardian?
                        </Typography>
                        <Grid container spacing={3}>
                            {[
                                { icon: Shield, title: 'Secure & Reliable', desc: 'Built with security in mind, Guardian protects your server from raids, spam, and malicious activity with advanced detection systems.', color: '#4caf50' },
                                { icon: Speed, title: 'Lightning Fast', desc: 'Optimized performance ensures Guardian responds instantly to commands and events, keeping your server running smoothly.', color: '#2196f3' },
                                { icon: VerifiedUser, title: 'Easy to Use', desc: 'Intuitive web dashboard makes configuration simple. No technical knowledge required to set up powerful moderation tools.', color: '#ff9800' },
                                { icon: AutoAwesome, title: 'Constantly Updated', desc: 'Regular updates bring new features, improvements, and bug fixes. Guardian evolves with your server needs.', color: '#9c27b0' },
                            ].map((benefit, index) => {
                                const IconComponent = benefit.icon;
                                return (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(100, 100, 100, 0.3)',
                                                borderRadius: '16px',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 8px 24px ${benefit.color}40`,
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <IconComponent sx={{ color: benefit.color, fontSize: '2rem', mr: 1.5 }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#e0e0e0' }}>
                                                        {benefit.title}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)', lineHeight: 1.6 }}>
                                                    {benefit.desc}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
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
                                backgroundClip: 'text',
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
                                { icon: Description, title: 'Logging & Suggestions', desc: 'Comprehensive logging system and community suggestion channels', color: '#00bcd4' },
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
                                                    borderColor: `${feature.color}60`,
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
                                backgroundClip: 'text',
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
                            { question: 'Can I customize Guardian\'s commands?', answer: 'Guardian comes with a comprehensive set of pre-configured commands. While you cannot create custom commands, you can configure how existing features work through the web dashboard.' },
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
                                        margin: '0 0 16px 0',
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
                                backgroundClip: 'text',
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
                                { icon: Gavel, title: 'Terms of Service', desc: 'Read our terms and conditions', link: '/tos', color: '#ff9800' },
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
                                                        borderColor: `${support.color}60`,
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
                                                borderColor: 'rgba(150, 150, 150, 0.5)',
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
                                                borderColor: 'rgba(150, 150, 150, 0.5)',
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
                                                borderColor: 'rgba(150, 150, 150, 0.5)',
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
        const baseUrl = process.env.NEXT_PUBLIC_HOST || (context.req ? `http://${context.req.headers.host}` : 'http://localhost:3000');
        const statsResponse = await fetch(`${baseUrl}/api/bot/stats`, {
            cache: 'no-cache'
        });
        
        let stats = { servers: 0, commands: 0, uptime: 99.9 };
        if (statsResponse.ok) {
            stats = await statsResponse.json();
        }
        
        return { props: { stats } };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { props: { stats: { servers: 0, commands: 0, uptime: 99.9 } } };
    }
}