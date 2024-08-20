export const InlineBlockText = (text: string): string => {
    return `\`\`\`\n${text}\n\`\`\``
}

export const SimpleBlockText = (text: string): string => {
    return `\`${text}\``;
};

export const BoldText = (text: string): string => {
    return `**${text}**`;
}

export const ItalicText = (text: string): string => {
    return `_${text}_`;
}