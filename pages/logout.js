import { signOut } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
    
export default function Home() {
    React.useState(() => {
        signOut({ callbackUrl: '/' });
    }, []);

    return (
        <Head>
            <title>Guardian Dashboard</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}