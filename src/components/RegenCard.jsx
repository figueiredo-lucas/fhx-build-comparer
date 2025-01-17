import { useMemo } from 'react'
import constitutionApi from '../api/constitutionApi'

const RegenCard = ({ build, version = 'v3' }) => {
    const {
        calculateHpRegen,
        calculateMpRegen,
        calculateSpRegen
    } = useMemo(() => constitutionApi(version), [version])
    
    return (
        <div className="card card-compact bg-secondary text-secondary-content p-2 max-md:p-1">
            <h2 className="font-bold md:pt-2 max-md:!text-[13px]">Regenerations</h2>
            <div className="card-body grid grid-cols-2 auto-rows-min gap-2 max-md:gap-1 max-md:!p-1 !p-2 max-md:!pt-2 !pt-4 max-md:!text-xs">
                <span>HP</span>
                <span>{calculateHpRegen(parseInt(build.level), build.vit.base || 0)}</span>
                <span>MP</span>
                <span>{calculateMpRegen(parseInt(build.level), build.int.base || 0)}</span>
                <span>SP</span>
                <span>{calculateSpRegen(parseInt(build.level), build.vit.base || 0)}</span>
            </div>
        </div>
    )
}

export default RegenCard