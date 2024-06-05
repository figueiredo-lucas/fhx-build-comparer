import { useMemo } from "react"
import calculationsApi from "../api/calculationsApi"

const StatsCard = ({ build, version = 'v2' }) => {

    const { getStatPhysDmg, getStatMagicDmg } = useMemo(() => calculationsApi(version), [version])

    const physDmg = getStatPhysDmg(build)
    const magicDmg = getStatMagicDmg(build)

    return (
        <div className="card card-compact bg-info p-2 max-md:p-1">
            <h2 className="font-bold md:pt-2 max-md:!text-[13px]">Character Statistics</h2>
            <div className="card-body grid grid-cols-2 auto-rows-min gap-2 max-md:gap-1 max-md:!p-1 !p-2 max-md:!pt-2 !pt-4 max-md:!text-xs">

                <div className="flex rounded border border-neutral px-2 max-md:px-[2px]">
                    <span className="flex-1 text-left">VIT</span>
                    <span className="flex-1"></span>
                </div>
                <div className="flex border border-neutral rounded px-2 max-md:px-[2px]">
                    <span className="flex-1 text-left">DEX</span>
                    <span className="flex-1">{build.dex.base}{build.dex.bonus > 0 && `+${build.dex.bonus}`}</span>
                </div>
                <div className="flex border border-neutral rounded px-2 max-md:px-[2px]">
                    <span className="flex-1 text-left">INT</span>
                    <span className="flex-1">{build.int.base}{build.int.bonus > 0 && `+${build.int.bonus}`}</span>
                </div>
                <div className="flex border border-neutral rounded px-2 max-md:px-[2px]">
                    <span className="flex-1 text-left">STR</span>
                    <span className="flex-1">{build.str.base}{build.str.bonus > 0 && `+${build.str.bonus}`}</span>
                </div>
                <span>Phys. Dmg</span>
                <span>{physDmg.min} - {physDmg.max}</span>
                <span>Mag. Dmg</span>
                <span>{magicDmg.min} - {magicDmg.max}</span>
            </div>
        </div>
    )
}

export default StatsCard