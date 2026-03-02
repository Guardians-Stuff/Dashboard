import React from 'react';
import Link from 'next/link';
import Moment from 'moment';

import {
    Avatar, Card, CardContent, Checkbox, CircularProgress,
    Divider, FormControl, FormControlLabel, Grid, InputLabel,
    ListItemText, MenuItem, Pagination, Select, Switch,
    TextField, Typography, Paper, Chip, IconButton,
    Tooltip, LinearProgress, Badge, Menu, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, Box
} from '@mui/material';
import {
    Search, FilterList, MoreVert, SupportAgent,
    QuestionAnswer, Schedule, Refresh, Download,
    Visibility, Edit, Delete, PriorityHigh,
    LowPriority, ArrowUpward, ArrowDownward
} from '@mui/icons-material';

import TextAvatar from '../TextAvatar';

export default function TicketsView(props) {
    const { mobile, guild, members } = props;
    const [ darkMode, setDarkMode ] = React.useState(true);
    const [ data, setData ] = React.useState({
        loading: true,
        users: members || [],
        tickets: [],
        page: 1,
        totalPages: 0
    });
    const [ filter, setFilter ] = React.useState({
        id: '',
        inactive: true
    });
    const [ anchorEl, setAnchorEl ] = React.useState(null);
    const [ selectedTicket, setSelectedTicket ] = React.useState(null);
    const [ dialogTicket, setDialogTicket ] = React.useState(null);

    React.useEffect(() => {
        async function fetchData() {
            const url = [
                '/api/',
                guild ? `guilds/${guild.id}/tickets` : '',
                `?pagination=${data.page}`,
                filter.id ? `&id=${filter.id}` : '',
                !filter.inactive ? '&active=true' : ''
            ].join('');

            const tempUsers = [ ...data.users ];

            const response = (await fetch(url, { cache: 'no-cache' }).then(response => response.json()));
            const tickets = response.tickets;

            const externalIDs = [ ...new Set(tickets.flatMap(entry => entry.user)) ].filter(id => !tempUsers.find(user => user.id == id));
            const promises = externalIDs.map(id => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${id}`, { cache: 'no-cache' }).then(async response => response.json()));
            
            tempUsers.push(...await Promise.all(promises));
        
            setData({
                ...data,
                loading: false,
                users: tempUsers,
                tickets: tickets,
                totalPages: response.totalPages
            });
        }

        fetchData();
    }, [ guild, data.page, filter ]);

    const handleMenuClick = (event, ticket) => {
        setAnchorEl(event.currentTarget);
        setSelectedTicket(ticket);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTicket(null);
    };

    const getTicketPriority = (priority) => {
        const priorities = {
            high: { color: '#f44336', icon: <PriorityHigh />, label: 'High' },
            medium: { color: '#ff9800', icon: <ArrowUpward />, label: 'Medium' },
            low: { color: '#4caf50', icon: <LowPriority />, label: 'Low' }
        };
        return priorities[priority] || priorities.medium;
    };

    const getTicketStatus = (status) => {
        const statuses = {
            open: { color: '#4caf50', label: 'Open' },
            pending: { color: '#ff9800', label: 'Pending' },
            closed: { color: '#9e9e9e', label: 'Closed' }
        };
        return statuses[status] || statuses.open;
    };

    const TicketCard = ({ ticket, fetchedUser }) => {
        const priority = getTicketPriority(ticket.priority);
        const status = getTicketStatus(ticket.status);

        return (
            <Card
                sx={{
                    background: 'rgba(25, 25, 25, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${status.color}40`,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: `0 20px 40px ${status.color}30, 0 0 60px ${status.color}10`,
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
                        background: `linear-gradient(90deg, transparent, ${status.color}20, transparent)`,
                        transition: 'left 0.6s ease'
                    }
                }}
                onClick={() => setDialogTicket(ticket)}
            >
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                    {/* Status Badge */}
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                        <Badge
                            badgeContent={status.label}
                            color={ticket.status === 'open' ? 'success' : ticket.status === 'pending' ? 'warning' : 'default'}
                            sx={{
                                '& .MuiBadge-badge': {
                                    background: status.color,
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    px: 1
                                }
                            }}
                        />
                    </Box>

                    {/* User Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={fetchedUser?.displayAvatarURL ? `${fetchedUser.displayAvatarURL}?size=64` : null}
                            sx={{
                                width: 48,
                                height: 48,
                                border: `3px solid ${status.color}40`,
                                mr: 2
                            }}
                        >
                            {fetchedUser?.username?.slice(0, 1).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                color: '#ffffff',
                                mb: 0.5
                            }}>
                                {fetchedUser?.username}#{fetchedUser?.discriminator}
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                                fontSize: '0.8rem'
                            }}>
                                Ticket #{ticket._id}
                            </Typography>
                        </Box>
                        
                        {/* Action Menu */}
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick(e, ticket);
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

                    <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                    {/* Ticket Subject */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{
                            fontWeight: 600,
                            color: '#ffffff',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            {priority.icon}
                            {ticket.subject || 'No Subject'}
                        </Typography>
                        {ticket.message && (
                            <Typography variant="body2" sx={{
                                color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                                fontStyle: 'italic',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                "{ticket.message}"
                            </Typography>
                        )}
                    </Box>

                    {/* Priority and Category */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                            icon={priority.icon}
                            label={`${priority.label} Priority`}
                            size="small"
                            sx={{
                                background: `${priority.color}20`,
                                color: priority.color,
                                border: `1px solid ${priority.color}40`,
                                fontSize: '0.7rem',
                                height: '24px',
                                fontWeight: 600
                            }}
                        />
                        {ticket.category && (
                            <Chip
                                label={ticket.category}
                                size="small"
                                sx={{
                                    background: darkMode ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)',
                                    color: '#9c27b0',
                                    border: `1px solid ${darkMode ? 'rgba(156, 39, 176, 0.4)' : 'rgba(156, 39, 176, 0.3)'}`,
                                    fontSize: '0.7rem',
                                    height: '24px',
                                    fontWeight: 600
                                }}
                            />
                        )}
                    </Box>

                    {/* Timestamp */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Schedule sx={{ fontSize: '1rem', mr: 1, color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }} />
                            <Typography variant="caption" sx={{
                                color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                                fontSize: '0.75rem'
                            }}>
                                {Moment(ticket.createdAt).format('MMM DD, YYYY HH:mm')}
                            </Typography>
                        </Box>
                        <Chip
                            label={status.label}
                            size="small"
                            sx={{
                                background: status.color,
                                color: '#ffffff',
                                fontSize: '0.7rem',
                                height: '20px',
                                fontWeight: 600
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{
            animation: 'fadeInUp 0.8s ease-out',
            '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(30px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
            }
        }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                    background: 'linear-gradient(135deg, #4caf50 0%, #9c27b0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Tickets Management
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        sx={{
                            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                            borderRadius: '12px',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
                            }
                        }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        sx={{
                            background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                            borderRadius: '12px',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                            }
                        }}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            {/* Filters */}
            <Paper sx={{
                mb: 3,
                p: 2,
                background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 30, 40, 0.9) 0%, rgba(40, 40, 50, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 240, 240, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '16px'
            }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search by ID..."
                        value={filter.id}
                        onChange={(e) => setFilter({ ...filter, id: e.target.value })}
                        InputProps={{
                            startAdornment: <Search sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }} />
                        }}
                        sx={{
                            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                            borderRadius: '12px',
                            '& fieldset': {
                                borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                            }
                        }}
                    />
                    
                    <FormControlLabel
                        control={
                            <Switch
                                checked={filter.inactive}
                                onChange={() => setFilter({ ...filter, inactive: !filter.inactive })}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#4caf50'
                                    }
                                }}
                            />
                        }
                        label="Show Closed"
                        sx={{
                            color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
                        }}
                    />
                </Box>
            </Paper>

            {/* Tickets Grid */}
            {data.loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress size={60} sx={{ color: '#4caf50' }} />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {data.tickets.map(ticket => {
                        const fetchedUser = data.users.find(user => user.id == ticket.user);
                        
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={ticket._id}>
                                <TicketCard
                                    ticket={ticket}
                                    fetchedUser={fetchedUser}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Pagination */}
            {!data.loading && data.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        page={data.page}
                        count={data.totalPages}
                        onChange={(e, value) => setData({ ...data, page: value })}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, #4caf50 0%, #9c27b0 100%)',
                                    color: '#ffffff'
                                }
                            }
                        }}
                    />
                </Box>
            )}

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        background: darkMode
                            ? 'linear-gradient(135deg, rgba(30, 30, 40, 0.95) 0%, rgba(40, 40, 50, 0.95) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        borderRadius: '12px',
                        boxShadow: darkMode
                            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                            : '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <MenuItem onClick={() => {
                    if (selectedTicket) {
                        setDialogTicket(selectedTicket);
                    }
                    handleMenuClose();
                }}>
                    <Visibility sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={() => {
                    // Handle edit
                    handleMenuClose();
                }}>
                    <Edit sx={{ mr: 1 }} />
                    Edit Ticket
                </MenuItem>
                <MenuItem onClick={() => {
                    // Handle close
                    handleMenuClose();
                }}>
                    <Delete sx={{ mr: 1 }} />
                    Close Ticket
                </MenuItem>
            </Menu>

            {/* Details Dialog */}
            <Dialog
                open={Boolean(dialogTicket)}
                onClose={() => setDialogTicket(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: darkMode
                            ? 'linear-gradient(135deg, rgba(30, 30, 40, 0.98) 0%, rgba(40, 40, 50, 0.98) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 240, 240, 0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        borderRadius: '20px'
                    }
                }}
            >
                {dialogTicket && (
                    <>
                        <DialogTitle sx={{
                            color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                            fontWeight: 600
                        }}>
                            Ticket Details
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                <strong>Ticket ID:</strong> #{dialogTicket._id}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                <strong>Subject:</strong> {dialogTicket.subject || 'No Subject'}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                <strong>Message:</strong> {dialogTicket.message || 'No Message'}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                <strong>Priority:</strong> {dialogTicket.priority}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                <strong>Status:</strong> {dialogTicket.status}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Created:</strong> {Moment(dialogTicket.createdAt).format('MMMM DD, YYYY HH:mm')}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogTicket(null)}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}