import type { IMemoryControlBlockEntity } from "../memoryControlBlock.entity"

export interface IMemory {
    head: IMemoryControlBlockEntity | null
    size: number
    SOmemory: number
}