import '@/styles/globals.css';

import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import '@/styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useRouter } from 'next/router';
import React from 'react';
import { useMediaQuery } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        blurple: {
            main: '#5865F2',
            dark: '#4f5bda',
            contrastText: '#fff'
        },
        background: {
            default: '#36393e',
            paper: '#36393e'
        }
    },
    typography: {
        subtitle2: {
            fontWeight: 300
        }
    }
});

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <PropsFetcher auth={Component.auth}><Component {...pageProps}/></PropsFetcher>
            </ThemeProvider>
        </SessionProvider>
    );
}

function PropsFetcher(props){
    /** @type {Boolean} */ const auth = props.auth;
    
    const router = useRouter();
    const mobile = !useMediaQuery('(min-width:600px)');
    const { data: session, status } = useSession({ required: auth, onUnauthenticated: () => auth ? router.push('/') : null });

    const children = React.Children.map(props.children, child => {
        if(React.isValidElement(child)) return React.cloneElement(child, {
            session: session,
            loading: status != 'authenticated',
            mobile: mobile
        });
        return child;
    });

    return children;
}