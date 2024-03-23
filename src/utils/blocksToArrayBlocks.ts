import type { IDynamicMemoryEntity } from "../entities/dynamicMemory.entity";
import type { IFixedMemoryEntity } from "../entities/fixedMemory.entity";
import type { IMemoryControlBlockEntity } from "../entities/memoryControlBlock.entity";
import type { IMemoryControlBlockDynamicEntity } from "../entities/memoryControlBlockDynamic";

export function blocksToArrayBlocks(head: IFixedMemoryEntity["head"]) {
    const blocks: Omit<IMemoryControlBlockEntity, "prev" | "next">[] = []
    let block = structuredClone(head)
    while (block !== null) {
        blocks.push({ id: block.id, available: block.available, process: block.process, size: block.size })
        block = block.next
    }

    return blocks
}

export function blocksDynamicToArrayBlocks(head: IDynamicMemoryEntity["head"]) {
    const blocks: Omit<IMemoryControlBlockDynamicEntity, "prev" | "next">[] = []
    let block = head
    let omitHead = false
    while (block !== null) {
        blocks.push({ id: block.id, available: block.available, process: block.process, size: block.size, isShadow: block.isShadow })
        block = block.next
    }

    return blocks
}