import { useMemo } from 'react'
import onHitApi from '../api/onHitApi'

const OnHitCard = ({ build, version = 'v2' }) => {
    const {
        calculateAccuracy,
        calculateBlockChance,
        calculateCritical,
        calculateEvasiveness
    } = useMemo(() => onHitApi(version), [version])
    
    return (
        <div className="card card-compact bg-primary text-primary-content p-2 max-md:p-1">
            <h2 className="font-bold md:pt-2 max-md:!text-[13px]">On Hit Calculations</h2>
            <div className="card-body grid grid-cols-2 auto-rows-min gap-2 max-md:gap-1 max-md:!p-1 !p-2 max-md:!pt-2 !pt-4 max-md:!text-xs">
                <span>Accuracy</span>
                <span>{(calculateAccuracy(build.race, parseInt(build.dex.base || 0) + parseInt(build.dex.bonus || 0) / 3) * 100).toFixed(2)}%</span>
                <span>Critical</span>
                <span>{(calculateCritical(build.race, parseInt(build.dex.base || 0) + parseInt(build.dex.bonus || 0) / 3) * 100).toFixed(2)}%</span>
                <span>Evade</span>
                <span>{(calculateEvasiveness(build.race, parseInt(build.dex.base || 0) + parseInt(build.dex.bonus || 0) / 3) * 100).toFixed(2)}%</span>
                <span>Block</span>
                <span>{calculateBlockChance(build.level, parseInt(build.str.base || 0) + parseInt(build.str.bonus || 0)).toFixed(2)}%</span>
            </div>
        </div>
    )
}

export default OnHitCard