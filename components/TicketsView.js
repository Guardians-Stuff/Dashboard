import Moment from 'moment';

import { Avatar, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';

export default function TicketsView(props){
    /** @type {Guild} */ const guild = props.guild;
    /** @type {Array<import("@/schemas/Tickets").Ticket>} */ const tickets = props.tickets;
    /** @type {Array<GuildMember | User>} */ const users = props.users;

    return (
        <Grid container spacing={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
            { tickets.map(ticket => {
                const fetchedUser = users.find(user => user.id == ticket.user);

                return (
                    <Grid item key={ticket._id} sx={{ minWidth: '281px' }}>
                        <Link href={`/guilds/${guild.id}/tickets/${ticket._id}`}>
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
    );
}