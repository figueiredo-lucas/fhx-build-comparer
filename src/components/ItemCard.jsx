import { useMemo, useState } from "react"
import calculationsApi from "../api/calculationsApi"
import { MAGIC_OPTS_TMPL } from "../constants"
import { magicOptFromId } from "../utils"
import MagicOptsDrawer from "./MagicOptsDrawer"

const ItemCard = ({ itemKey, item, enchantLevel, magicOpts = [], handleChange, version = 'v2' }) => {


    const { getMagicDmg, getPhysDmg } = useMemo(() => calculationsApi(version), [version])
    const itemPhysDmg = getPhysDmg(item, enchantLevel, magicOpts)
    const itemMagicDmg = getMagicDmg(item, enchantLevel, magicOpts)

    return (
        <div className="item-card">
            <div className="card card-compact bg-base-100 p-2 max-md:p-1">
                <h2 className="font-bold max-md:pt-1 pt-2 max-md:!text-[13px]">{item.item_name}{enchantLevel > 0 && ` +${enchantLevel}`}</h2>
                <div className="card-body grid grid-cols-2 max-md:gap-1 max-md:!p-1 !p-2 max-md:!pt-2 !pt-4 max-md:!text-xs">

                    <span className="max-md:hidden">Required Level</span>
                    <span className="md:hidden">Req. Level</span>
                    <span>{item.item_need_level}</span>

                    {item.item_need_str && <>
                        <span className="max-md:hidden">Minimum STR</span>
                        <span className="md:hidden">Min. STR</span>
                        <span>{item.item_need_str}</span>
                    </>}

                    {item.item_need_dex && <>
                        <span className="max-md:hidden">Minimum DEX</span>
                        <span className="md:hidden">Min. DEX</span>
                        <span>{item.item_need_dex}</span>
                    </>}

                    {item.item_need_int && <>
                        <span className="max-md:hidden">Minimum INT</span>
                        <span className="md:hidden">Min. INT</span>
                        <span>{item.item_need_int}</span>
                    </>}

                    <span className="max-md:hidden">Physical Attack</span>
                    <span className="md:hidden">Phys. Atk</span>
                    <span>{itemPhysDmg.min} - {itemPhysDmg.max}</span>

                    {item.item_magic_offence_min && <>
                        <span className="max-md:hidden">Magical Attack</span>
                        <span className="md:hidden">Mag. Atk</span>
                        <span>{itemMagicDmg.min} - {itemMagicDmg.max}</span>
                    </>}

                    <span className="max-md:hidden">Attack Speed</span>
                    <span className="md:hidden">Atk. Spd</span>
                    <span>{item.item_attack_speed}</span>

                    {item.item_magic_att_1 && <div className="col-span-2 flex flex-col text-success pt-2">
                        {[1, 2, 3, 4, 5, 6]
                            .filter(i => !!item[MAGIC_OPTS_TMPL[0].replace('[i]', i)])
                            .map(i => {
                                const id = item[MAGIC_OPTS_TMPL[0].replace('[i]', i)]
                                const value = item[MAGIC_OPTS_TMPL[1].replace('[i]', i)]
                                const magicOpt = magicOptFromId(id)
                                return <span key={id}>{magicOpt.display_name.replace('[R]', `+${value}`)}</span>
                            })}
                    </div>}

                    {!item.item_magic_att_1 && <label htmlFor="check-drawer" className="col-span-2 cursor-pointer flex flex-col text-success pt-2">
                        {magicOpts.filter(i => !!i.name).map((i, idx) => <span key={idx}>{i.name.replace('[R]', `+${i.value}`)}</span>)}
                        <span className="text-primary pt-2" htmlFor="check-drawer">Edit Magic Opts</span>
                    </label>}

                </div>

            </div>
            <MagicOptsDrawer itemKey={itemKey} magicOpts={magicOpts} handleChange={handleChange} />
        </div>
    )
}

export default ItemCard