import React from 'react'

const ItemDataCard = ({ build, handleChange }) => {
    return (
        <div className="flex gap-2">
            <div className="flex flex-col gap-2 flex-1">
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Item</span>
                    </div>
                    <input type="text" className="input input-sm input-bordered w-full" list="items" onChange={e => handleChange('itemName', e.target.value)} value={build.itemName} />
                </label>

                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Enchant Level</span>
                    </div>
                    <input type="text" className="input input-sm input-bordered w-full" onChange={e => handleChange('enchantLevel', e.target.value)} value={build.enchantLevel} />
                </label>
            </div>
            {build.charClass === '0' && build.mastery === '6' && <div className="flex flex-col gap-2 flex-1">
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
    )
}

export default ItemDataCard