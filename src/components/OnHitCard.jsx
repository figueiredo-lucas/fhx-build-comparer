import { useMemo } from 'react'
import onHitApi from '../api/onHitApi'
import { getDiffFromClosestWeapon } from '../api/utils'
import { ITEM_SLOT, ITEM_TYPE } from '../assets/itemTypes'
import { getEvasionByItems, getStatBonusByItems, getStatByItems } from '../api/items'

const OnHitCard = ({ build, version = 'v3' }) => {
    const {
        calculateAccuracy,
        calculateBlockChance,
        calculateCritical,
        calculateEvasiveness
    } = useMemo(() => onHitApi(version), [version])

    const denominator = version === 'v1' ? 1 : 3

    const bonuses = getStatBonusByItems(build)

    const dex = parseInt(build.dex || 0) + parseInt(bonuses.dex || 0) / denominator
    const str = parseInt(build.str || 0) + parseInt(bonuses.str || 0)
    const dexDiff = getDiffFromClosestWeapon(build.item, build.level, 0, parseInt(build.dex || 0), 0).dex
    const offhandItem = build.items[ITEM_SLOT.RIGHT_HAND]?.item
    const hasShieldOffhand = offhandItem?.item_type === ITEM_TYPE.SHIELD

    const accuracy = (calculateAccuracy(build.race, dex) || 0) * 100 + getStatByItems(build, [404, -1]).flat
    const critical = (calculateCritical(build.race, dex, dexDiff) || 0) * 100 + getStatByItems(build, [117, -1]).flat
    const evade = (calculateEvasiveness(build.race, dex, dexDiff) || 0) * 100 + getEvasionByItems(build)
    const block = hasShieldOffhand ? calculateBlockChance(build.level, str) + offhandItem.item_block_rate : 0
    
    return (
        <div className="card card-compact bg-primary text-primary-content p-2 max-md:p-1">
            <h2 className="font-bold md:pt-2 max-md:!text-[13px]">On Hit Calculations</h2>
            <div className="card-body grid grid-cols-2 auto-rows-min gap-2 max-md:gap-1 max-md:!p-1 !p-2 max-md:!pt-2 !pt-4 max-md:!text-xs">
                <span>Accuracy</span>
                <span>{accuracy.toFixed(2)}%</span>
                <span>Critical</span>
                <span>{critical.toFixed(2)}%</span>
                <span>Evade</span>
                <span>{evade.toFixed(2)}%</span>
                <span>Block</span>
                <span>{block.toFixed(2)}%</span>
            </div>
        </div>
    )
}

export default OnHitCard