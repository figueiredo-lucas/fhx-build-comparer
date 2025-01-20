import { useMemo } from 'react'
import constitutionApi from '../api/constitutionApi'

const RegenCard = ({ build, version = 'v3' }) => {
    const {
        calculateHpRegen,
        calculateMpRegen,
        calculateSpRegen
    } = useMemo(() => constitutionApi(version), [version])

    const hpRegen = calculateHpRegen(build)
    const mpRegen = calculateMpRegen(build)
    const spRegen = calculateSpRegen(build)
    
    return (
        <div className="card card-compact bg-secondary text-secondary-content p-2 max-md:p-1">
            <h2 className="font-bold md:pt-2 max-md:!text-[13px]">Regenerations</h2>
            <div className="card-body grid grid-cols-2 auto-rows-min gap-2 max-md:gap-1 max-md:!p-1 !p-2 max-md:!pt-2 !pt-4 max-md:!text-xs">
                <span>HP</span>
                <span>{hpRegen}</span>
                <span>MP</span>
                <span>{mpRegen}</span>
                <span>SP</span>
                <span>{spRegen}</span>
            </div>
        </div>
    )
}

export default RegenCard