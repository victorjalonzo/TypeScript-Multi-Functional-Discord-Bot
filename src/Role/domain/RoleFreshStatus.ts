interface IRoleRefreshStatusOptions {
    rolesCreated: number
    rolesUpdated: number
    rolesDeleted: number
}

export const printRoleRefreshStatus = (options: IRoleRefreshStatusOptions) => {
    const { rolesCreated, rolesUpdated, rolesDeleted } = options

    console.log("╔══════════════════════╗");
    console.log("║       Roles          ║");
    console.log("╠══════════════════════╣");
    console.log(`║  Roles created: ${rolesCreated < 10 ? `0${rolesCreated}` : rolesCreated}   ║`);
    console.log(`║  Roles updated: ${rolesUpdated < 10 ? `0${rolesUpdated}` : rolesUpdated}   ║`);
    console.log(`║  Roles deleted: ${rolesDeleted < 10 ? `0${rolesDeleted}` : rolesDeleted}   ║`);
    console.log("╚══════════════════════╝");
}