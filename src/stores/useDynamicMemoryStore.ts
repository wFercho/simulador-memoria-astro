import { atom } from 'nanostores'
import { createBlockPartition, deallocateDynamicProcess, newDynamicMemory, requestDynamicAllocation } from '../entities/dynamicMemory.entity'
import { newProcessDynamicEntity, type IProcessDynamicEntity, isProcessDynamicAllocated, clockTickDynamic } from '../entities/processDynamic.entity'
import { blocksDynamicToArrayBlocks } from '../utils/blocksToArrayBlocks'
import type { IMemoryControlBlockDynamicEntity } from '../entities/memoryControlBlockDynamic'

const dynamicMemoryInitialState = newDynamicMemory({ size: 400, SOmemory: 40 })

export const processesDynamicMemory = atom<IProcessDynamicEntity[]>([])
export const dynamicMemory = atom(dynamicMemoryInitialState)
export const memoryBlocks = atom<Omit<IMemoryControlBlockDynamicEntity, "prev" | "next">[]>([])
const processIdCounter = atom(0)
const blockIdCounter = atom(0)

export const newProcessId = () => {
    const prev = processIdCounter.get()
    processIdCounter.set(prev + 1)
    return processIdCounter.get()
}

export const newBlockId = () => {
    const prev = blockIdCounter.get()
    blockIdCounter.set(prev + 1)
    return blockIdCounter.get()
}
export const addProcessToDynamicMemory = ({ size, time }: { size: number, time: number }) => {
    const id = newProcessId()
    const newProcess = newProcessDynamicEntity({ id, size, time })

    let dynamicMemoryUpdated = structuredClone(dynamicMemory.get())

    const blockId = newBlockId()
    processesDynamicMemory.set([...processesDynamicMemory.get(), newProcess])
    createBlockPartition({ dynamicMemory: dynamicMemoryUpdated, processSize: newProcess.size, newBlockId: blockId })

    dynamicMemory.set(dynamicMemoryUpdated)
}

export function processesTickDynamic() {

    let dynamicMemoryUpdated = structuredClone(dynamicMemory.get())
    let processesDynamicMemoryUpdated = [...processesDynamicMemory.get()]
    let memoryBlocksUpdated = blocksDynamicToArrayBlocks(dynamicMemoryUpdated.head)
    processesDynamicMemory.get().forEach((process, index) => {
        if (!isProcessDynamicAllocated(process)) {
            requestDynamicAllocation({ dynamicMemory: dynamicMemoryUpdated, process })
        } else {
            if (process.timeLeft < 1) {
                deallocateDynamicProcess({ process })
                if (index > -1) {
                    let block = dynamicMemoryUpdated.head
                    while (block !== null) {
                        if (block.process?.id === process.id) {
                            dynamicMemoryUpdated.memLibre += process.size
                            block.process = null
                            block.available = true
                            block.isShadow = true

                            if (block.prev?.available && block.prev.isShadow) {
                                block.size += block.prev.size
                                block.prev = block.prev.prev
                            }

                            if (block.next?.available && block.next.isShadow) {
                                block.size += block.next.size
                                block.next = block.next.next
                            }

                        }
                        block = block.next
                    }
                    processesDynamicMemoryUpdated.splice(index, 1)
                }
            }
            clockTickDynamic(process)
        }
    })
    memoryBlocks.set(memoryBlocksUpdated)
    processesDynamicMemory.set(processesDynamicMemoryUpdated)
    dynamicMemory.set(dynamicMemoryUpdated)
}

