import type { IMemoryControlBlockEntity } from "./memoryControlBlock.entity"

export interface IProcessEntity {
    id: number
    size: number
    timeLeft: number
    allocatedMemoryBlock: IMemoryControlBlockEntity | null
}

export function newProcessEntity({ size, time, id }: { size: number, time: number, id: number }): IProcessEntity {
    return {
        id,
        allocatedMemoryBlock: null,
        size,
        timeLeft: time
    }
}


export function isProcessAllocated(process: IProcessEntity) {
    return process.allocatedMemoryBlock !== null
}

export function clockTick(process: IProcessEntity) {
    process.timeLeft -= 1
}