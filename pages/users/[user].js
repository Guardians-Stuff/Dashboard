import React from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';

import { Avatar, Divider, Grid, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';

import Layout from '@/components/Layout';
import NitroIcon from '@/components/icons/NitroIcon';

export default function UserPage(props) {
    /** @type {import('next-auth').Session} */ const session = props.session;
    /** @type {Boolean} */ const loading = props.loading;
    /** @type {User} */ const user = props.user;

    const router = useRouter();
    if(!guild && typeof window !== 'undefined') router.push('/dashboard');

    return loading || !user ? <Layout loading title='Viewing Profile' session={session}></Layout> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', height: '100%' }}>
                <Layout title='Viewing Profile' session={session}>
                    <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Avatar src={`${user.displayAvatarURL}?size=256`} sx={{ width: 128, height: 128 }} />
                        <Typography variant="h2">{user.username}#{user.discriminator}</Typography>
                        {/* <NitroIcon sx={{ fontSize: 40 }}/> */}
                        <Divider style={{ width: '100%', marginBottom: '50px' }}></Divider>
                    </Box>
                </Layout>
            </Box>
        </>
    );
}
UserPage.auth = true;

export async function getServerSideProps(context){
    const user = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${context.params.user}`, { cache: 'no-cache', headers: { 'Cookie': context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => null);

    return { props: { user: user } };
}