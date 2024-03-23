import { useStore } from '@nanostores/react'

import { processesDynamicMemory } from '../stores/useDynamicMemoryStore'


function ProcessesTableDynamicMemory() {
    const processesList = useStore(processesDynamicMemory)
    return (
        <>
            <table className='text-center border-2 w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase dark:text-gray-400'>
                    <tr>
                        <th scope='col' className='px-6 py-3 text-black'>PID</th>
                        <th scope='col' className='px-6 py-3 text-black'>Tamaño (MB)</th>
                        <th scope='col' className='px-6 py-3 bg-gray-800 text-white'>Tiempo restante</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        processesList.map((p) => (
                            <tr key={`process-${p.id}`} className='border-b border-gray-200 dark:border-gray-700'>
                                <td scope='row' className='px-6 py-4 bg-white text-black'>{p.id}</td>
                                <td className='px-6 py-4 bg-white text-black'>{p.size}</td>
                                <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800'>{p.timeLeft}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}

export { ProcessesTableDynamicMemory }