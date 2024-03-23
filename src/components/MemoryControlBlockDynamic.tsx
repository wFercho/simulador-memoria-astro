
import type { IMemoryControlBlockDynamicEntity } from "../entities/memoryControlBlockDynamic"

interface Props {
    blockHeight: number
    block: Omit<IMemoryControlBlockDynamicEntity, "prev" | "next">
}
function MemoryControlBlockDynamic({ blockHeight, block }: Props) {
    if (!block.process) {
        return (<div
            className={`flex flex-col items-center justify-center border-b border border-green-950 first:rounded-t-md ${block.isShadow ? "":"bg-green-600"}`}
            style={{ height: `${blockHeight}%` }}
        >
            {`${block.size}MB`}

        </div>)
    }
    const processHeight = blockHeight

    return (<div
        className={`flex flex-col flex-grow items-center border-b first:rounded-t-md border-green-700`}
        style={{ height: `${blockHeight}%`, background: "repeating-linear-gradient( 45deg, #ffff, #ffff 5px, #16a34a 5px, #16a34a 25px )", }}
    >
        <div
            className="w-full h-full bg-green-200 flex items-center justify-center"
        ><h4>P{block.process.id} ({block.process.size}MB)</h4>
        </div>
    </div>)
}


export { MemoryControlBlockDynamic }