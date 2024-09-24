interface IRefreshStatusOptions {
    itemsAdded: number;
    itemsUpdated: number;
    itemsRemoved: number;
    singular: string;
    plural: string;
}

export const refreshLog = (options: IRefreshStatusOptions): void => {
    const { itemsAdded, itemsUpdated, itemsRemoved, singular, plural } = options;

    const addedText = itemsAdded > 0 ? 
        itemsAdded === 1 
            ? `(${itemsAdded}) ${singular} was added`
            : `(${itemsAdded}) ${plural} were added`
        : `No ${plural} were added`;
    
    const updatedText = itemsUpdated > 0 ? 
        itemsUpdated === 1 
            ? `(${itemsUpdated}) ${singular} was updated`
            : `(${itemsUpdated}) ${plural} were updated`
        : `No ${plural} were updated`;
    
    const removedText = itemsRemoved > 0 ? 
        itemsRemoved === 1 
            ? `(${itemsRemoved}) ${singular} was removed`
            : `(${itemsRemoved}) ${plural} were removed`
        : `No ${plural} were removed`;
    
    console.log(`║ ${plural.charAt(0).toUpperCase() + plural.slice(1)} refreshed: ${addedText}, ${updatedText} and ${removedText}.\n`);
}