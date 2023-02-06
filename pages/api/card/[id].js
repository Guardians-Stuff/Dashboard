import Canvas from 'canvas';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    const user = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${req.query.id}`, { next: { revalidate: 60 } })
        .then(async response => await response.json())
        .catch(() => null);

    const canvas = new Canvas.Canvas(700, 1000);
    const context = canvas.getContext('2d');
    
    context.save();
    context.beginPath();
    context.roundRect(10, 10, 680, 980, 20);
    context.closePath();
    context.lineWidth = 5;
    context.fillStyle = '#0F1726';
    context.strokeStyle = '#f300f3';
    context.fill();
    context.stroke();
    context.restore();
    
    const avatar = await Canvas.loadImage(`${user.displayAvatarURL}?size=160`);
    const avatarCanvas = new Canvas.Canvas(160, 160);
    const avatarContext = avatarCanvas.getContext('2d');
    const avatarX = canvas.width / 2;
    const avatarY = 160;
    
    avatarContext.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);
    avatarContext.globalCompositeOperation = 'source-over';
    avatarContext.drawImage(avatar, 0, 0);
    
    avatarContext.fillStyle = '#ffffff';
    avatarContext.globalCompositeOperation = 'destination-in';
    avatarContext.beginPath();
    avatarContext.arc(avatar.width / 2, avatar.width / 2, avatar.width / 2, 0, 2 * Math.PI, true);
    avatarContext.closePath();
    avatarContext.fill();
    
    context.drawImage(avatarCanvas, avatarX - (avatar.width / 2), avatarY - (avatar.width / 2));

    context.save();
    context.beginPath();
    context.arc(avatarX, avatarY, (avatar.width / 2) + 10, 0, Math.PI * 2, true);
    context.closePath();
    context.lineWidth = 5;
    context.strokeStyle = '#04C1F9';
    context.stroke();
    context.restore();

    context.textAlign = 'center';
    context.font = '64px sans-serif';
    context.fillStyle = '#ffffff';
    context.fillText(`${user.username}#${user.discriminator}`, canvas.width / 2, 310);

    // context.textAlign = 'center';
    // context.font = '48px sans-serif';
    // context.fillStyle = '#ffffff';
    // context.fillText('She/Her', canvas.width / 2, 400);

    res.status(200)
        .setHeader('Content-Type', 'image/png')
        .send(canvas.toBuffer());
}