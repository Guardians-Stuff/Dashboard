import Moment from 'moment';
import Link from 'next/link';

import { Avatar, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

export default function GuildsView(props){
    /** @type {Array<Guild>} */ const guilds = props.guilds;

    return (
        <Grid container spacing={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
            {guilds.map(guild => {
                return (
                    <Grid item key={guild.id} sx={{ maxWidth: '180px' }}>
                        <Link href={`/dashboard/guilds/${guild.id}`}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Avatar src={guild.iconURL} sx={{ height: '64px', width: '64px' }} />
                                        <Typography variant='h7'>{guild.name}</Typography>
                                        <Typography variant='subtitle2'>{guild.id}</Typography>

                                        {/* <Divider sx={{ width: '100%', margin: '10px 0 10px 0' }} /> */}

                                        {/* <Typography variant='h7' style={{ color: ticket.active ? 'lime' : 'tomato' }}>{ticket.active ? 'Active' : 'Inactive'}</Typography>
                                        <Typography variant='subtitle2'>Created At: {Moment(ticket.time).format('DD/MM/YYYY hh:mm:ss A')}</Typography>
                                        <Typography variant='subtitle2'>Last Message: {ticket.messages.length == 0 ? 'None' : Moment([ ...ticket.messages ].pop().time).format('DD/MM/YYYY hh:mm:ss A')}</Typography> */}
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