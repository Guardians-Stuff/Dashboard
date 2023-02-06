import React from 'react';
import Head from 'next/head';

import Layout from '@/components/Layout';

export default function DashboardPage(props) {
    /** @type {import('next-auth').Session} */ const session = props.session;
    /** @type {Boolean} */ const loading = props.loading;
    /** @type {Array<APIGuild>} */ const guilds = props.guilds;

    return loading ? <Layout title='Dashboard' loading></Layout> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout title='Dashboard' session={session} guilds={guilds}>

            </Layout>
        </>
    );
}
DashboardPage.auth = true;

export async function getServerSideProps(context){
    /** @type {Array<APIGuild>} */ const userGuilds = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds`, { cache: 'no-cache', headers: { 'Cookie': context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => null);

    return { props: { guilds: userGuilds || [] } };
}