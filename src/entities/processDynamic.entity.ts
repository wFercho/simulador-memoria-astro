import type { IMemoryControlBlockDynamicEntity } from "./memoryControlBlockDynamic"

export interface IProcessDynamicEntity {
    id: number
    size: number
    timeLeft: number
    allocatedMemoryBlock: IMemoryControlBlockDynamicEntity | null
}

export function newProcessDynamicEntity({ size, time, id }: { size: number, time: number, id: number }): IProcessDynamicEntity {
    return {
        id,
        allocatedMemoryBlock: null,
        size,
        timeLeft: time
    }
}


export function isProcessDynamicAllocated(process: IProcessDynamicEntity) {
    return process.allocatedMemoryBlock !== null
}

export function clockTickDynamic(process: IProcessDynamicEntity) {
    process.timeLeft -= 1
}