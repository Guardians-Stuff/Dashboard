import React from 'react';
import Router, { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import '@/styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

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
    /** @type {[Boolean, Function]} */ const [ serverSideLoading, setServerSideLoading ] = React.useState(false);

    React.useEffect(() => {
        const start = () => setServerSideLoading(true);
        const end = () => setServerSideLoading(false);

        Router.events.on('routeChangeStart', start);
        Router.events.on('routeChangeComplete', end);
        Router.events.on('routeChangeError', end);
        
        return () => {
            Router.events.off('routeChangeStart', start);
            Router.events.off('routeChangeComplete', end);
            Router.events.off('routeChangeError', end);
        };
    }, []);

    return (
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <PropsFetcher auth={Component.auth} serverSideLoading={serverSideLoading}><Component {...pageProps}/></PropsFetcher>
            </ThemeProvider>
        </SessionProvider>
    );
}

function PropsFetcher(props){
    /** @type {Boolean} */ const auth = props.auth;
    /** @type {Boolean} */ const serverSideLoading = props.serverSideLoading;
    
    const router = useRouter();
    const mobile = !useMediaQuery('(min-width:600px)');
    const { data: session, status } = useSession({ required: auth, onUnauthenticated: () => auth ? router.push('/') : null });

    const children = React.Children.map(props.children, child => {
        if(React.isValidElement(child)) return React.cloneElement(child, {
            session: session,
            loading: serverSideLoading || status == 'loading',
            mobile: mobile
        });
        return child;
    });

    return children;
}