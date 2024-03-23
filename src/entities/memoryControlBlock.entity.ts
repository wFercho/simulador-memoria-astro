import type { IProcessEntity } from "./process.entity"

export interface IMemoryControlBlockEntity {
    id:number
    size: number
    process: IProcessEntity | null
    available: boolean
    prev: IMemoryControlBlockEntity | null
    next: IMemoryControlBlockEntity | null
}

export function newMemoryControlBlockEntity({ size, id }: { size: number, id:number }): IMemoryControlBlockEntity {
    return {
        id,
        size,
        process: null,
        available: true,
        next: null,
        prev: null,
    }
}


export function setProcess({ process, block }: { process: IProcessEntity | null, block: IMemoryControlBlockEntity }) {
    if (!block) return
    if (process == null) {
        block.process = null
        block.available = true
    } else {
        block.process = process
        block.available = false
    }
}
