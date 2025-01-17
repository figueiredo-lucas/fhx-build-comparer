import { useMemo } from 'react'
import onHitApi from '../api/onHitApi'
import { getDiffFromClosestWeapon } from '../api/utils'

const OnHitCard = ({ build, version = 'v3' }) => {
    const {
        calculateAccuracy,
        calculateBlockChance,
        calculateCritical,
        calculateEvasiveness
    } = useMemo(() => onHitApi(version), [version])

    const denominator = version === 'v1' ? 1 : 3

    const dex = parseInt(build.dex.base || 0) + parseInt(build.dex.bonus || 0) / denominator
    const str = parseInt(build.str.base || 0) + parseInt(build.str.bonus || 0)
    const dexDiff = getDiffFromClosestWeapon(build.item, build.level, 0, parseInt(build.dex.base || 0), 0).dex
    
    return (
        <div className="card card-compact bg-primary text-primary-content p-2 max-md:p-1">
            <h2 className="font-bold md:pt-2 max-md:!text-[13px]">On Hit Calculations</h2>
            <div className="card-body grid grid-cols-2 auto-rows-min gap-2 max-md:gap-1 max-md:!p-1 !p-2 max-md:!pt-2 !pt-4 max-md:!text-xs">
                <span>Accuracy</span>
                <span>{((calculateAccuracy(build.race, dex) || 0) * 100).toFixed(2)}%</span>
                <span>Critical</span>
                <span>{((calculateCritical(build.race, dex, dexDiff) || 0) * 100).toFixed(2)}%</span>
                <span>Evade</span>
                <span>{((calculateEvasiveness(build.race, dex, dexDiff) || 0) * 100).toFixed(2)}%</span>
                <span>Block</span>
                <span>{calculateBlockChance(build.level, str).toFixed(2)}%</span>
            </div>
        </div>
    )
}

export default OnHitCard