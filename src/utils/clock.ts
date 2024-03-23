
interface IClockProps {
    processesTick:() =>void
}
const clock = ({ processesTick }: IClockProps) => setInterval(() => {
    processesTick()
}, 1000)

export { clock }