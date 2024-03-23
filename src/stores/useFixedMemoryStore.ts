import { atom } from 'nanostores'
import { clockTick, isProcessAllocated, newProcessEntity, type IProcessEntity } from '../entities/process.entity'
import { deallocateProcess, newFixedMemoryEntity, requestAllocation, createDifferentSizePartition, createSameSizePartition } from '../entities/fixedMemory.entity'
import { blocksToArrayBlocks } from '../utils/blocksToArrayBlocks';

const fixedMemoryInitialState = newFixedMemoryEntity({ size: 400, SOmemory: 40 })
createDifferentSizePartition({ fixedMemoryInstance: fixedMemoryInitialState, partitionsSizes: [100, 34, 69, 20, 32] })
//createSameSizePartition({fixedMemoryInstance:fixedMemoryInitialState, partitionSize:40})

export const processes = atom<IProcessEntity[]>([])
export const fixedMemory = atom(fixedMemoryInitialState)
export const memoryBlocks = atom(blocksToArrayBlocks(fixedMemoryInitialState.head))
export const processIdCounter = atom(0)

export const newProcessId = () => {
    const prev = processIdCounter.get()
    processIdCounter.set(prev + 1)
    return processIdCounter.get()
}

export const addProcess = ({ size, time }: { size: number, time: number }) => {
    const id = newProcessId()
    const newProcess = newProcessEntity({ id, size, time })

    processes.set([...processes.get(), newProcess])
}

export const processesTick = () => {

    let fixedMemoryUpdated = structuredClone(fixedMemory.get())
    let processesUpdated = [...processes.get()]
    let memoryBlocksUpdated = blocksToArrayBlocks(fixedMemoryUpdated.head)
    processes.get().forEach((process, index) => {
        if (!isProcessAllocated(process)) {
            requestAllocation({ fixedMemory: fixedMemoryUpdated, process })
        } else {
            if (process.timeLeft < 1) {
                deallocateProcess({ process })

                if (index > -1) {
                    let block = fixedMemoryUpdated.head
                    while (block !== null) {
                        if (block.process?.id === process.id) {
                            fixedMemoryUpdated.fragmentacionExterna -= block.size - process.size
                            block.process = null
                            block.available = true
                        }
                        block = block.next
                    }
                    processesUpdated.splice(index, 1)
                }
            }
            clockTick(process)
        }
    })
    memoryBlocks.set(memoryBlocksUpdated)
    processes.set(processesUpdated)
    fixedMemory.set(fixedMemoryUpdated)
}


// const process1 = newProcessEntity({ size: 21, time: 5, id: 1 });
// const process2 = newProcessEntity({ size: 47, time: 2, id: 2 });
// const process3 = newProcessEntity({ size: 56, time: 12, id: 3 });
// const process4 = newProcessEntity({ size: 67, time: 10, id: 4 });
// const process5 = newProcessEntity({ size: 33, time: 6, id: 5 });
// const processesInitialState: IProcessEntity[] = [process1, process2, process3, process4, process5];