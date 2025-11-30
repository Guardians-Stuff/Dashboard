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
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateCursor = (e) => {
            const cursor = document.querySelector('.custom-cursor');
            const cursorRing = document.querySelector('.custom-cursor-ring');
            if (cursor && cursorRing) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                cursorRing.style.left = e.clientX + 'px';
                cursorRing.style.top = e.clientY + 'px';
            }
        };

        // Create cursor elements
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = 'position: fixed; width: 8px; height: 8px; background: #ffffff; border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); transition: transform 0.1s ease-out; box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);';
        
        const cursorRing = document.createElement('div');
        cursorRing.className = 'custom-cursor-ring';
        cursorRing.style.cssText = 'position: fixed; width: 20px; height: 20px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); transition: transform 0.15s ease-out;';
        
        document.body.appendChild(cursor);
        document.body.appendChild(cursorRing);

        document.addEventListener('mousemove', updateCursor);
        
        // Add hover effect for interactive elements
        const handleMouseEnter = () => {
            if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            if (cursorRing) cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
        };
        const handleMouseLeave = () => {
            if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            if (cursorRing) cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        };

        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [tabindex], .MuiCard-root, .MuiListItemButton-root');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            document.removeEventListener('mousemove', updateCursor);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
            if (cursorRing.parentNode) cursorRing.parentNode.removeChild(cursorRing);
        };
    }, []);

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
                    // Error is logged server-side, no need to log here
                    return;
                }
                
                const userGuilds = await response.json();
                if(userGuilds) {
                    setGuilds(userGuilds);
                }
            } catch(error) {
                // Network errors or other issues - don't redirect
                // Error is logged server-side, no need to log here
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
                default: dashboard ? '#1a1a1a' : '#000000',
                paper: dashboard ? '#1e1e1e' : '#000000'
            },
            text: {
                primary: dashboard ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                secondary: dashboard ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.7)'
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