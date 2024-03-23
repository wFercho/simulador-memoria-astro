import type { IProcessDynamicEntity } from "./processDynamic.entity"

export interface IMemoryControlBlockDynamicEntity {
    id:number
    isShadow:boolean
    size: number
    process: IProcessDynamicEntity | null
    available: boolean
    prev: IMemoryControlBlockDynamicEntity | null
    next: IMemoryControlBlockDynamicEntity | null
}

export function newMemoryControlBlockDynamicEntity({ size, id }: { size: number, id:number }): IMemoryControlBlockDynamicEntity {
    return {
        id,
        size,
        isShadow:false,
        process: null,
        available: true,
        next: null,
        prev: null,
    }
}


export function setProcess({ process, block }: { process: IProcessDynamicEntity | null, block: IMemoryControlBlockDynamicEntity }) {
    if (!block) return
    if (process == null) {
        block.process = null
        block.available = true
    } else {
        block.process = process
        block.available = false
    }
}
