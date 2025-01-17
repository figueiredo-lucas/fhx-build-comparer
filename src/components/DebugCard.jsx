import { useCallback } from 'react'
import calculationsApi from '../api/calculationsApi'
import { WEAPON_TYPES } from '../constants'

const DebugCard = ({ build, version = 'v3' }) => {

    const { calcBaseDmg, getGlassCannonPercent, types } = useCallback(() => calculationsApi(version), [version])(version)
    const weaponType = WEAPON_TYPES[build.item?.item_type]
    const weaponTypePhys = WEAPON_TYPES[build.item?.item_type] === 'magic' ? 'melee' : WEAPON_TYPES[build.item?.item_type]

    const statDiff = {
        'dex': Math.max(0, parseInt(build.dex.base || 0) - (build.item?.item_need_dex || 0)),
        'str': Math.max(0, parseInt(build.str.base || 0) - (build.item?.item_need_str || 0)),
        'intel': Math.max(0, parseInt(build.int.base || 0) - (build.item?.item_need_int || 0))
    }

    return (
        <div className="card card-compact bg-secondary text-secondary-content p-2 max-md:col-span-2">
            <h2 className="font-bold md:pt-2 max-md:!text-[13px]">Debug</h2>
            <div className="card-body grid grid-cols-2 auto-rows-min gap-2 max-md:gap-1 max-md:!p-1 !p-2 max-md:!pt-2 !pt-4 max-md:!text-xs">
                <span>Base Dmg</span>
                <span>{(calcBaseDmg(types[weaponType], build.level) || 0).toFixed(4)}</span>
                <span>Str Per Point</span>
                <span>{(calcBaseDmg(types[weaponTypePhys]?.str, build.level) || 0).toFixed(4)}</span>
                <span>Dex Per Point</span>
                <span>{(calcBaseDmg(types[weaponTypePhys]?.dex, build.level) || 0).toFixed(4)}</span>
                <span>Int Per Point</span>
                <span>{(calcBaseDmg(types[weaponType]?.int, build.level) || 0).toFixed(4)}</span>
                <span>GlassCannon Str</span>
                <span>{(getGlassCannonPercent('str', statDiff) * 100).toFixed(2)}%</span>
                <span>GlassCannon Dex</span>
                <span>{(getGlassCannonPercent('dex', statDiff) * 100).toFixed(2)}%</span>
                <span>GlassCannon Int</span>
                <span>{(getGlassCannonPercent('intel', statDiff) * 100).toFixed(2)}%</span>
            </div>
        </div>
    )
}

export default DebugCard