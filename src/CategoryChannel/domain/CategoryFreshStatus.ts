interface ICategoryRefreshStatusOptions {
    categoriesCreated: number
    categoriesUpdated: number
    categoriesDeleted: number
}

export const printCategoryRefreshStatus = (options: ICategoryRefreshStatusOptions) => {
    const { categoriesCreated, categoriesUpdated, categoriesDeleted } = options

    console.log("╔══════════════════════╗");
    console.log("║       Categories     ║");
    console.log("╠══════════════════════╣");
    console.log(`║  Categories created: ${categoriesCreated < 10 ? `0${categoriesCreated}` : categoriesCreated}║`);
    console.log(`║  Categories updated: ${categoriesUpdated < 10 ? `0${categoriesUpdated}` : categoriesUpdated}║`);
    console.log(`║  Categories deleted: ${categoriesDeleted < 10 ? `0${categoriesDeleted}` : categoriesDeleted}║`);
    console.log("╚══════════════════════╝");
}