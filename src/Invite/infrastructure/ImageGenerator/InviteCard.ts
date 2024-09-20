import { createCanvas, loadImage } from 'canvas';
import { AttachmentBuilder } from 'discord.js';
import { Asset } from '../../../shared/intraestructure/Asset.js';

interface IOptions {
    avatarImage: Buffer | null
    username: string
    currentInvites: number
}

export const generateInviteCard = async (options: IOptions): Promise<AttachmentBuilder> => {
  // Canvas Dimensions
  const canvas = createCanvas(550, 120);
  const ctx = canvas.getContext('2d');

  // General Colors
  const backgroundColor = '#2C2F33';
  const textColor = '#ffffff';
  const subTextColor = '#b9bbbe';

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Avatar section
  const avatarImage = options.avatarImage 
  ? await loadImage(options.avatarImage)
  : await loadImage((await Asset.get('avatar')).path);

  const avatar = {size: 80, x: 20, y: 23}
  
  ctx.save();
  ctx.beginPath();
  ctx.arc(avatar.x + avatar.size / 2, avatar.y + avatar.size / 2, avatar.size / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip(); 
  ctx.drawImage(avatarImage, avatar.x, avatar.y, avatar.size, avatar.size);
  
  ctx.restore();

  // Username Uppercase section
  const usernameUpper = {x: 120, y: 50}
  ctx.fillStyle = textColor;
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(options.username, usernameUpper.x, usernameUpper.y);

  // Username Lowercase section
  const usernameLower = {x: 120, y: 70}
  ctx.fillStyle = subTextColor;
  ctx.font = '16px Arial';
  ctx.fillText(`@${options.username.toLowerCase()}`, usernameLower.x, usernameLower.y);
  
  // Progress bar section
  const progressBarBackground = '#4f545c';
  const progressBarFill = '#5af128';
  const progress = 100;
  const progressBar = {x: 120, y: 90, width: 350, height: 20}

  ctx.fillStyle = progressBarBackground;
  ctx.fillRect(progressBar.x, progressBar.y, progressBar.width, progressBar.height);

  // progress bar filler
  ctx.fillStyle = progressBarFill;
  ctx.fillRect(progressBar.x, progressBar.y, (progressBar.width * progress) / 100, progressBar.height);

  // Invites section
  const currentInvites = `${options.currentInvites < 10 ? '0' : ''}${options.currentInvites}`
  const invitesText = `${currentInvites}/${currentInvites}`
  
  const invites = {
    x: progressBar.x + (progressBar.width / 2),
    y: progressBar.y + 15
  }

  ctx.font = 'bold 15px Arial';
  ctx.strokeStyle = '#727870'; 
  ctx.lineWidth = 3; 
  ctx.strokeText(invitesText, invites.x, invites.y);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(invitesText, invites.x, invites.y);

  const buffer = canvas.toBuffer('image/png');
  const image = new AttachmentBuilder(buffer, { name: 'media.png' });

  return image
}