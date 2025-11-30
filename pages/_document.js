import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    const profileImageUrl = 'https://media.discordapp.net/attachments/1442949704240464015/1444607500778213446/b0fc77e52e5d00cfd644c5bbe85551d6.jpg?ex=692d5313&is=692c0193&hm=24bc85c8657a412be716f8d3412f282f3662fa1d1ac5e0ec6e95d211ffdffd47&=&format=webp&width=320&height=320';
    
    return (
        <Html lang="en">
            <Head>
                <meta property="og:image" content={profileImageUrl} />
                <meta property="og:image:width" content="320" />
                <meta property="og:image:height" content="320" />
                <meta name="twitter:image" content={profileImageUrl} />
                <meta name="twitter:card" content="summary" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}