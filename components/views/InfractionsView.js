import React from 'react';
import Link from 'next/link';
import Moment from 'moment';
import ms from 'ms';

import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, Checkbox, CircularProgress, Dialog, Divider, FormControl, FormControlLabel, Grid, InputLabel, ListItemText, MenuItem, Pagination, Select, Snackbar, Switch, TextField, Typography } from '@mui/material';

import TextAvatar from '../TextAvatar';

export default function InfractionsView(props) {
    /** @type {Boolean} */ const mobile = props.mobile;
    /** @type {Guild} */ const guild = props.guild;
    /** @type {Array<GuildMember>} */ const members = props.members;
    /** @type {User} */ const user = props.user;

    /** @type {[ import('@/schemas/Infractions').Infraction, Function ]} */ const [ dialogInfraction, setDialogInfraction ] = React.useState(null);
    const [ snackbarData, setSnackbarData ] = React.useState({ open: false, error: false, message: '' });
    const [ data, setData ] = React.useState({
        loading: true,
        users: user ? [ user ] : members,
        infractions: [],
        page: 1,
        totalPages: 0
    });
    const [ filter, setFilter ] = React.useState({
        id: '',
        types: [],
        inactive: true
    });

    React.useEffect(() => {
        async function fetchData(){
            const url = [
                '/api/',
                guild ? `guilds/${guild.id}/infractions` : '',
                user ? `users/${user.id}/infractions` : '',
                `?pagination=${data.page}`,
                filter.id ? `&id=${filter.id}` : '',
                filter.types.length != 0 ? `&types=${filter.types.join(',')}` : '',
                !filter.inactive ? '&active=true' : ''
            ].join('');

            const tempUsers = [ ...data.users ];

            const response = (await fetch(url, { cache: 'no-cache' }).then(response => response.json()));
            /** @type {Array<import('@/schemas/Infractions').Infraction>} */ const infractions = response.infractions;

            /** @type {Array<string>} */ const externalIDs = [ ...new Set(infractions.flatMap(entry => entry.user )) ].filter(id => !tempUsers.find(user => user.id == id));
            /** @type {Array<GuildMember | Promise<User>>} */ const promises = externalIDs.map(id => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${id}`, { cache: 'no-cache' }).then(async response => response.json()));
            
            tempUsers.push(...await Promise.all(promises));
        
            setData({
                ...data,
                loading: false,
                users: tempUsers,
                infractions: infractions,
                totalPages: response.pagination.totalPages
            });
        }

        setData({ ...data, loading: true });
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data.page, filter ]);

    /**
     * @param {import('@/schemas/Infractions').Infraction} infraction
     */
    const infractionPopup = infraction => {
        setDialogInfraction({
            ...infraction,
            fetchedUser: data.users.find(user => user.id == infraction.user),
            fetchedIssuer: data.users.find(user => user.id == infraction.issuer)
        });
    };
    
    /**
     * @param {import('@/schemas/Infractions').Infraction} infraction
     */
    const setInactive = async infraction => {
        const response = await fetch(`/api/infractions/${infraction._id}/inactive`);
        const json = await response.json();

        if(!json.error){
            const updatedInfraction = infraction;
            updatedInfraction.active = false;

            delete updatedInfraction.fetchedUser;
            delete updatedInfraction.fetchedIssuer;

            infractionPopup(updatedInfraction);

            const updatedInfractions = [ ...data.infractions ];
            updatedInfractions[updatedInfractions.findIndex(infraction => infraction._id == updatedInfraction._id)] = updatedInfraction;

            setData({ ...data, infractions: updatedInfractions });
        }

        setSnackbarData({ open: true, error: json.error, message: json.message });
    };

    /**
     * @param {import('@/schemas/Infractions').Infraction} infraction
     */
    const deleteLog = async infraction => {
        const response = await fetch(`/api/infractions/${infraction._id}/delete`);
        const json = await response.json();

        if(!json.error){
            setDialogInfraction(null);
            setData({ ...data, infractions: data.infractions.filter(i => i._id != infraction._id) });
        }

        setSnackbarData({ open: true, error: json.error, message: json.message });
    };

    return (
        <>
            <Snackbar open={snackbarData.open} autoHideDuration={3000} onClose={() => setSnackbarData({ ...snackbarData, open: false })}>
                <Alert onClose={() => setSnackbarData({ ...snackbarData, open: false })} severity={snackbarData.error ? 'error' : 'success'} sx={{ width: '100%' }}>
                    {snackbarData.message}
                </Alert>
            </Snackbar>

            <Dialog fullWidth onClose={() => setDialogInfraction(null)} open={!!dialogInfraction} transitionDuration={{ appear: 0, exit: 0, enter: 100 }}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <TextAvatar variant='column' src={`${dialogInfraction?.fetchedUser?.displayAvatarURL}?size=40`} typography='h7' size='40px'>{dialogInfraction?.fetchedUser?.username}#{dialogInfraction?.fetchedUser?.discriminator}</TextAvatar>
                        </Box>

                        <Divider sx={{ width: '100%', margin: '10px 0 10px 0' }} />

                        <table>
                            <tr>
                                <td><Typography variant='h7' sx={{ marginRight: 1 }}>Issuer:</Typography></td>
                                <td>
                                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                                        <TextAvatar variant='inline' src={`${dialogInfraction?.fetchedIssuer?.displayAvatarURL}?size=24`} typography='h7' size='24px'>{dialogInfraction?.fetchedIssuer?.username}#{dialogInfraction?.fetchedIssuer?.discriminator}</TextAvatar>
                                    </Box>
                                </td>
                            </tr>
                            <tr>
                                <td><Typography variant='h7'>Issued At:ㅤ</Typography></td>
                                <td><Typography variant='h7'>{Moment(dialogInfraction?.time).format('DD/MM/YYYY hh:mm:ss A')}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant='h7'>Expires:</Typography></td>
                                <td><Typography variant='h7'>{dialogInfraction?.expires !== null ? Moment(dialogInfraction?.expires).format('DD/MM/YYYY hh:mm:ss A') : 'Permenant'}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant='h7'>Type:</Typography></td>
                                <td><Typography variant='h7'>{dialogInfraction?.type?.slice(0, 1).toUpperCase() + dialogInfraction?.type?.slice(1)}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant='h7'>Duration:</Typography></td>
                                <td><Typography variant='h7'>{dialogInfraction?.duration !== null ? ms(dialogInfraction?.duration ?? 0, { long: true }) : 'Permenant'}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant='h7'>Reason:</Typography></td>
                                <td><Typography variant='h7'>{dialogInfraction?.reason}</Typography></td>
                            </tr>
                        </table>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => setInactive(dialogInfraction)} sx={{ display: dialogInfraction?.active ? 'block' : 'none' }}>Set Inactive</Button>
                        <Button size="small"><Link href={`/dashboard/users/${dialogInfraction?.user}`}>View User</Link></Button>
                        <Button size="small" sx={{ marginRight: 'auto' }}><Link href={`/dashboard/users/${dialogInfraction?.issuer}`}>View Issuer</Link></Button>
                        <Button size="small" onClick={() => deleteLog(dialogInfraction)} sx={{ color: 'tomato' }}>Delete Log</Button>
                    </CardActions>
                </Card>
            </Dialog>

            <Grid container spacing={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                <Grid item sm={12}>
                    { mobile && !user ?
                        <form style={{ width: '100%', display: 'flex', marginBottom: 2 }}>
                            <TextField
                                variant='standard'
                                label='Filter ID'
                                defaultValue={filter.id}
                                onBlur={e => setFilter({ ...filter, id: e.target.value })}
                                sx={{ width: '100%', marginBottom: 2 }}
                            ></TextField>
                        </form>
                        : ''
                    }
                    <form style={{ display: 'flex', marginBottom: 2, justifyContent: 'center' }}>
                        { !mobile && !user ?
                            <TextField
                                variant='standard'
                                label='Filter ID'
                                defaultValue={filter.id}
                                onBlur={e => setFilter({ ...filter, id: e.target.value })}
                            ></TextField>
                            : ''
                        }
                        <FormControl sx={{ width: '135px' }}>
                            <InputLabel id='type-label'>Filter Type</InputLabel>
                            <Select
                                variant='standard'
                                multiple
                                value={filter.types}
                                renderValue={types => types.map(type => type.slice(0, 1).toUpperCase() + type.slice(1)).join(', ')}
                                labelId='type-label'
                                onChange={e => setFilter({ ...filter, types: e.target.value })}
                                sx={{ marginLeft: 1 }}
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
                            control={<Switch checked={filter.inactive} />}
                            label='Show Inactive'
                            labelPlacement='top'
                            onChange={() => setFilter({ ...filter, inactive: !filter.inactive })}
                        />
                    </form>
                </Grid>
                { data.loading ?
                    <Grid item>
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                    </Grid>
                    :
                    data.infractions.map(infraction => {
                        const fetchedUser = data.users.find(user => user.id == infraction.user);
                        const fetchedIssuer = data.users.find(user => user.id == infraction.issuer);
                        
                        return (
                            <Grid item
                                key={infraction._id}
                                sx={{ minWidth: '281px' }}
                                onClick={() => infractionPopup(infraction)}
                            >
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <TextAvatar variant='column' src={`${fetchedUser.displayAvatarURL}?size=64`} typography='h7' size='64px'>{fetchedUser.username}#{fetchedUser.discriminator}</TextAvatar>
                                            <Typography variant='subtitle2'>{infraction._id}</Typography>

                                            <Divider sx={{ width: '100%', margin: '10px 0 10px 0' }} />

                                            <Typography variant='h7' style={{ color: infraction.active ? 'lime' : 'tomato' }}>{infraction.active ? 'Active' : 'Inactive'}</Typography>
                                            
                                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant='subtitle2' sx={{ marginRight: '3px' }}>{infraction.type.slice(0, 1).toUpperCase() + infraction.type.slice(1)} from:</Typography>
                                                <TextAvatar variant='inline' src={`${fetchedUser.displayAvatarURL}?size=24`} typography='subtitle2' size='24px' margin='3px'>{fetchedUser.username}#{fetchedUser.discriminator}</TextAvatar>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>

            <br/><br/>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination page={data.page} count={data.totalPages} onChange={(e, value) => setData({ ...data, page: value })}></Pagination>
            </Box>
        </>
    );
}