import { createCanvas, loadImage } from 'canvas';
import { AttachmentBuilder } from 'discord.js';
import { Asset } from '../../../shared/intraestructure/Asset.js';

interface Options {
  avatarImage: Buffer | null,
  name: string,
  username: string
  credits: number | string
}

export const generateCreditBalanceCard = async (options: Options): Promise<AttachmentBuilder> => {
  const width = 550;
  const height = 120;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#2C2F33';
  ctx.fillRect(0, 0, width, height);

  let avatar;
  
  if (options.avatarImage) {
    avatar = await loadImage(options.avatarImage);
  }
  else {
    const asset = await Asset.get('avatar')
    avatar = await loadImage(asset.path)
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(50, 60, 40, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 10, 20, 80, 80);
  ctx.restore();

  ctx.fillStyle = '#FFFFFF'; 
  ctx.font = 'bold 24px Arial';
  ctx.fillText(options.name, 120, 50);

  ctx.fillStyle = '#B9BBBE'; 
  ctx.font = '16px Arial';
  ctx.fillText(options.username, 120, 80);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px Arial';
  ctx.fillText('Credits Available', 380, 40);

  ctx.fillStyle = '#7289DA';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(String(options.credits), 380, 80); 

  const buffer = canvas.toBuffer('image/png');
  const attachment = new AttachmentBuilder(buffer, { name: 'card.png' });

  return attachment;
}