import { MemoryControlBlock } from "./MemoryControlBlock"
import { useStore } from '@nanostores/react'
import { fixedMemory, memoryBlocks } from '../stores/useFixedMemoryStore'

function FixedMemory() {

    const fixedMemoryState = useStore(fixedMemory)
    const blocks = useStore(memoryBlocks)
    const fixedMemoryTotalSize = fixedMemory.get().size
    const fixedMemorySOsize = fixedMemory.get().SOmemory
    const fixedMemoryFragmentacion = fixedMemory.get().fragmentacionExterna
    const calculateBlockHeightSize = (blockSize: number) => {
        return (blockSize * 100) / fixedMemoryTotalSize
    }

    return (<div className="flex h-full gap-x-4">
        <div className="h-full w-1/2">

            {
                blocks.map(b => (<MemoryControlBlock key={`block-${b.id}`} blockHeight={calculateBlockHeightSize(b.size)} block={b} />))
            }
            <div
                className={`flex items-center justify-center bg-blue-600 rounded-b-md`}
                style={{ height: `${calculateBlockHeightSize(fixedMemoryState.SOmemory)}%` }}
            >{`S.O (${fixedMemoryState.SOmemory}MB)`}
            </div>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center gap-y-20">
            <h2 className="text-xl font-bold">Total: <span className="font-normal">{fixedMemoryTotalSize+fixedMemorySOsize}MB</span></h2>
            <h2 className="text-xl font-bold text-center">Fragmentación externa: <span className="font-normal">{fixedMemoryFragmentacion}MB</span></h2>
            <h2 className="text-xl font-bold">Libre: <span className="font-normal">{fixedMemoryTotalSize - fixedMemoryFragmentacion}MB</span></h2>
        </div>
    </div>)
}

export { FixedMemory }