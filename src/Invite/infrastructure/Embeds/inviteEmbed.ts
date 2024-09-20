import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Asset } from "../../../shared/intraestructure/Asset.js"
import { InlineBlockText } from "../../../shared/utils/textFormating.js"
import { BarProgress } from "../../../shared/utils/BarProgress.js"
import { Font, RankCardBuilder } from "canvacord"

interface IProps {
    displayName: string
    username: string
    avatarURL?: string
    invitesCount: number
    invitesRequired: number
}

export const createInviteCard = async (props: IProps) => {
    const { displayName, username, avatarURL, invitesCount, invitesRequired } = props

    Font.loadDefault();

    const card = new RankCardBuilder()
    .setDisplayName(displayName) // Big name
    .setUsername(username) // small name, do not include it if you want to hide it
    .setCurrentXP(invitesCount) // current xp
    .setRequiredXP(invitesRequired) // required xp
    //.setLevel(1200) // user level
    //.setRank(160) // user rank
    //.setOverlay(90) // overlay percentage. Overlay is a semi-transparent layer on top of the background
    //.setBackground("#23272a") // set background color or,
    //.setBackground("https://www.colorhexa.com/1e2124.png") // set background image
    .setStatus("online"); // user status. Omit this if you want to hide it

    if (avatarURL) card.setAvatar(avatarURL)


    card.height = card.height - 50

    card.setStyles({
        progressbar: {
            thumb: {style: {backgroundColor: "#5ce65c"}}
        },

        statistics: {
          container: {style: {fontWeight: "bold"}},
          xp: {
            container: { style: {margin: "0px", fontSize: "20px"}},
            text: {style: {fontWeight: "bold", color: "#ffff", fontFamily: "Arial"}}
          }
        }
    });

    card.setTextStyles({
        level: "YOUR CREDITS :", // Custom text for the level
        xp: "Invites:", // Custom text for the experience points
        rank: "CHALLENGE:", // Custom text for the rank
      });

    const image = await card.build({format: "png", width: 550, height: 120});
    return new AttachmentBuilder(image, {name: "rank.png"})
}


export const createInvitesEmbed = (username: string, avatarURL?: string, invitesCount: number = 0): EmbedBuilder => {
    const askedBy = `Asked by @${username}`
    const bar = BarProgress.create(invitesCount, invitesCount)
    const description = `**\ninvites\n${bar}** ${invitesCount}/${invitesCount}`

    const embed = new EmbedBuilder()
    .setAuthor({ name: askedBy, iconURL: avatarURL })
    .setDescription(description)
    .setColor(0x6192e6)

    if (avatarURL) embed.setThumbnail(avatarURL)
    return embed
}