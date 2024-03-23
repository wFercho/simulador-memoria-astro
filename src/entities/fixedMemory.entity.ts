import type { IMemory } from "./interfaces";
import { setProcess, type IMemoryControlBlockEntity, newMemoryControlBlockEntity } from "./memoryControlBlock.entity";
import type { IProcessEntity } from "./process.entity";


export interface IFixedMemoryEntity extends IMemory {
    fragmentacionExterna:number
}

interface sameSizePartitionFunctionArguments {
    partitionSize?: number
    numPartitions?: number
    fixedMemoryInstance: IFixedMemoryEntity
}

interface differentSizePartitionFunctionArguments {
    partitionsSizes: number[]
    fixedMemoryInstance: IFixedMemoryEntity
}

export function newFixedMemoryEntity({ SOmemory, size }: { SOmemory: number, size: number }): IFixedMemoryEntity {
    return {
        head: null,
        size: size - SOmemory,
        SOmemory,
        fragmentacionExterna:0
    }
}


export function requestAllocation({ fixedMemory, process }: { process: IProcessEntity, fixedMemory: IFixedMemoryEntity }) {
    let blockBestFit = fixedMemory.head
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

    const blockInternalSegmentation = blockBestFit.size - process.size
    fixedMemory.fragmentacionExterna += blockInternalSegmentation

    setProcess({ block: blockBestFit, process })

    process.allocatedMemoryBlock = blockBestFit
    return true
}


export function deallocateProcess({ process }: { process: IProcessEntity }) {

    if (!process.allocatedMemoryBlock) return
    setProcess({ process: null, block: process.allocatedMemoryBlock })

    process.allocatedMemoryBlock = null
}

export function addBlockToFixeMemory({ block, fixedMemory }: { block: IMemoryControlBlockEntity, fixedMemory: IFixedMemoryEntity }) {
    if (block.size > fixedMemory.size) return

    if (fixedMemory.head === null) {
        fixedMemory.head = block
        return {
            fixedMemory,
            block
        }
    }

    block.next = fixedMemory.head
    fixedMemory.head.prev = block
    fixedMemory.head = block

    return {
        fixedMemory,
        block
    }
}


export function createSameSizePartition({ numPartitions, partitionSize, fixedMemoryInstance }: sameSizePartitionFunctionArguments) {
    if (!numPartitions && !partitionSize) {
        console.error("Especifique si la partición será por número o por tamaño")
        return undefined
    }
    
    if (numPartitions !== undefined) {
        const singlePartitionSize = fixedMemoryInstance.size / numPartitions
        const blocks: IMemoryControlBlockEntity[] = []


        for (let i = 0; i < numPartitions; i++) {
            blocks.push(newMemoryControlBlockEntity({ id: i + 1, size: singlePartitionSize }))

        }
        blocks.forEach(block => {
            addBlockToFixeMemory({ block, fixedMemory: fixedMemoryInstance })
        })
    }

    if (partitionSize !== undefined) {

        const numberPartitions = Math.trunc(fixedMemoryInstance.size / partitionSize)
        const blocks: IMemoryControlBlockEntity[] = []

        for (let i = 0; i < numberPartitions; i++) {
            blocks.push(newMemoryControlBlockEntity({ id: i + 1, size: partitionSize }))
        }
        const residuo = fixedMemoryInstance.size % partitionSize
        if (residuo != 0) {
            blocks.push(newMemoryControlBlockEntity({ id: blocks.length + 1, size: residuo }))
        }
        blocks.forEach(block => {
            addBlockToFixeMemory({ block, fixedMemory: fixedMemoryInstance })
        })
    }


}

export function createDifferentSizePartition({ partitionsSizes, fixedMemoryInstance }: differentSizePartitionFunctionArguments) {
    const SOMemorySize = fixedMemoryInstance.SOmemory
    const fixedMemorySize = fixedMemoryInstance.size
    const totalPartitionsSize = partitionsSizes.reduce((accumulator, currentValue) => accumulator + currentValue, SOMemorySize)

    if (totalPartitionsSize > fixedMemorySize) {
        console.error("El tamaño de las particiones junto con el tamaño para el SO supera al de la memoria disponible")
        return undefined
    }

    const remainingMemoryToBeAllocated = fixedMemorySize - totalPartitionsSize
    const blocks: IMemoryControlBlockEntity[] = []

    for (let i = 0; i < partitionsSizes.length; i++) {
        const size = partitionsSizes[i]
        blocks.push(newMemoryControlBlockEntity({ id: i + 1, size }))

    }

    if (remainingMemoryToBeAllocated > 0) {
        blocks.push(newMemoryControlBlockEntity({ id: partitionsSizes.length + 1, size: remainingMemoryToBeAllocated }))
    }

    blocks.forEach(block => {
        addBlockToFixeMemory({ block, fixedMemory: fixedMemoryInstance })
    })
}
