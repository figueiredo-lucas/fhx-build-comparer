import DebugCard from "./DebugCard"
import ItemCard from "./ItemCard"
import StatsCard from "./StatsCard"
import { CLASSES, HAS_MASTERY, RACES, RACES_CLASSES } from "../constants"
import OnHitCard from "./OnHitCard"
import { discardBuild, isBuildSaved, isBuildUpdated, saveBuild } from "../utils"

const BuildCard = ({ build, index, handleChange, removeBuild }) => {

    const buildCharacterDataName = () => {
        const { race, charClass, level } = build
        let finalText = ''
        if (charClass)
            finalText = CLASSES[charClass]
        if (race)
            finalText += ` (${RACES[race]})`
        if (finalText && level)
            finalText += ` - Level ${level}`

        if (!finalText)
            finalText = `Input data to generate build`

        return finalText.trim()

    }

    return (
        <div className="card card-compact shadow-xl bg-base-300 p-0 px-2">

            <div className="card-body max-md:!px-2">
                <div className="card-title flex justify-between">
                    <select className="select select-sm select-bordered" value={build.version} onChange={e => handleChange('version', e.target.value)}>
                        {['v1', 'v2'].map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                    <div className="flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={() => saveBuild(index)} disabled={isBuildSaved(build) && !isBuildUpdated(build)}>
                            {isBuildSaved(build) && isBuildUpdated(build) ? 'Update' : 'Save'}
                        </button>
                        {isBuildSaved(build) && <button className="btn btn-error btn-sm" onClick={() => {
                            discardBuild(build)
                            removeBuild(index)
                        }}>Discard Save</button>}
                        {!isBuildSaved(build) && <button className="btn btn-error btn-sm" onClick={() => removeBuild(index)}>Delete</button>}
                    </div>
                </div>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Build name</span>
                    </div>
                    <input type="text" className="input input-sm input-bordered w-full" onChange={e => handleChange('name', e.target.value)} value={build.name} />
                </label>
                <div className="divider mb-0">Character data</div>
                <div className="collapse collapse-arrow overflow-visible">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title leading-7">
                        {buildCharacterDataName()}
                    </div>
                    <div className="collapse-content p-0">

                        <div className="grid grid-cols-2 gap-2">
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text">Race</span>
                                </div>
                                <select className="select select-sm select-bordered" value={build.race} onChange={e => handleChange('race', e.target.value)}>
                                    <option disabled value="">Pick one</option>
                                    {Object.keys(RACES).map(k => <option key={k} value={k}>{RACES[k]}</option>)}
                                </select>
                            </label>
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text">Class</span>
                                </div>
                                <select className="select select-sm select-bordered" value={build.charClass} disabled={!build.race} onChange={e => handleChange('charClass', e.target.value)}>
                                    <option disabled value="">Pick one</option>
                                    {!!build.race && RACES_CLASSES[build.race].map(k => <option key={k} value={k}>{CLASSES[k]}</option>)}
                                </select>
                            </label>
                        </div>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Character Level</span>
                            </div>
                            <input type="text" className="input input-sm input-bordered w-full" onChange={e => handleChange('level', e.target.value)} value={build.level} />
                        </label>

                        {HAS_MASTERY.includes(parseInt(build.charClass || -1)) && <label className="form-control">
                            <div className="label">
                                <span className="label-text">Mastery %</span>
                            </div>
                            <input type="text" className="input input-sm input-bordered w-full" onChange={e => handleChange('mastery', e.target.value)} value={build.mastery} />
                        </label>}

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Strength</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" className="input input-sm input-bordered" placeholder="Base STR" onChange={e => handleChange('str.base', e.target.value)} value={build.str.base} />
                                <input type="text" className="input input-sm input-bordered" placeholder="Bonus STR" onChange={e => handleChange('str.bonus', e.target.value)} value={build.str.bonus} />
                            </div>
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Dexterity</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" className="input input-sm input-bordered" placeholder="Base DEX" onChange={e => handleChange('dex.base', e.target.value)} value={build.dex.base} />
                                <input type="text" className="input input-sm input-bordered" placeholder="Bonus DEX" onChange={e => handleChange('dex.bonus', e.target.value)} value={build.dex.bonus} />
                            </div>
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Intelligence</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" className="input input-sm input-bordered" placeholder="Base INT" onChange={e => handleChange('int.base', e.target.value)} value={build.int.base} />
                                <input type="text" className="input input-sm input-bordered" placeholder="Bonus INT" onChange={e => handleChange('int.bonus', e.target.value)} value={build.int.bonus} />
                            </div>
                        </label>

                    </div>
                </div>
                <div className="divider my-0">Item data</div>
                <div className="flex gap-2">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Item</span>
                            </div>
                            <input type="text" className="input input-sm input-bordered w-full" list="items" onChange={e => {
                                console.log(e)
                                handleChange('itemName', e.target.value)
                            }} value={build.itemName} />
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Enchant Level</span>
                            </div>
                            <input type="text" className="input input-sm input-bordered w-full" onChange={e => handleChange('enchantLevel', e.target.value)} value={build.enchantLevel} />
                        </label>
                    </div>
                    {build.charClass === '0' && <div className="flex flex-col gap-2 flex-1">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Secondary Item</span>
                            </div>
                            <input type="text" className="input input-sm input-bordered w-full" list="items" onChange={e => handleChange('secondaryItemName', e.target.value)} value={build.secondaryItemName} />
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Enchant Level</span>
                            </div>
                            <input type="text" className="input input-sm input-bordered w-full" onChange={e => handleChange('secondaryEnchantLevel', e.target.value)} value={build.secondaryEnchantLevel} />
                        </label>
                    </div>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {!build.item && build.secondaryItem && <div></div>}
                    {build.item && <ItemCard item={build.item} enchantLevel={build.enchantLevel} version={build.version} />}
                    {build.secondaryItem && <ItemCard item={build.secondaryItem} enchantLevel={build.secondaryEnchantLevel} version={build.version} />}
                </div>
                <div className="grid gap-2 grid-cols-2">
                    <StatsCard build={build} version={build.version} />
                    <OnHitCard build={build} version={build.version} />
                    {window.showDebug && <DebugCard build={build} version={build.version} />}
                </div>
            </div>
        </div>
    )
}

export default BuildCard