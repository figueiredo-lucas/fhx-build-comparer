import DebugCard from "./DebugCard"
import StatsCard from "./StatsCard"
import OnHitCard from "./OnHitCard"
import RegenCard from "./RegenCard"
import CharDataCard from "./CharDataCard"
import BuildHeader from "./BuildHeader"
import SetBuilderModal from "./SetBuilderModal"
import { useState } from "react"

const BuildCard = ({ build, index, handleChange, removeBuild, duplicateBuild }) => {

    const [showInventory, setShowInventory] = useState(false)

    return (
        <div className="card card-compact shadow-xl bg-base-300 p-0 px-2 max-w-[600px]">
            {showInventory && <SetBuilderModal build={build} handleChange={handleChange} setShowInventory={setShowInventory} />}

            <div className="card-body max-md:!px-2">
                <BuildHeader build={build} index={index} handleChange={handleChange} removeBuild={removeBuild} duplicateBuild={duplicateBuild} />
                {/* <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Build name</span>
                    </div>
                    <input type="text" className="input input-sm input-bordered w-full" onChange={e => handleChange('name', e.target.value)} value={build.name} />
                </label> */}
                <div className="divider mb-0">Character data</div>
                <CharDataCard build={build} handleChange={handleChange} />
                <button className="btn btn-link" onClick={() => setShowInventory(true)}>Inventory</button>
                {/* <div className="divider my-0">Item data</div>
                <ItemDataCard build={build} handleChange={handleChange} />
                <div className="grid grid-cols-2 gap-2">
                    {!build.item && build.secondaryItem && <div></div>}
                    {build.item && <ItemCard
                        itemKey="itemMagicOpts"
                        item={build.item}
                        enchantLevel={build.enchantLevel}
                        magicOpts={build.itemMagicOpts}
                        handleChange={handleChange}
                        version={build.version}
                    />}
                    {build.secondaryItem && <ItemCard
                        itemKey="secondaryItemMagicOpts"
                        item={build.secondaryItem}
                        enchantLevel={build.secondaryEnchantLevel}
                        magicOpts={build.secondaryItemMagicOpts}
                        handleChange={handleChange}
                        version={build.version}
                    />}
                </div> */}
                <div className="grid gap-2 grid-cols-2">
                    <StatsCard build={build} version={build.version} />
                    <div className="grid gap-2">
                        <OnHitCard build={build} version={build.version} />
                        <RegenCard build={build} version={build.version} />
                    </div>
                    {window.showDebug && <DebugCard build={build} version={build.version} />}
                </div>
            </div>
        </div>
    )
}

export default BuildCard