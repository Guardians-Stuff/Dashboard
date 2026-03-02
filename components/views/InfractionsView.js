import React from 'react';
import Link from 'next/link';
import Moment from 'moment';
import ms from 'ms';

import {
    Alert, Avatar, Box, Button, Card, CardActions, CardContent,
    Checkbox, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Divider, FormControl,
    FormControlLabel, Grid, InputLabel, ListItemText, MenuItem,
    Pagination, Select, Snackbar, Switch, TextField, Typography,
    Paper, Chip, IconButton, Tooltip, LinearProgress,
    Badge, Menu
} from '@mui/material';
import {
    Search, FilterList, MoreVert, Security, Warning,
    Block, Person, Schedule, Refresh, Download,
    Visibility, Edit, Delete
} from '@mui/icons-material';

import TextAvatar from '../TextAvatar';

export default function InfractionsView(props) {
    const { mobile, guild, members, user } = props;
    const [ darkMode, setDarkMode ] = React.useState(true);
    const [ dialogInfraction, setDialogInfraction ] = React.useState(null);
    const [ snackbarData, setSnackbarData ] = React.useState({ open: false, error: false, message: '' });
    const [ data, setData ] = React.useState({
        loading: true,
        users: members || [],
        infractions: [],
        page: 1,
        totalPages: 0
    });
    const [ filter, setFilter ] = React.useState({
        id: '',
        types: [],
        inactive: true
    });
    const [ anchorEl, setAnchorEl ] = React.useState(null);
    const [ selectedInfraction, setSelectedInfraction ] = React.useState(null);

    React.useEffect(() => {
        async function fetchData() {
            if (!guild && !user) {
                setData(prev => ({ ...prev, loading: false }));
                return;
            }

            let url;
            if (guild) {
                url = [
                    '/api/guilds/',
                    guild.id,
                    '/infractions',
                    `?pagination=${data.page}`,
                    filter.id ? `&id=${filter.id}` : '',
                    filter.types.length != 0 ? `&types=${filter.types.join(',')}` : '',
                    !filter.inactive ? '&active=true' : ''
                ].join('');
            } else if (user) {
                url = [
                    '/api/users/',
                    user.id,
                    '/infractions',
                    `?pagination=${data.page}`,
                    filter.types.length != 0 ? `&types=${filter.types.join(',')}` : '',
                    !filter.inactive ? '&active=true' : ''
                ].join('');
            }

            console.log('Fetching infractions from:', url);

            try {
                const tempUsers = [ ...data.users ];
                const response = await fetch(url, { cache: 'no-cache' });
                
                if (!response.ok) {
                    console.error('API response error:', response.status, response.statusText);
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    setData(prev => ({ ...prev, loading: false }));
                    return;
                }
                
                const result = await response.json();
                console.log('API response:', result);
                
                if (result.error) {
                    console.error('API returned error:', result.message);
                    setData(prev => ({ ...prev, loading: false }));
                    return;
                }
                
                const infractions = result.infractions || [];
                const externalIDs = [ ...new Set(infractions.flatMap(entry => entry.user)) ].filter(id => !tempUsers.find(user => user.id == id));
                
                const promises = externalIDs.map(id => 
                    fetch(`${process.env.NEXT_PUBLIC_HOST?.replace('::1', '127.0.0.1') || 'http://127.0.0.1:3000'}/api/users/${id}`, { cache: 'no-cache' })
                    .then(async response => response.json())
                    .catch(error => {
                        console.error('Error fetching user:', id, error);
                        return null;
                    })
                );
                
                const userResults = await Promise.all(promises);
                tempUsers.push(...userResults.filter(user => user !== null));
            
                setData({
                    ...data,
                    loading: false,
                    users: tempUsers,
                    infractions: infractions,
                    totalPages: result.pagination?.totalPages || 0
                });
            } catch (error) {
                console.error('Error fetching infractions:', error);
                setData(prev => ({ ...prev, loading: false }));
            }
        }

        fetchData();
    }, [ guild, user, data.page, filter ]);

    const infractionPopup = (infraction) => {
        setDialogInfraction(infraction);
    };

    const handleMenuClick = (event, infraction) => {
        setAnchorEl(event.currentTarget);
        setSelectedInfraction(infraction);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedInfraction(null);
    };

    const getInfractionColor = (type) => {
        const colors = {
            ban: '#f44336',
            kick: '#ff9800',
            warning: '#ffc107',
            timeout: '#9c27b0',
            block: '#607d8b'
        };
        return colors[type] || '#757575';
    };

    const getInfractionIcon = (type) => {
        const icons = {
            ban: <Block />,
            kick: <Person />,
            warning: <Warning />,
            timeout: <Schedule />,
            block: <Security />
        };
        return icons[type] || <Security />;
    };

    const InfractionCard = ({ infraction, fetchedUser, fetchedIssuer }) => (
        <Card
            sx={{
                background: 'rgba(25, 25, 25, 0.9)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${infraction.active ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'}`,
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: infraction.active
                        ? '0 20px 40px rgba(76, 175, 80, 0.3), 0 0 60px rgba(76, 175, 80, 0.1)'
                        : '0 20px 40px rgba(244, 67, 54, 0.3), 0 0 60px rgba(244, 67, 54, 0.1)',
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
                    background: infraction.active
                        ? 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.2), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(244, 67, 54, 0.2), transparent)',
                    transition: 'left 0.6s ease'
                }
            }}
            onClick={() => infractionPopup(infraction)}
        >
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                    <Badge
                        badgeContent={infraction.active ? 'Active' : 'Inactive'}
                        color={infraction.active ? 'success' : 'error'}
                        sx={{
                            '& .MuiBadge-badge': {
                                background: infraction.active
                                    ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
                                    : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                px: 1
                            }
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        src={fetchedUser?.avatar ? `https://cdn.discordapp.com/avatars/${fetchedUser.id}/${fetchedUser.avatar}.webp?size=64` : null}
                        sx={{
                            width: 48,
                            height: 48,
                            border: `3px solid ${getInfractionColor(infraction.type)}40`,
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
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem'
                        }}>
                            ID: {infraction.user}
                        </Typography>
                    </Box>
                    
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(e, infraction);
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

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        p: 1,
                        borderRadius: '8px',
                        background: `${getInfractionColor(infraction.type)}20`,
                        border: `1px solid ${getInfractionColor(infraction.type)}40`,
                        mr: 2
                    }}>
                        {getInfractionIcon(infraction.type)}
                    </Box>
                    <Box>
                        <Typography variant="body1" sx={{
                            fontWeight: 600,
                            color: getInfractionColor(infraction.type),
                            textTransform: 'capitalize'
                        }}>
                            {infraction.type}
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem'
                        }}>
                            by {fetchedIssuer?.username}#{fetchedIssuer?.discriminator}
                        </Typography>
                    </Box>
                </Box>

                {infraction.reason && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontStyle: 'italic'
                        }}>
                            "{infraction.reason}"
                        </Typography>
                    </Box>
                )}

                {infraction.duration && infraction.duration !== Infinity && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Schedule sx={{ fontSize: '1rem', mr: 1, color: '#ffffff' }} />
                        <Typography variant="body2" sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem'
                        }}>
                            {ms(infraction.duration)}
                            {infraction.expires && ` (Expires: ${Moment(infraction.expires).fromNow()})`}
                        </Typography>
                    </Box>
                )}
                {infraction.duration === Infinity && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Schedule sx={{ fontSize: '1rem', mr: 1, color: '#ffffff' }} />
                        <Typography variant="body2" sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem'
                        }}>
                            Permanent
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{
                        color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        fontSize: '0.75rem'
                    }}>
                        {Moment(infraction.time).format('MMM DD, YYYY HH:mm')}
                    </Typography>
                    <Chip
                        label={infraction.active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                            background: infraction.active
                                ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
                                : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.7rem',
                            height: '20px',
                            fontWeight: 600
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );

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
                    background: 'linear-gradient(135deg, #f44336 0%, #ff9800 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Infractions Management
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
                    
                    <FormControl size="small">
                        <InputLabel>Filter Type</InputLabel>
                        <Select
                            multiple
                            value={filter.types}
                            renderValue={types => types.map(type => type.slice(0, 1).toUpperCase() + type.slice(1)).join(', ')}
                            onChange={(e) => setFilter({ ...filter, types: e.target.value })}
                            sx={{
                                background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                                borderRadius: '12px'
                            }}
                        >
                            {[ 'ban', 'kick', 'warning', 'timeout', 'block' ].map(type => (
                                <MenuItem key={type} value={type}>
                                    <Checkbox checked={filter.types.includes(type)} />
                                    <ListItemText primary={type.slice(0, 1).toUpperCase() + type.slice(1)} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
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
                        label="Show Inactive"
                        sx={{
                            color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
                        }}
                    />
                </Box>
            </Paper>

            {/* Infractions Grid */}
            {data.loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress size={60} sx={{ color: '#f44336' }} />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {data.infractions.length > 0 ? (
                        data.infractions.map(infraction => {
                            const fetchedUser = data.users.find(user => user.id == infraction.user);
                            const fetchedIssuer = data.users.find(user => user.id == infraction.issuer);
                            
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={infraction._id}>
                                    <InfractionCard
                                        infraction={infraction}
                                        fetchedUser={fetchedUser}
                                        fetchedIssuer={fetchedIssuer}
                                    />
                                </Grid>
                            );
                        })
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                minHeight: '400px',
                                textAlign: 'center',
                                p: 4
                            }}>
                                <Security sx={{ 
                                    fontSize: 80, 
                                    color: 'rgba(255, 255, 255, 0.3)', 
                                    mb: 2 
                                }} />
                                <Typography variant="h6" sx={{ 
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    mb: 1,
                                    fontWeight: 600
                                }}>
                                    No Infractions Found
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    maxWidth: 400
                                }}>
                                    {filter.id || filter.types.length > 0 || !filter.inactive
                                        ? 'Try adjusting your filters to see more results.'
                                        : 'Great job! Your server has no infractions recorded.'}
                                </Typography>
                                {filter.id || filter.types.length > 0 || !filter.inactive ? (
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            mt: 2,
                                            borderColor: 'rgba(255, 255, 255, 0.3)',
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            '&:hover': {
                                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                                background: 'rgba(255, 255, 255, 0.05)'
                                            }
                                        }}
                                        onClick={() => setFilter({ id: '', types: [], inactive: true })}
                                    >
                                        Clear Filters
                                    </Button>
                                ) : null}
                            </Box>
                        </Grid>
                    )}
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
                                    background: 'linear-gradient(135deg, #f44336 0%, #ff9800 100%)',
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
                    if (selectedInfraction) {
                        setDialogInfraction(selectedInfraction);
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
                    Edit Infraction
                </MenuItem>
                <MenuItem onClick={() => {
                    // Handle delete
                    handleMenuClose();
                }}>
                    <Delete sx={{ mr: 1 }} />
                    Delete Infraction
                </MenuItem>
            </Menu>

            {/* Details Dialog */}
            <Dialog
                open={Boolean(dialogInfraction)}
                onClose={() => setDialogInfraction(null)}
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
                {dialogInfraction && (
                    <>
                        <DialogTitle sx={{
                            color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                            fontWeight: 600
                        }}>
                            Infraction Details
                        </DialogTitle>
                        <DialogContent>
                            {/* Dialog content would go here */}
                            <Typography>Infraction ID: {dialogInfraction._id}</Typography>
                            <Typography>Type: {dialogInfraction.type}</Typography>
                            <Typography>Reason: {dialogInfraction.reason}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogInfraction(null)}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarData.open}
                autoHideDuration={6000}
                onClose={() => setSnackbarData({ ...snackbarData, open: false })}
            >
                <Alert
                    severity={snackbarData.error ? 'error' : 'success'}
                    onClose={() => setSnackbarData({ ...snackbarData, open: false })}
                >
                    {snackbarData.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}