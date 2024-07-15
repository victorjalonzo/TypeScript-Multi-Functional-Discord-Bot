import { IGuild } from "./IGuild.js";

export class Guild implements IGuild {
    constructor(
        public id: string,
        public name: string,
        public icon: string | null,
        public createdAt: Date,
        
    ){}
}