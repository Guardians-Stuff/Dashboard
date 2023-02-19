import React from 'react';
import Router, { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import { SessionProvider, useSession } from 'next-auth/react';
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
        <SessionProvider>
            <PropsProvider auth={Component.auth} serverSideLoading={serverSideLoading}>
                <LayoutProvider Component={Component} pageProps={pageProps} />
            </PropsProvider>
        </SessionProvider>
    );
}

function PropsProvider(props){
    const router = useRouter();
    const dashboard = router.route.startsWith('/dashboard');
    
    /** @type {Boolean} */ const auth = props.auth ?? !!dashboard;
    /** @type {Boolean} */ const serverSideLoading = props.serverSideLoading;
    
    const mobile = !useMediaQuery('(min-width:600px)');
    const { data: session, status } = useSession({ required: auth, onUnauthenticated: () => auth ? router.push('/') : null });

    /** @type {[ Array<Guild>, Function ]} */ const [ guilds, setGuilds ] = React.useState([]);
    React.useEffect(() => {
        async function fetchGuilds(){
            const userGuilds = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds`, { cache: 'no-cache' })
                .then(async response => await response.json())
                .catch(() => []);
            
            setGuilds(userGuilds);
        }

        if(typeof session != 'undefined') fetchGuilds();
    }, [ session ]);

    
    const children = React.Children.map(props.children, child => {
        if(React.isValidElement(child)) return React.cloneElement(child, {
            session: session,
            loading: serverSideLoading || status == 'loading',
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