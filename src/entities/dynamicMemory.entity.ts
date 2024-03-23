import { setProcess, type IMemoryControlBlockDynamicEntity, newMemoryControlBlockDynamicEntity } from "./memoryControlBlockDynamic"
import type { IProcessDynamicEntity } from "./processDynamic.entity"


export interface IDynamicMemoryEntity{
    head: IMemoryControlBlockDynamicEntity | null
    size: number
    SOmemory: number
    memLibre:number

}

export function newDynamicMemory({ SOmemory, size }: { size: number, SOmemory: number }): IDynamicMemoryEntity {
    return {
        memLibre:size - SOmemory,
        head: null,
        size: size - SOmemory,
        SOmemory
    }
}


export function requestDynamicAllocation({ dynamicMemory, process }: { process: IProcessDynamicEntity, dynamicMemory: IDynamicMemoryEntity }) {

    let blockBestFit = dynamicMemory.head
    if (blockBestFit === null) return false //Significa que no hemos agregado bloques a Memoria

    while ((blockBestFit.size < process.size) || (!blockBestFit.available)) {
        blockBestFit = blockBestFit.next
        if (blockBestFit == null) return false
    }

    //Comprobamos en los demás bloques si podemos ocupar uno evitando la mayor fragmentación interna posible
    let block = blockBestFit.next
    while (block !== null) {

        if ((block.size >= process.size) && (block.available) && (block.size < blockBestFit.size)) {
            blockBestFit = block
        }
        block = block.next
    }

    const memFree = dynamicMemory.memLibre - process.size
    dynamicMemory.memLibre = memFree

    setProcess({ block: blockBestFit, process })

    process.allocatedMemoryBlock = blockBestFit
    return true
}


export function deallocateDynamicProcess({ process }: { process: IProcessDynamicEntity }) {

    if (!process.allocatedMemoryBlock) return
    setProcess({ process: null, block: process.allocatedMemoryBlock })

    process.allocatedMemoryBlock = null
}

export function addBlockToDynamicMemory({ block, dynamicMemory }: { block: IMemoryControlBlockDynamicEntity, dynamicMemory: IDynamicMemoryEntity }) {
    if (block.size > dynamicMemory.size) return

    if (dynamicMemory.head === null) {
        dynamicMemory.head = block
        return {
            dynamicMemory,
            block
        }
    }

    block.next = dynamicMemory.head
    dynamicMemory.head.prev = block
    dynamicMemory.head = block

    return {
        dynamicMemory,
        block
    }
}

export function createBlockPartition({ dynamicMemory, processSize, newBlockId }: {dynamicMemory:IDynamicMemoryEntity, processSize:number, newBlockId:number}) {
    // const SOMemorySize = dynamicMemory.SOmemory
    // const fixedMemorySize = dynamicMemory.size

    const blocks: IMemoryControlBlockDynamicEntity[] = []

    blocks.push(newMemoryControlBlockDynamicEntity({ id: newBlockId, size:processSize }))

    blocks.forEach(block => {
        addBlockToDynamicMemory({ block, dynamicMemory })
    })
}



