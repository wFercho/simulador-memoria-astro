import type { IMemoryControlBlockEntity } from "../entities/memoryControlBlock.entity"

interface Props {
    blockHeight: number
    block: Omit<IMemoryControlBlockEntity, "prev" | "next">
}
function MemoryControlBlock({ blockHeight, block }: Props) {
    if (!block.process) {
        return (<div
            className={`flex flex-col items-center justify-center border-b border border-green-950 first:rounded-t-md bg-green-600`}
            style={{ height: `${blockHeight}%` }}
        >
            {`${block.size}MB`}

        </div>)
    }
    const processHeight = (block.process.size * 100) / block.size

    const fragInterna = block.size - block.process.size
    return (<div
        className={`flex flex-col flex-grow items-center border-b first:rounded-t-md border-green-700`}
        style={{ height: `${blockHeight}%`, background: "repeating-linear-gradient( 45deg, #ffff, #ffff 5px, #16a34a 5px, #16a34a 25px )", }}
    >
        <div
            className="w-full bg-green-200 flex items-center justify-center"
            style={{
                height: `${processHeight}%`
            }}
        >
            <h4>P{block.process.id} ({block.process.size}MB)</h4>
        </div>
        {fragInterna !== 0 ? <div className="flex justify-center items-center w-full h-full"><span>{fragInterna}MB</span></div> : <></>}
    </div>)
}


export { MemoryControlBlock }