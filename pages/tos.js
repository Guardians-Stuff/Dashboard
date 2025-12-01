import Head from 'next/head';
import Link from 'next/link';

import { Typography, Box as MuiBox, Card, CardContent, Button } from '@mui/material';
import { Box } from '@mui/system';
import { Gavel, ArrowBack } from '@mui/icons-material';

import styles from '@/styles/Home.module.css';

export default function TermsOfService() {
    return (
        <>
            <Head>
                <title>Terms of Service - Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box className={styles.background}>
                <main className={styles.container} style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem', justifyContent: 'flex-start' }}>
                    <MuiBox
                        sx={{
                            width: '100%',
                            maxWidth: '900px',
                            mb: 4,
                            animation: 'fadeIn 1s ease-out both',
                            '@keyframes fadeIn': {
                                from: { opacity: 0 },
                                to: { opacity: 1 }
                            }
                        }}
                    >
                        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
                            <Button
                                startIcon={<ArrowBack />}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        background: 'rgba(60, 60, 60, 0.3)',
                                    }
                                }}
                            >
                                Back to Home
                            </Button>
                        </Link>

                        <Card
                            sx={{
                                background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(100, 100, 100, 0.3)',
                                borderRadius: '16px',
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Gavel sx={{ color: 'rgba(255, 152, 0, 0.9)', fontSize: '2rem', mr: 1.5 }} />
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
                                        Terms of Service
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.7)', mb: 4 }}>
                                    Last updated: {new Date().toLocaleDateString()}
                                </Typography>

                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8, mb: 3 }}>
                                    <strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>1. Acceptance of Terms</strong><br />
                                    By using Guardian Bot ("the Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
                                </Typography>

                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8, mb: 3 }}>
                                    <strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>2. Use of Service</strong><br />
                                    Guardian is provided for legitimate server moderation and management purposes. You agree not to use Guardian for any illegal activities, harassment, violation of Discord's Terms of Service, or any other activities that may harm others. You are responsible for all actions taken using Guardian in your servers.
                                </Typography>

                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8, mb: 3 }}>
                                    <strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>3. Data Privacy</strong><br />
                                    We collect minimal data necessary for bot functionality, including server IDs, user IDs, and configuration settings. Server data is stored securely and is only accessible to authorized server administrators through the dashboard. We do not sell or share your data with third parties. For more information, please refer to our Privacy Policy.
                                </Typography>

                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8, mb: 3 }}>
                                    <strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>4. Service Availability</strong><br />
                                    While we strive for 99.9% uptime, we do not guarantee uninterrupted or error-free service. The Service may be temporarily unavailable due to maintenance, updates, or unforeseen circumstances. We are not liable for any damages resulting from service interruptions, data loss, or service unavailability.
                                </Typography>

                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8, mb: 3 }}>
                                    <strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>5. Modifications to Service</strong><br />
                                    We reserve the right to modify, suspend, or discontinue Guardian or any part thereof at any time, with or without notice. We will provide reasonable notice of significant changes when possible, but are not obligated to do so. Your continued use of the Service after changes constitutes acceptance of the modifications.
                                </Typography>

                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8, mb: 3 }}>
                                    <strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>6. Limitation of Liability</strong><br />
                                    Guardian is provided "as is" and "as available" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement. We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                                </Typography>

                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8, mb: 3 }}>
                                    <strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>7. User Responsibilities</strong><br />
                                    You are responsible for maintaining the security of your account and server configurations. You agree not to share your dashboard access with unauthorized users. You are also responsible for ensuring that your use of Guardian complies with Discord's Terms of Service and Community Guidelines.
                                </Typography>

                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8, mb: 3 }}>
                                    <strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>8. Termination</strong><br />
                                    We reserve the right to terminate or suspend your access to Guardian at any time, with or without cause or notice, for any reason including violation of these Terms of Service. Upon termination, your right to use the Service will immediately cease.
                                </Typography>

                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8 }}>
                                    <strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>9. Contact Information</strong><br />
                                    If you have any questions about these Terms of Service, please contact us through our Discord support server at <Link href="https://discord.gg/m5vhwUDQvz" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'none' }}>https://discord.gg/m5vhwUDQvz</Link>.
                                </Typography>
                            </CardContent>
                        </Card>
                    </MuiBox>
                </main>
            </Box>
        </>
    );
}

