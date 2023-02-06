import React from 'react';
import Moment from 'moment';
import ms from 'ms';
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/router';

import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, Dialog, DialogTitle, Divider, Snackbar, Typography, useMediaQuery } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

export default function InfractionsDataGrid(props) {
    /** @type {Boolean} */ const mobile = props.mobile;
    /** @type {Array<User>} */ const users = props.users;

    /** @type {[Array<import('@/schemas/Infractions').Infraction>, Function]} */ const [ infractions, setInfractions ] = React.useState(props.infractions);
    /** @type {[ import('@/schemas/Infractions').Infraction, Function ]} */ const [ dialogInfraction, setDialogInfraction ] = React.useState(null);
    const [ snackbarData, setSnackbarData ] = React.useState({ open: false, error: false, message: '' });

    const getUser = (/** @type {string} */ id) => {
        const user = users.find(user => user.id == id);
        if(user) return user;

        return { id: id, error: true };
    };
    
    /**
     * @param {import('@/schemas/Infractions').Infraction} infraction
     */
    const infractionPopup = infraction => {
        setDialogInfraction({
            ...infraction,
            fetchedUser: getUser(infraction.user),
            fetchedIssuer: getUser(infraction.issuer)
        });
    };
    
    
    /**
     * @param {import('@/schemas/Infractions').Infraction} infraction
     */
    const setInactive = async infraction => {
        const response = await fetch(`/api/infractions/${infraction.id}/inactive`);
        const json = await response.json();

        if(!json.error){
            const updatedInfraction = infraction;
            updatedInfraction.active = false;

            delete updatedInfraction.fetchedUser;
            delete updatedInfraction.fetchedIssuer;

            infractionPopup(updatedInfraction);

            const updatedInfractions = [ ...infractions ];
            updatedInfractions[updatedInfractions.findIndex(infraction => infraction.id == updatedInfraction.id)] = updatedInfraction;

            setInfractions(updatedInfractions);
        }

        setSnackbarData({ open: true, error: json.error, message: json.message });
    };

    /**
     * @param {import('@/schemas/Infractions').Infraction} infraction
     */
    const deleteLog = async infraction => {
        const response = await fetch(`/api/infractions/${infraction.id}/delete`);
        const json = await response.json();

        if(!json.error){
            setDialogInfraction(null);
            setInfractions(infractions.filter(i => i.id != infraction.id));
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
                            <Avatar src={dialogInfraction?.fetchedUser?.displayAvatarURL} />
                            <Typography variant='h7'>{dialogInfraction?.fetchedUser?.username}#{dialogInfraction?.fetchedUser?.discriminator}</Typography>
                        </Box>

                        <Divider sx={{ width: '100%', margin: '10px 0 10px 0' }} />
                        <table>
                            <tr>
                                <td><Typography variant='h7' sx={{ marginRight: 1 }}>Issuer:</Typography></td>
                                <td>
                                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={dialogInfraction?.fetchedIssuer?.displayAvatarURL} sx={{ width: 24, height: 24, marginRight: 1 }}></Avatar>
                                        <Typography variant='h7'>{dialogInfraction?.fetchedIssuer?.username}#{dialogInfraction?.fetchedIssuer?.discriminator}</Typography>
                                    </Box>
                                </td>
                            </tr>
                            <tr>
                                <td><Typography variant='h7'>Issued At:ㅤ</Typography></td>
                                <td><Typography variant='h7'>{Moment(dialogInfraction?.time).format('DD/MM/YYYY hh:mm:ss A')}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant='h7'>Expires:</Typography></td>
                                <td><Typography variant='h7'>{Moment(dialogInfraction?.expires).format('DD/MM/YYYY hh:mm:ss A')}</Typography></td>
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
                        <Button size="small"><Link href={`/guilds/${dialogInfraction?.guild}/members/${dialogInfraction?.user}`}>View User</Link></Button>
                        <Button size="small" sx={{ marginRight: 'auto' }}><Link href={`/guilds/${dialogInfraction?.guild}/members/${dialogInfraction?.issuer}`}>View Issuer</Link></Button>
                        <Button size="small" onClick={() => deleteLog(dialogInfraction)} sx={{ color: 'tomato' }}>Delete Log</Button>
                    </CardActions>
                </Card>
            </Dialog>
            <Box sx={{
                height: '90%',
                width: '100%',
                '& .inactive > [data-field="active"] > svg': {
                    color: 'red'
                },
                '& .active > [data-field="active"] > svg': {
                    color: 'lime'
                }
            }}>
                <DataGrid
                    rows={infractions}
                    pageSize={15}
                    disableSelectionOnClick
                    onRowClick={params => infractionPopup(params.row)}
                    getRowClassName={params => params.row.active ? 'active' : 'inactive'}
                    columns={[
                        {
                            field: 'actions',
                            type: 'actions',
                            width: 0,
                            getActions: params => [
                                <GridActionsCellItem
                                    icon={<DeleteIcon color='tomato' />}
                                    key='delete'
                                    label='Delete'
                                    onClick={() => deleteLog(params.row)}
                                />
                            ]
                        },
                        {
                            field: 'active',
                            type: 'boolean',
                            headerName: 'Active',
                            headerAlign: 'center',
                            width: 55
                        },
                        {
                            field: 'type',
                            headerName: 'Type',
                            headerAlign: 'center',
                            width: 73,
                            sortable: false
                        },
                        {
                            field: 'user',
                            headerName: 'User',
                            headerAlign: 'center',
                            minWidth: 173,
                            flex: 1,
                            sortable: false,
                            renderCell: params => {
                                const user = getUser(params.row.user);

                                return (
                                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={user.displayAvatarURL} sx={{ marginRight: 1 }}/>
                                        {user.username}#{user.discriminator}
                                    </Box>
                                );
                            }
                        },
                        {
                            field: 'issuer',
                            headerName: 'Issuer',
                            headerAlign: 'center',
                            minWidth: 173,
                            flex: 1,
                            sortable: false,
                            renderCell: params => {
                                const user = getUser(params.row.issuer);

                                return (
                                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={user.displayAvatarURL} sx={{ marginRight: 1 }}/>
                                        {user.username}#{user.discriminator}
                                    </Box>
                                );
                            }
                        },
                        {
                            field: 'duration',
                            headerName: 'Duration',
                            headerAlign: 'center',
                            width: 200,
                            valueGetter: params => params.row.duration !== null ? ms(params.row.duration, { long: true }) : 'Permenant',
                            sortComparator: (v1, v2) => ms(v1) - ms(v2)
                        },
                        {
                            field: 'expires',
                            headerName: 'Expires',
                            headerAlign: 'center',
                            minWidth: 180,
                            valueGetter: params => params.row.expires !== null ? Moment(params.row.expires).format('DD/MM/YYYY hh:mm:ss A') : 'N/A',
                            sortComparator: (v1, v2) => Moment(v1, 'DD/MM/YYYY hh:mm:ss A').valueOf() - Moment(v2, 'DD/MM/YYYY hh:mm:ss A').valueOf()
                        },
                        {
                            field: 'time',
                            headerName: 'Issued At',
                            headerAlign: 'center',
                            minWidth: 180,
                            valueGetter: params => params.row.time !== null ? Moment(params.row.time).format('DD/MM/YYYY hh:mm:ss A') : 'N/A',
                            sortComparator: (v1, v2) => Moment(v1, 'DD/MM/YYYY hh:mm:ss A').valueOf() - Moment(v2, 'DD/MM/YYYY hh:mm:ss A').valueOf()
                        },
                        {
                            field: 'reason',
                            headerName: 'Reason',
                            flex: 2,
                            minWidth: 500
                        }
                    ]}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                duration: !mobile,
                                expires: !mobile,
                                time: !mobile,
                                reason: !mobile
                            }
                        }
                    }}
                />
            </Box>
        </>
    );
}