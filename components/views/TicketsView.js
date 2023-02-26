import React from 'react';
import Link from 'next/link';
import Moment from 'moment';

import { Avatar, Card, CardContent, Checkbox, CircularProgress, Divider, FormControl, Grid, InputLabel, ListItemText, MenuItem, Pagination, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';

export default function TicketsView(props){
    /** @type {Guild} */ const guild = props.guild;

    const [ data, setData ] = React.useState({
        loading: true,
        users: props.members,
        tickets: [],
        page: 1,
        totalPages: 0
    });
    
    React.useEffect(() => {
        async function fetchData(pagination = 1){
            const tempUsers = [ ...data.users ];

            const response = (await fetch(`/api/guilds/${guild.id}/tickets?pagination=${pagination}`, { cache: 'no-cache' }).then(response => response.json()));
            /** @type {Array<import('@/schemas/Tickets').Ticket>} */ const tickets = response.tickets;

            /** @type {Array<string>} */ const externalIDs = [ ...new Set(tickets.flatMap(entry => entry.user )) ].filter(id => !tempUsers.find(user => user.id == id));
            /** @type {Array<GuildMember | Promise<User>>} */ const promises = externalIDs.map(id => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${id}`, { cache: 'no-cache' }).then(async response => response.json()));
            
            tempUsers.push(...await Promise.all(promises));
        
            setData({
                ...data,
                loading: false,
                users: tempUsers,
                tickets: tickets,
                totalPages: response.pagination.totalPages
            });
        }

        setData({ ...data, loading: true });
        fetchData(data.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data.page ]);

    return data.loading ?
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
        :
        <>
            {/* TODO: FILTERING */}
            {/* <Box sx={{ width: '100%', display: 'flex', marginBottom: 2 }}>
                <TextField variant='standard' label='Filter ID' sx={{ width: '100%' }}></TextField>
                <FormControl>
                    <InputLabel id='type-label'>Filter Type</InputLabel>
                    <Select labelId='type-label' multiline variant='standard' value='' sx={{ width: 135, marginLeft: 1 }}>
                        {[ 'Ban', 'Kick', 'Warning', 'Timeout' ].map(type => (
                            <MenuItem key={type} value={type}>
                                <Checkbox checked />
                                <ListItemText primary={type} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box> */}

            <Grid container spacing={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                { data.tickets.map(ticket => {
                    const fetchedUser = data.users.find(user => user.id == ticket.user);

                    return (
                        <Grid item key={ticket._id} sx={{ minWidth: '281px' }}>
                            <Link href={`/dashboard/guilds/${guild.id}/tickets/${ticket._id}`}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Avatar src={fetchedUser.displayAvatarURL} sx={{ height: '64px', width: '64px' }} />
                                            <Typography variant='h7'>{fetchedUser.username}#{fetchedUser.discriminator}</Typography>
                                            <Typography variant='subtitle2'>{ticket._id}</Typography>

                                            <Divider sx={{ width: '100%', margin: '10px 0 10px 0' }} />

                                            <Typography variant='h7' style={{ color: ticket.active ? 'lime' : 'tomato' }}>{ticket.active ? 'Active' : 'Inactive'}</Typography>
                                            <Typography variant='subtitle2'>Created At: {Moment(ticket.time).format('DD/MM/YYYY hh:mm:ss A')}</Typography>
                                            <Typography variant='subtitle2'>Last Message: {ticket.messages.length == 0 ? 'None' : Moment([ ...ticket.messages ].pop().time).format('DD/MM/YYYY hh:mm:ss A')}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    );
                }) }
            </Grid>

            <br/><br/>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination page={data.page} count={data.totalPages} onChange={(e, value) => setData({ ...data, page: value })}></Pagination>
            </Box>
        </>;
}