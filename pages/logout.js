import { signOut } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
    
export default function LogoutPage() {
    React.useEffect(() => {
        signOut({ callbackUrl: '/' });
    }, []);

    return (
        <>
            <Head>
                <title>Guardian Dashboard - Logging out...</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </>
    );
}