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
            const userGuilds = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/guilds`, { cache: 'no-cache' })
                .then(async response => await response.json())
                .catch(() => null);
            
            if(!userGuilds) return router.push(`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_HOST)}%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify%20guilds`);
            setGuilds(userGuilds);
        }

        if(session){
            if(session.error) return router.push(`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_HOST)}%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify%20guilds`);
            fetchGuilds();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ session ]);
    
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