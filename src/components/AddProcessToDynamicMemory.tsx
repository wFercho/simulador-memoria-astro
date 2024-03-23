import { useState } from "react"
import { addProcessToDynamicMemory } from "../stores/useDynamicMemoryStore"

function AddProcessToDynamicMemory() {
    const [size, setSize] = useState<string>("")
    const [time, setTime] = useState<string>("")

    const handleOnSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (time && size) {
            addProcessToDynamicMemory({ size:parseInt(size), time:parseInt(time) })
            setSize("")
            setTime("")
        }
    }
    return <form className="max-w-sm mx-auto" onSubmit={e=> handleOnSubmit(e)}>
        <div className="flex gap-x-3 text-center">
            <div className="mb-5">
                <label
                    htmlFor="size-d"
                    className="block mb-2 text-sm font-medium dark:text-white"
                >
                    Tamaño del proceso
                </label>
                <input
                    type="number"
                    id="size-d"
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=""
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                />
            </div>
            <div className="mb-5">
                <label
                    htmlFor="time-d"
                    className="block mb-2 text-sm font-medium dark:text-white"
                >
                    Unidades de tiempo
                </label>
                <input
                    type="number"
                    id="time-d"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>
        </div>

        <div>
            <button
                type="submit"
                className="bg-blue-600 py-2 w-full text-white rounded-md"
            >
                Agregar
            </button>
        </div>
    </form>

}

export { AddProcessToDynamicMemory }
