import { useMemo } from "react"
import calculationsApi from "../api/calculationsApi"
import constitutionApi from "../api/constitutionApi"
import { calculateMasteryLevel, getDefenseByItems, getStatBonusByItems } from "../utils"

const StatsCard = ({ build, version = 'v3' }) => {

    const { getStatPhysDmg, getStatMagicDmg } = useMemo(() => calculationsApi(version), [version])
    const {
        calcFullHp,
        calcFullMp,
        calcFullSp,
        calcBasePhysDef,
        calcBaseMagicDef
    } = useMemo(() => constitutionApi(version), [version])

    const physDmg = getStatPhysDmg(build)
    const magicDmg = getStatMagicDmg(build)
    const bonuses = getStatBonusByItems(build)
    const hp = calcFullHp(build)
    const mp = calcFullMp(build)
    const sp = calcFullSp(build)
    const defByItems = getDefenseByItems(build)
    const defMastery = calculateMasteryLevel(build, true)
    const physDef = calcBasePhysDef(build) + defByItems.physDef + defMastery
    const magicDef = calcBaseMagicDef(build) + defByItems.magicDef

    return (
        <div className="card card-compact bg-info p-2 max-md:p-1">
            <h2 className="font-bold md:pt-2 max-md:!text-[13px]">Character Statistics</h2>
            <div className="card-body grid grid-cols-2 auto-rows-min gap-2 max-md:gap-1 max-md:!p-1 !p-2 max-md:!pt-2 !pt-4 max-md:!text-xs">

                <div className="col-span-2 flex border border-neutral rounded px-2 max-md:px-[2px]">
                    <span>HP</span>
                    <span className="flex-1 text-right">{hp}</span>
                </div>

                <div className="col-span-2 flex border border-neutral rounded px-2 max-md:px-[2px]">
                    <span>MP</span>
                    <span className="flex-1 text-right">{mp}</span>
                </div>

                <div className="col-span-2 flex border border-neutral rounded px-2 max-md:px-[2px]">
                    <span>SP</span>
                    <span className="flex-1 text-right">{sp}</span>
                </div>

                <div className="flex rounded border border-neutral px-2 max-md:px-[2px]">
                    <span className="flex-1 text-left">VIT</span>
                    <span className="flex-1">{build.vit}{bonuses.vit > 0 && `+${bonuses.vit}`}</span>
                </div>
                <div className="flex border border-neutral rounded px-2 max-md:px-[2px]">
                    <span className="flex-1 text-left">DEX</span>
                    <span className="flex-1">{build.dex}{bonuses.dex > 0 && `+${bonuses.dex}`}</span>
                </div>
                <div className="flex border border-neutral rounded px-2 max-md:px-[2px]">
                    <span className="flex-1 text-left">INT</span>
                    <span className="flex-1">{build.int}{bonuses.int > 0 && `+${bonuses.int}`}</span>
                </div>
                <div className="flex border border-neutral rounded px-2 max-md:px-[2px]">
                    <span className="flex-1 text-left">STR</span>
                    <span className="flex-1">{build.str}{bonuses.str > 0 && `+${bonuses.str}`}</span>
                </div>
                
                <div className="col-span-2 grid grid-cols-2 gap-1 border border-neutral rounded py-1">
                    <span>Phys. Att.</span>
                    <span>{physDmg.min} - {physDmg.max}</span>

                    <span>Phys. Def.</span>
                    <span>{physDef}</span>

                    <span>Mag. Att.</span>
                    <span>{magicDmg.min} - {magicDmg.max}</span>

                    <span>Mag. Def.</span>
                    <span>{magicDef}</span>
                </div>
                
            </div>
        </div>
    )
}

export default StatsCard