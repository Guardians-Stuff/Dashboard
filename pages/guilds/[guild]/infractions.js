import React from 'react';
import Router, { useRouter } from 'next/router';

import Head from 'next/head';
import { Box } from '@mui/system';

import Layout from '@/components/Layout';
import dbConnect from '@/lib/dbConnect';
import Infractions from '@/schemas/Infractions';
import InfractionsDataGrid from '@/components/InfractionsDataGrid';

export default function InfractionsPage(props) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = props.session;
    /** @type {Boolean} */ const loading = props.loading;
    /** @type {Boolean} */ const mobile = props.mobile;
    /** @type {Guild} */ const guild = props.guild;
    /** @type {Array<import('@/schemas/Infractions').Infraction>} */ const infractions = props.infractions;
    /** @type {Array<User | GuildMember>} */ const users = props.users;

    const router = useRouter();
    if(!guild && typeof window != 'undefined') router.push('/dashboard');

    return loading || !guild ? <Layout loading title='Infractions' session={session} guild={guild}></Layout> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', height: '100%' }}>
                <Layout title='Infractions' session={session} guild={guild}>
                    <InfractionsDataGrid mobile={mobile} infractions={infractions} users={users} />
                </Layout>
            </Box>
        </>
    );
};
InfractionsPage.auth = true;

export async function getServerSideProps(context) {
    await dbConnect();

    const guild = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${context.params.guild}`, { cache: 'no-cache', headers: { Cookie: context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => null);
    
    if(!guild) return { props: { guild: null, infractions: [], users: [] } };
  
    const results = await Infractions.find({ guild: context.params.guild }).sort({ _id: -1 });
    /** @type {Array<import('@/schemas/Infractions').Infraction>} */ const infractions = results.map(result => {
        const infraction = result.toObject();
        infraction._id = result._id.toString();
        infraction.id = infraction._id;

        return infraction;
    });

    /** @type {Array<GuildMember>} */ const members = await (await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${context.params.guild}/members`,  { cache: 'no-cache', headers: { Cookie: context.req.headers.cookie } })).json();
    /** @type {Array<string>} */ const ids = [ ...new Set(infractions.flatMap(infraction => [ infraction.user, infraction.issuer ])) ];
    const users = [];

    for(const id of ids){
        const member = members.find(member => member.id == id);
        if(member){
            users.push(member);
            continue;
        }

        users.push(fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${id}`, { cache: 'no-cache' }).then(async response => response.json()));
    }

    return { props: { guild: guild, infractions: infractions, users: await Promise.all(users) } };
}