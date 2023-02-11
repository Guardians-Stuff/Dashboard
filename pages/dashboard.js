import React from 'react';
import Head from 'next/head';

export default function DashboardPage(props) {
    return (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </>
    );
}
DashboardPage.auth = true;