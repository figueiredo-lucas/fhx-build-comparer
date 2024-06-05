import { useState } from 'react'
import BuildCard from './components/BuildCard'
import { itemFromName, set } from './utils'
import items from './assets/items.json'
import ls from './api/localStorage'
import { v4 } from 'uuid'

const createEmptyBuild = () => ({
    id: v4(),
    version: 'v2',
    name: '',
    race: '',
    charClass: '',
    mastery: '',
    level: 1,
    str: {
        base: '',
        bonus: '',
    },
    dex: {
        base: '',
        bonus: '',
    },
    int: {
        base: '',
        bonus: '',
    },
    item: null,
    itemName: '',
    secondaryItem: null,
    secondaryItemName: '',
    enchantLevel: 0,
    secondaryEnchantLevel: 0
})

function App() {

    const [builds, setBuilds] = useState(ls.get('fhx.builds') || [createEmptyBuild()])

    const updateBuildInfo = (index, field, value) => {
        const newBuilds = [...builds]
        const newBuild = { ...newBuilds[index] }
        set(newBuild, field, value)

        if (field === 'race')
            set(newBuild, 'charClass', '')
        if (field === 'charClass' && newBuild.charClass !== '0') {
            set(newBuild, 'secondaryItem', null)
            set(newBuild, 'secondaryItemName', null)
            set(newBuild, 'secondaryEnchantLevel', 0)
        }

        if (field === 'itemName')
            set(newBuild, 'item', itemFromName(value) || null)

        if (field === 'secondaryItemName')
            set(newBuild, 'secondaryItem', itemFromName(value) || null)

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

    return (
        <>
            <div className="p-6 -m-6 max-md:-m-2 mb-4 sticky top-0 z-10 flex items-center justify-center gap-4 glass glass-extra">
                <div className="flex flex-col">
                    <span className="text-2xl text-right">FHX Builds</span>
                    <span className="text-xs -mt-2">Test your builds, see your stats</span>
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => setBuilds([...builds, createEmptyBuild()])}>Add Build</button>
            </div>


            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {builds.map((build, index) => <BuildCard key={build.id} build={build}
                    index={index}
                    handleChange={(field, value) => updateBuildInfo(index, field, value)}
                    removeBuild={removeBuild}
                />)}
            </div>
            <datalist id="items">
                {items.map(it => <option key={it.id} value={it.item_name}>Level {it.item_need_level}</option>)}
            </datalist>
        </>
    )
}

export default App
