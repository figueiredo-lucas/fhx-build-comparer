import { useMemo } from 'react'
import calculationsApi from '../api/calculationsApi'
import { MAGIC_OPTS_TMPL } from '../constants'
import { magicOptFromId } from '../utils'
import constitutionApi from '../api/constitutionApi'

const ItemData = ({ item, enchantLevel = 0, magicOpts = [], version, className = '', shrink }) => {

    const { getMagicDmg, getPhysDmg } = useMemo(() => calculationsApi(version), [version])
    const { getItemPhysDef, getItemMagicDef } = useMemo(() => constitutionApi(version), [version])

    const itemPhysDmg = getPhysDmg(item, enchantLevel, magicOpts)
    const itemMagicDmg = getMagicDmg(item, enchantLevel, magicOpts)
    const itemPhysDef = getItemPhysDef(item, enchantLevel, magicOpts)
    const itemMagicDef = getItemMagicDef(item, enchantLevel, magicOpts)
    
    return (
        <div className={`grid grid-cols-2 gap-1 text-xs ${className}`}>

            {!shrink && <span>Required Level</span>}
            {shrink && <span>Req. Level</span>}
            <span>{item.item_need_level}</span>

            {item.item_need_str > 0 && <>
                {!shrink && <span>Minimum STR</span>}
                {shrink && <span>Min. STR</span>}
                <span>{item.item_need_str}</span>
            </>}

            {item.item_need_dex > 0 && <>
                {!shrink && <span>Minimum DEX</span>}
                {shrink && <span>Min. DEX</span>}
                <span>{item.item_need_dex}</span>
            </>}

            {item.item_need_int > 0 && <>
                {!shrink && <span>Minimum INT</span>}
                {shrink && <span>Min. INT</span>}
                <span>{item.item_need_int}</span>
            </>}

            {item.item_offence_power_min > 0 && <>
                {!shrink && <span>Physical Attack</span>}
                {shrink && <span>Phys. Att.</span>}
                <span>{itemPhysDmg.min} - {itemPhysDmg.max}</span>
            </>}

            {item.item_magic_offence_min > 0 && <>
                {!shrink && <span>Magical Attack</span>}
                {shrink && <span>Mag. Att.</span>}
                <span>{itemMagicDmg.min} - {itemMagicDmg.max}</span>
            </>}

            {item.item_attack_speed > 0 && <>
                {!shrink && <span>Attack Speed</span>}
                {shrink && <span>Att. Sp.</span>}
                <span>{item.item_attack_speed}</span>
            </>}

            {item.item_defense_power > 0 && <>
                {!shrink && <span>Physical Defense</span>}
                {shrink && <span>Phys. Def.</span>}
                <span>{itemPhysDef}</span>
            </>}

            {item.item_magic_defence > 0 && <>
                {!shrink && <span>Magic Defense</span>}
                {shrink && <span>Mag. Def.</span>}
                <span>{itemMagicDef}</span>
            </>}

            {item.item_block_rate > 0 && <>
                {!shrink && <span>Block Chance</span>}
                {shrink && <span>Blk. Chance</span>}
                <span>{item.item_block_rate}%</span>
            </>}
            
            {item.item_dodge_reduce > 0 && <>
                {!shrink && <span>Evasion Decrement</span>}
                {shrink && <span>Evade Decr.</span>}
                <span>{item.item_dodge_reduce}%</span>
            </>}

            {item.item_mana_bonus > 0 && <>
                {!shrink && <span>Mana Regeneration</span>}
                {shrink && <span>MP. Regen.</span>}
                <span>{item.item_mana_bonus}</span>
            </>}

            {item.item_magic_att_1 > 0 &&
                <div className="col-span-2 flex flex-col text-success pt-2">
                    {[1, 2, 3, 4, 5, 6]
                        .filter(i => !!item[MAGIC_OPTS_TMPL[0].replace('[i]', i)])
                        .map(i => {
                            const id = item[MAGIC_OPTS_TMPL[0].replace('[i]', i)]
                            const value = item[MAGIC_OPTS_TMPL[1].replace('[i]', i)]
                            const magicOpt = magicOptFromId(id)
                            if (magicOpt)
                                return <span key={id}>{magicOpt.display_name.replace('[R]', `+${value}`)}</span>
                        })}
                </div>
            }
            
            {item.item_magic_att_1 === -1 &&
                <label className="col-span-2 flex flex-col text-success pt-2">
                    {magicOpts.filter(i => !!i?.name).map((i, idx) => <span key={idx}>{i.name.trim().replace('[R]', `+${parseInt(i.value || 0)}`)}</span>)}
                </label>
            }

        </div>
    )
}

export default ItemData