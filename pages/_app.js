import React from 'react';
import Router, { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import HomeLayout from '@/components/layouts/HomeLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import CssBaseline from '@mui/material/CssBaseline';
import '@/styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export default function App({ Component, pageProps: { ...pageProps } }) {
    return (
        <SessionProvider>
            <PropsProvider auth={Component.auth}>
                <LayoutProvider Component={Component} pageProps={pageProps} />
            </PropsProvider>
        </SessionProvider>
    );
}

function PropsProvider(props){
    const router = useRouter();
    const dashboard = router.route.startsWith('/dashboard');
    
    /** @type {Boolean} */ const auth = props.auth ?? !!dashboard;
    
    const mobile = !useMediaQuery('(min-width:600px)');
    const { data: session, status } = useSession({ required: auth, onUnauthenticated: () => auth ? router.push('/') : null });

    /** @type {[ Array<Guild>, Function ]} */ const [ guilds, setGuilds ] = React.useState([]);
    React.useEffect(() => {
        async function fetchGuilds(){
            // Don't redirect if we're already on an auth page to avoid loops
            if(router.pathname.startsWith('/api/auth')) return;
            
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/guilds`, { cache: 'no-cache' });
                
                // Only redirect to sign in if we get 403 (unauthorized) - meaning session is invalid
                if(response.status === 403) {
                    return router.push('/api/auth/signin');
                }
                
                if(!response.ok) {
                    // Other errors (500, etc.) - don't redirect, just don't set guilds
                    console.error('Failed to fetch guilds:', response.status);
                    return;
                }
                
                const userGuilds = await response.json();
                if(userGuilds) {
                    setGuilds(userGuilds);
                }
            } catch(error) {
                // Network errors or other issues - don't redirect, just log
                console.error('Error fetching guilds:', error);
            }
        }

        if(session && status === 'authenticated'){
            // Only check for critical authentication errors
            if(session.error === 'RefreshAccessTokenError') {
                // Token refresh failed, need to re-authenticate
                return router.push('/api/auth/signin');
            }
            fetchGuilds();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ session, status ]);
    
    const children = React.Children.map(props.children, child => {
        if(React.isValidElement(child)) return React.cloneElement(child, {
            session: session,
            loading: status == 'loading',
            mobile: mobile,
            dashboard: dashboard,
            guilds: guilds
        });
        
        return child;
    });
    
    return children;
}

function LayoutProvider(props){
    const Component = props.Component;
    /** @type {Boolean} */ const dashboard = props.dashboard;

    const theme = createTheme({
        palette: {
            mode: 'dark',
            blurple: {
                main: '#5865F2',
                dark: '#4f5bda',
                contrastText: '#fff'
            },
            background: {
                default: dashboard ? '#36393e' : '#000000',
                paper: dashboard ? '#36393e' : '#000000'
            }
        },
        typography: {
            subtitle2: {
                fontWeight: 300
            }
        }
    });
    
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            { dashboard ?
                <DashboardLayout {...props}>
                    <Component {...props} {...props.pageProps} />
                </DashboardLayout>
                :
                <HomeLayout {...props}>
                    <Component {...props} {...props.pageProps} />
                </HomeLayout>
            }
        </ThemeProvider>
    );
}