import { useState } from 'react'
import BuildCard from './components/BuildCard'
import { set } from './utils'
import items from './assets/items.json'
import magicOpts from './assets/magic-opts.json'
import { v4 } from 'uuid'
import { filterItemsBySlot, ITEM_SLOT } from './assets/itemTypes'
import { updateBaseStatByRace } from './assets/charData'
import { createEmptyBuild, getBuilds } from './api/builds'

function App() {

    const [builds, setBuilds] = useState(getBuilds)

    const updateBuildInfo = (index, field, value) => {
        const newBuilds = [...builds]
        const newBuild = { ...newBuilds[index] }
        set(newBuild, field, value)

        if (field === 'race') {
            set(newBuild, 'charClass', '')
            set(newBuild, 'masteries', [])
            updateBaseStatByRace(newBuild, value)
        }

        if (field === 'charClass') {
            set(newBuild, 'masteries', [])
        }
        
        if (field === 'race'
            || (field === 'charClass' && newBuild.charClass !== '0')
            || (field === 'mastery' && newBuild.mastery !== '6')) {
            set(newBuild, 'masteries', [])
        }

        newBuilds.splice(index, 1, newBuild)
        setBuilds(newBuilds)
    }

    const removeBuild = index => {
        builds.splice(index, 1)
        const newBuilds = [...builds]
        if (!newBuilds.length)
            newBuilds.push(createEmptyBuild())
        setBuilds(newBuilds)
    }

    const duplicateBuild = index => {
        setBuilds([...builds, {...JSON.parse(JSON.stringify(builds[index])), id: v4()}])
    }

    return (
        <>
            <div className="p-6 -m-6 max-md:-m-2 mb-4 sticky top-0 z-10 flex items-center justify-center gap-4 glass glass-extra">
                <div className="flex flex-col">
                    <span className="text-2xl text-right">FHX Builds</span>
                    <span className="text-xs -mt-2">Test your builds, see your stats</span>
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => setBuilds([...builds, createEmptyBuild()])}>Add Build</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {builds.map((build, index) => <BuildCard key={build.id} build={build}
                    index={index}
                    handleChange={(field, value) => updateBuildInfo(index, field, value)}
                    removeBuild={removeBuild}
                    duplicateBuild={duplicateBuild}
                />)}
            </div>

            <datalist id="items">
                {items
                    .map(it => <option key={it.id} value={`${it.item_name} (${it.id})`}>Level {it.item_need_level}</option>)}
            </datalist>
            {Object.values(ITEM_SLOT).map(slot =>
                <datalist key={slot} id={`items_${slot}`}>
                    {filterItemsBySlot(slot)
                        .map(it => <option key={it.id} value={`${it.item_name} (${it.id})`}>Level {it.item_need_level}</option>)}
                </datalist>
            )}
            <datalist id="magic-opts">
                {magicOpts
                    .filter(mo => !!mo.id_magic_opt && mo.id_magic_opt >= 100)
                    .map(mo => <option key={mo.id_magic_opt} value={mo.display_name}></option>)}
            </datalist>
        </>
    )
}

export default App
