import Link from 'next/link';
import { styled } from '@mui/material/styles';

import { Box } from '@mui/system';
import { AppBar, MenuItem, Toolbar, Typography } from '@mui/material';

import AppBarUser from '../AppBarUser';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
}));

export default function HomeLayout(props) {
    /** @type {import('next-auth').Session} */ const session = props.session;
    /** @type {Boolean} */ const mobile = props.mobile;

    return (
        <>
            <AppBar position='fixed'>
                <Toolbar>
                    <MenuItem>
                        <Link href='/'>
                            <Typography variant='h7' noWrap component="div">Home</Typography>
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href='/commands'>
                            <Typography variant='h7' noWrap component="div">Commands</Typography>
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href='/changelog'>
                            <Typography variant='h7' noWrap component="div">Changelog</Typography>
                        </Link>
                    </MenuItem>

                    <Box sx={{ flexGrow: 1 }}></Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <AppBarUser showDashboard session={session} mobile={mobile} />
                    </Box>
                </Toolbar>

            </AppBar>
            <main style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'scroll' }}>
                <DrawerHeader />
                {props.children}
            </main>
        </>
    );
}