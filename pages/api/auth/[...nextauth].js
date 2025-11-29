import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            checks: []
        })
    ],
    pages: {
        signIn: '/',
        error: '/'
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // After successful login, redirect to dashboard by default
            // If user was trying to access a specific page, preserve that
            if (url && url.startsWith('/')) {
                // Relative URL - preserve it
                return `${baseUrl}${url}`;
            }
            if (url && new URL(url).origin === baseUrl) {
                // Same origin - allow it
                return url;
            }
            // Default: redirect to dashboard after login
            return `${baseUrl}/dashboard`;
        },
        async session({ session, token, user }){
            return {
                account: token.account,
                ...token.profile
            };

        },
        async jwt({ token, user, account, profile, isNewUser }){
            if(account) token.account = account;
            if(profile) token.profile = profile;
            
            delete token.profile.image_url;
            token.profile.displayAvatarURL = token.profile.avatar ? `https://cdn.discordapp.com/avatars/${token.profile.id}/${token.profile.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${+token.profile.discriminator % 5}.png`;

            if(Date.now() / 1000 < token.account.expires_at) return token;

            const response = await fetch('https://discord.com/api/oauth2/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: token.account.refresh_token
            }) });
            if(response.status != 200) return { error: true };

            const json = await response.json();
            token.account = json;

            return token;
        }
    }
};

export default NextAuth(authOptions);