import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import { Typography, Box as MuiBox, Card, CardContent, Button, Grid, Divider, Accordion, AccordionSummary, AccordionDetails, Chip, List, ListItem, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import { Book, ArrowBack, Code, Settings, Security, SupportAgent, Shield, ExpandMore, VerifiedUser, AutoAwesome, Description, Notifications } from '@mui/icons-material';

import styles from '@/styles/Home.module.css';

export default function Documentation() {
    const [expandedSection, setExpandedSection] = useState(null);

    const handleSectionChange = (section) => (event, isExpanded) => {
        setExpandedSection(isExpanded ? section : null);
    };

    const documentationSections = [
        {
            id: 'getting-started',
            icon: Settings,
            title: 'Getting Started',
            color: '#2196f3',
            content: [
                {
                    title: 'Inviting Guardian to Your Server',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                To invite Guardian to your Discord server, follow these steps:
                            </Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Click the 'Invite to server' button on the homepage"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Select your Discord server from the dropdown menu"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Review and authorize the required permissions (Administrator recommended)"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Guardian will join your server and be ready to use"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.7)', mt: 2, fontStyle: 'italic' }}>
                                Note: You must have the "Manage Server" permission to invite bots to your server.
                            </Typography>
                        </Box>
                    )
                },
                {
                    title: 'Accessing the Dashboard',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                The Guardian dashboard allows you to configure all bot settings through a user-friendly web interface:
                            </Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Visit the dashboard homepage and click 'Login' or navigate to /dashboard"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Authorize with your Discord account (you'll only see servers where you have admin permissions)"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Select a server from the list to configure its settings"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Use the navigation tabs to access different configuration sections"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    )
                },
                {
                    title: 'Required Permissions',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Guardian requires specific permissions to function properly. Here's what each permission is used for:
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)', mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, fontSize: '1rem' }}>Administrator</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                                Recommended for full functionality. Allows Guardian to manage all aspects of your server.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)', mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, fontSize: '1rem' }}>Manage Roles</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                                Required for auto-role, verification, and role management features.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)', mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, fontSize: '1rem' }}>Manage Channels</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                                Needed for ticket creation, channel management, and lockdown features.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)', mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, fontSize: '1rem' }}>Kick/Ban Members</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                                Essential for moderation commands and anti-raid protection.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )
                }
            ]
        },
        {
            id: 'moderation',
            icon: Security,
            title: 'Moderation System',
            color: '#f44336',
            content: [
                {
                    title: 'Infraction System',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Guardian's infraction system allows you to track and manage all moderation actions taken against users:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 2 }}>Infraction Types</Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Warnings - Track rule violations without taking action"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Kicks - Remove users from the server temporarily"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Bans - Permanently prevent users from rejoining"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Mutes - Temporarily restrict user communication"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 3 }}>Viewing Infractions</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Access the Infractions tab in your server's dashboard to view all infractions. You can filter by user, type, and moderator. Each infraction includes:
                            </Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="User who received the infraction"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Moderator who issued it"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Reason and timestamp"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Active status (can be marked inactive)"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    )
                },
                {
                    title: 'Moderation Commands',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Guardian provides comprehensive moderation commands. All commands use slash command format:
                            </Typography>
                            <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)', mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>/warn [user] [reason]</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                        Issue a warning to a user. The warning is logged in the infraction system.
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)', mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>/kick [user] [reason]</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                        Remove a user from the server. They can rejoin if they have an invite link.
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)', mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>/ban [user] [reason] [days]</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                        Permanently ban a user. Optionally delete their messages from the past N days.
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.7)', mt: 2, fontStyle: 'italic' }}>
                                For a complete list of all commands, visit the <Link href="/commands" style={{ color: '#5865F2', textDecoration: 'none' }}>Commands page</Link>.
                            </Typography>
                        </Box>
                    )
                }
            ]
        },
        {
            id: 'tickets',
            icon: SupportAgent,
            title: 'Ticket System',
            color: '#2196f3',
            content: [
                {
                    title: 'Setting Up the Ticket System',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                The ticket system allows users to create private support channels. Follow these steps to set it up:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 2 }}>Step 1: Enable Tickets</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Navigate to your server's dashboard and go to the Tickets section. Toggle "Enable Tickets" to ON.
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 2 }}>Step 2: Configure Settings</Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Category: Select the category where ticket channels will be created"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Channel: Choose the channel where users can create tickets (usually a support channel)"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Support Role: Assign the role that can view and respond to tickets"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 3 }}>Step 3: Create Ticket Button</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                In your designated ticket channel, use the command <Chip label="/ticket create" size="small" sx={{ background: 'rgba(60, 60, 60, 0.5)', color: '#e0e0e0' }} /> to create a ticket button. Users can click this button to open a new support ticket.
                            </Typography>
                        </Box>
                    )
                },
                {
                    title: 'Managing Tickets',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Once tickets are created, you can manage them through both Discord and the dashboard:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 2 }}>In Discord</Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="View all tickets in the Tickets tab of your server dashboard"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Use /ticket close to close a ticket (optionally with a reason)"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Closed tickets are automatically deleted after a set time period"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 3 }}>In Dashboard</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Access the Tickets view in your server dashboard to see all active and closed tickets, view ticket history, and manage ticket settings.
                            </Typography>
                        </Box>
                    )
                }
            ]
        },
        {
            id: 'security',
            icon: Shield,
            title: 'Security Features',
            color: '#ff9800',
            content: [
                {
                    title: 'Anti-Raid Protection',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Guardian's anti-raid system automatically detects and prevents server raids:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 2 }}>Configuration</Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Join Amount: Set how many users joining within the time window triggers a raid alert"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Join Within: Time window in seconds (e.g., 10 users in 60 seconds)"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Action: Choose to automatically kick or ban detected raiders"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Lockdown: Enable automatic server lockdown when a raid is detected"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 3 }}>Lockdown Mode</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                When lockdown is enabled and a raid is detected, Guardian will automatically restrict all channels to prevent further damage. You can manually disable lockdown once the threat is resolved.
                            </Typography>
                        </Box>
                    )
                },
                {
                    title: 'Verification System',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Protect your server from bots and unwanted members with Guardian's verification system:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 2 }}>Verification Methods</Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)' }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, fontSize: '1rem' }}>Button Verification</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                                Users click a button in a designated channel to verify. Simple and user-friendly.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)' }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, fontSize: '1rem' }}>Command Verification</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                                Users run a command (e.g., /verify) to complete verification. Good for custom setups.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ background: 'rgba(40, 40, 40, 0.5)', border: '1px solid rgba(100, 100, 100, 0.3)' }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, fontSize: '1rem' }}>CAPTCHA Verification</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                                                Most secure option. Users must complete a CAPTCHA challenge to verify.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 3 }}>Setup Instructions</Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Enable verification in your server dashboard"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Select your preferred verification method"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Choose the verification channel and role to assign upon verification"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    )
                },
                {
                    title: 'Auto-Role System',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Automatically assign roles to new members and bots when they join your server:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 2 }}>Member Auto-Role</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                When enabled, all new members will automatically receive the specified role upon joining. This is useful for giving new members access to basic channels or marking them as unverified.
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 3 }}>Bot Auto-Role</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Automatically assign a role to bots when they join. This helps organize and identify bots in your server.
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.7)', mt: 2, fontStyle: 'italic' }}>
                                Important: Guardian's role must be higher than the roles it's trying to assign in the role hierarchy.
                            </Typography>
                        </Box>
                    )
                }
            ]
        },
        {
            id: 'logging',
            icon: Notifications,
            title: 'Logging System',
            color: '#9c27b0',
            content: [
                {
                    title: 'Setting Up Logging',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Guardian can log various server events to help you keep track of what's happening:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 2 }}>Basic Logs</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Basic logs track general server activity such as:
                            </Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Message edits and deletions"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Channel and role creation/deletion"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Member joins and leaves"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 3 }}>Moderator Logs</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Moderator logs track all moderation actions including:
                            </Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Warnings, kicks, and bans"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Role assignments and removals"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Channel restrictions and timeouts"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                            <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.7)', mt: 2, fontStyle: 'italic' }}>
                                Configure logging channels in your server dashboard under the Logging section.
                            </Typography>
                        </Box>
                    )
                }
            ]
        },
        {
            id: 'suggestions',
            icon: Description,
            title: 'Suggestion System',
            color: '#00bcd4',
            content: [
                {
                    title: 'Community Suggestions',
                    content: (
                        <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Allow your community to submit suggestions for server improvements:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 2 }}>Setup</Typography>
                            <List sx={{ pl: 2 }}>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Enable suggestions in your server dashboard"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Select the channel where suggestions will be posted"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 1 }}>
                                    <ListItemText 
                                        primary="Optionally enable automatic upvote/downvote reactions"
                                        primaryTypographyProps={{ sx: { color: 'rgba(200, 200, 200, 0.9)' } }}
                                    />
                                </ListItem>
                            </List>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1, mt: 3 }}>Usage</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', mb: 2, lineHeight: 1.8 }}>
                                Users can submit suggestions using the <Chip label="/suggest [your suggestion]" size="small" sx={{ background: 'rgba(60, 60, 60, 0.5)', color: '#e0e0e0' }} /> command. The suggestion will be posted in the designated channel with the user's name attached.
                            </Typography>
                        </Box>
                    )
                }
            ]
        }
    ];

    return (
        <>
            <Head>
                <title>Documentation - Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box className={styles.background}>
                <main className={styles.container} style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem', justifyContent: 'flex-start' }}>
                    <MuiBox
                        sx={{
                            width: '100%',
                            maxWidth: '1200px',
                            mb: 4,
                            px: { xs: 2, sm: 3 },
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
                                mb: 4,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Book sx={{ color: 'rgba(33, 150, 243, 0.9)', fontSize: '2.5rem', mr: 1.5 }} />
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
                                        Guardian Documentation
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.8)', lineHeight: 1.6 }}>
                                    Welcome to the Guardian documentation. Here you'll find comprehensive guides on setting up and using all of Guardian's features.
                                </Typography>
                            </CardContent>
                        </Card>

                        {documentationSections.map((section, sectionIndex) => {
                            const IconComponent = section.icon;
                            return (
                                <Accordion
                                    key={section.id}
                                    expanded={expandedSection === section.id}
                                    onChange={handleSectionChange(section.id)}
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(100, 100, 100, 0.3)',
                                        borderRadius: '16px !important',
                                        mb: 3,
                                        '&:before': { display: 'none' },
                                        '&.Mui-expanded': {
                                            margin: '0 0 24px 0',
                                        },
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: `${section.color}60`,
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />}
                                        sx={{
                                            px: 3,
                                            py: 2,
                                            '& .MuiAccordionSummary-content': {
                                                my: 1
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <IconComponent sx={{ color: section.color, fontSize: '2rem', mr: 2 }} />
                                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#e0e0e0' }}>
                                                {section.title}
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                        <Divider sx={{ borderColor: 'rgba(100, 100, 100, 0.3)', mb: 3 }} />
                                        {section.content.map((item, itemIndex) => (
                                            <Box key={itemIndex} sx={{ mb: itemIndex < section.content.length - 1 ? 4 : 0 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#d0d0d0', mb: 2, fontSize: '1.2rem' }}>
                                                    {item.title}
                                                </Typography>
                                                {item.content}
                                            </Box>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}

                        <Card
                            sx={{
                                background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(100, 100, 100, 0.3)',
                                borderRadius: '16px',
                                mt: 4,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Code sx={{ color: 'rgba(76, 175, 80, 0.9)', fontSize: '2rem', mr: 1.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#e0e0e0' }}>
                                        Additional Resources
                                    </Typography>
                                </Box>
                                <Divider sx={{ borderColor: 'rgba(100, 100, 100, 0.3)', mb: 3 }} />
                                <Typography variant="body1" sx={{ color: 'rgba(200, 200, 200, 0.9)', lineHeight: 1.8, mb: 2 }}>
                                    For more detailed information, visit our:
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Link href="/commands" style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                justifyContent: 'flex-start',
                                                color: 'rgba(255, 255, 255, 0.9)',
                                                borderColor: 'rgba(100, 100, 100, 0.3)',
                                                '&:hover': {
                                                    borderColor: 'rgba(150, 150, 150, 0.5)',
                                                    background: 'rgba(60, 60, 60, 0.3)',
                                                }
                                            }}
                                        >
                                            View All Commands
                                        </Button>
                                    </Link>
                                    <Link href="https://discord.gg/m5vhwUDQvz" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                justifyContent: 'flex-start',
                                                color: 'rgba(255, 255, 255, 0.9)',
                                                borderColor: 'rgba(100, 100, 100, 0.3)',
                                                '&:hover': {
                                                    borderColor: 'rgba(150, 150, 150, 0.5)',
                                                    background: 'rgba(60, 60, 60, 0.3)',
                                                }
                                            }}
                                        >
                                            Join Support Server
                                        </Button>
                                    </Link>
                                    <Link href="https://github.com/Guardians-Stuff" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                justifyContent: 'flex-start',
                                                color: 'rgba(255, 255, 255, 0.9)',
                                                borderColor: 'rgba(100, 100, 100, 0.3)',
                                                '&:hover': {
                                                    borderColor: 'rgba(150, 150, 150, 0.5)',
                                                    background: 'rgba(60, 60, 60, 0.3)',
                                                }
                                            }}
                                        >
                                            View on GitHub
                                        </Button>
                                    </Link>
                                </Box>
                            </CardContent>
                        </Card>
                    </MuiBox>
                </main>
            </Box>
        </>
    );
}

