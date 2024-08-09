export class BarProgress {
    static create(counting: number, required: number, barBlock = 20) {
        const fillBlock = "█";
        const emptyBlock = "░";
        let barProgress = '';

        if (counting === 0 && required === 0) {
            counting = 1;
            required = 1;
        }
    
        if (counting > required) counting = required;
    
        const porcent = (counting * 100) / required;
        const filledBlocksNeeded = (porcent / 100) * barBlock;
    
        barProgress += fillBlock.repeat(Math.floor(filledBlocksNeeded));
        barProgress += emptyBlock.repeat(Math.floor(barBlock - filledBlocksNeeded));
    
        return barProgress;
    }
}