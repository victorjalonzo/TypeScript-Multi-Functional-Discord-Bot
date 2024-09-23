interface ITextChannelRefreshStatusOptions {
    channelsCreated: number;
    channelsUpdated: number;
    channelsDeleted: number;
}

export const printTextChannelRefreshStatus = (options: ITextChannelRefreshStatusOptions) => {
    const { channelsCreated, channelsUpdated, channelsDeleted } = options;

    console.log("╔════════════════════════════╗");
    console.log("║    Text Channels           ║");
    console.log("╠════════════════════════════╣");
    console.log(`║  Channels created: ${channelsCreated < 10 ? `0${channelsCreated}` : channelsCreated}  ║`);
    console.log(`║  Channels updated: ${channelsUpdated < 10 ? `0${channelsUpdated}` : channelsUpdated}  ║`);
    console.log(`║  Channels deleted: ${channelsDeleted < 10 ? `0${channelsDeleted}` : channelsDeleted}  ║`);
    console.log("╚════════════════════════════╝");
};