import React from 'react'
import { CLASSES, HAS_MASTERY, RACES, RACES_CLASSES } from "../constants"
import { masteriesFromCharClass } from "../utils"

const CharDataCard = ({ build, handleChange }) => {

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
        <div className="collapse collapse-arrow overflow-visible">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title leading-7">
                {buildCharacterDataName()}
            </div>
            <div className="collapse-content !p-0">

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
                    <input type="text" className="input input-sm input-bordered" onChange={e => handleChange('level', e.target.value)} value={build.level} />
                </label>

                {HAS_MASTERY.includes(parseInt(build.charClass || -1)) &&
                    <div className="grid grid-cols-1 gap-2">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Masteries</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {masteriesFromCharClass(build.charClass).map((mastery, idx) =>
                                    <div key={mastery.id} className="grid grid-cols-4 join w-full">
                                        <span className="col-span-3 input input-bordered bg-base-300 input-xs text-left px-2 join-item">{mastery.name}</span>
                                        <input
                                            type="text"
                                            className="input input-bordered input-xs join-item"
                                            onChange={(e) => handleChange(`masteries[${idx}]`, e.target.value)}
                                            value={build.masteries[idx] || ''}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* <select className="select select-sm select-bordered" value={build.mastery} onChange={e => handleChange('mastery', e.target.value)}>
                                <option disabled value="">Pick one</option>
                                {masteriesFromCharClass(build.charClass).map(mastery => <option key={mastery.id} value={mastery.id}>{mastery.name}</option>)}
                            </select> */}
                        </label>
                        {/* <label className="form-control">
                            <div className="label">
                                <span className="label-text">Mastery Level</span>
                            </div>
                            <input type="text" className="input input-sm input-bordered" onChange={e => handleChange('masteryLevel', e.target.value)} value={build.masteryLevel} />
                        </label> */}
                    </div>
                }
                <div className="grid grid-cols-2 gap-2">

                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Vitality</span>
                        </div>
                        <input type="text" className="input input-sm input-bordered" placeholder="Base VIT" onChange={e => handleChange('vit.base', e.target.value)} value={build.vit.base} />
                    </label>

                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Dexterity</span>
                        </div>
                        <input type="text" className="input input-sm input-bordered" placeholder="Base DEX" onChange={e => handleChange('dex.base', e.target.value)} value={build.dex.base} />
                    </label>

                </div>

                <div className="grid grid-cols-2 gap-2">

                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Intelligence</span>
                        </div>
                        <input type="text" className="input input-sm input-bordered" placeholder="Base INT" onChange={e => handleChange('int.base', e.target.value)} value={build.int.base} />
                    </label>

                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Strength</span>
                        </div>
                        <input type="text" className="input input-sm input-bordered" placeholder="Base STR" onChange={e => handleChange('str.base', e.target.value)} value={build.str.base} />
                    </label>

                </div>

            </div>
        </div>
    )
}

export default CharDataCard