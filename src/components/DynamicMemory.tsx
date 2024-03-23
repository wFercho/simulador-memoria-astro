import { useStore } from "@nanostores/react"
import { dynamicMemory, memoryBlocks } from "../stores/useDynamicMemoryStore"
import { MemoryControlBlockDynamic } from "./MemoryControlBlockDynamic"
import type { IMemoryControlBlockDynamicEntity } from "../entities/memoryControlBlockDynamic"

function DynamicMemory() {
    const dynamicMemoryState = useStore(dynamicMemory)
    const blocks = useStore(memoryBlocks)
    const dynamicMemoryTotalSize = dynamicMemory.get().size
    const dynamicMemorySOsize = dynamicMemory.get().SOmemory
    const dynamicMemoryFree = dynamicMemory.get().memLibre

    const renderBlock = (b: IMemoryControlBlockDynamicEntity) => {
        return <MemoryControlBlockDynamic key={`block-${b.id}`} blockHeight={calculateBlockHeightSize(b.size)} block={b} />
    }
    const renderBlocks = () => {
        const elements = []
        let block = dynamicMemoryState.head
        while (block !== null) {
            elements.push(renderBlock(block))
            block = block.next
        }

        return elements
    }

    const calculateBlockHeightSize = (blockSize: number) => {
        return (blockSize * 100) / dynamicMemoryTotalSize
    }

    return (<div className="flex h-full gap-x-4">
        <div className="h-full w-1/2 border-2 border-white">
            <div
                className={`flex items-center justify-center bg-blue-600 rounded-b-md`}
                style={{ height: `${calculateBlockHeightSize(dynamicMemoryState.SOmemory)}%` }}
            >{`S.O (${dynamicMemoryState.SOmemory}MB)`}
            </div>
            {
                // blocks.reverse().map(b => (<MemoryControlBlockDynamic key={`block-${b.id}`} blockHeight={calculateBlockHeightSize(b.size)} block={b} />))
                renderBlocks().reverse()
            }

        </div>
        <div className="w-1/2 flex flex-col items-center justify-center gap-y-20">
            <h2 className="text-xl font-bold">Total: <span className="font-normal">{dynamicMemoryTotalSize + dynamicMemorySOsize}MB</span></h2>
            <h2 className="text-xl font-bold">Libre: <span className="font-normal">{dynamicMemoryFree}MB</span></h2>
        </div>
    </div>)
}

export { DynamicMemory }