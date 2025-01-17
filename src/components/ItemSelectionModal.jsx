import React, { useState } from 'react'
import { NAME_SPLITTING_REGEX } from '../constants'
import { itemFromId } from '../utils'
import { isEnchantable, SIZE_BY_SLOT } from '../assets/itemTypes'
import ItemData from './ItemData'

const ItemSelectionModal = ({ version = 'v3', item, enchantLevel, magicOpts = [], slot, setSlot, saveSelection }) => {

    const [name, setName] = useState(item?.item_name || '')
    const [selectionItem, setSelectionItem] = useState(item)
    const [selectedEnchantLevel, setSelectedEnchantLevel] = useState(enchantLevel || '')
    const [selectedMagicOpts, setSelectedMagicOpts] = useState(magicOpts)
    const [showMagicOpts, setShowMagicOpts] = useState(false)

    const selectItem = (value) => {
        const found = value.match(NAME_SPLITTING_REGEX)
        setSelectionItem(null)
        setName(value)
        if (found) {
            const { id, name } = found.groups
            setName(name)
            const item = itemFromId(id) || null
            setSelectionItem(item)

            if (item && !isEnchantable(item))
                setSelectedEnchantLevel(null)

            if (item?.item_magic_att_1 > 0)
                setSelectedMagicOpts([])

            setShowMagicOpts(false)
        }
    }

    const selectMagicOpt = (opt, key, idx) => {
        const copy = [...selectedMagicOpts]
        copy[idx] = copy[idx] || {}
        copy[idx][key] = opt
        setSelectedMagicOpts(copy)
    }

    return (
        <div className="item-selection-overlay">
            <div className="item-selection-modal">
                <div className="modal-header">
                    Select Item
                </div>
                <div className="flex flex-col gap-2 flex-1 modal-body !p-4 justify-between">
                    <label className="form-control">
                        <div className="label pt-0 pb-1">
                            <span className="label-text text-xs">Item</span>
                        </div>
                        <input autoFocus type="text" className="input input-xs input-bordered w-full"
                            list={`items_${slot}`} onChange={ev => selectItem(ev.target.value)} value={name || ''} />
                    </label>

                    {selectionItem && isEnchantable(selectionItem) && <label className="form-control">
                        <div className="label pt-0 pb-1">
                            <span className="label-text text-xs">Enchant Level</span>
                        </div>
                        <input type="text" className="input input-xs input-bordered w-full"
                            onChange={e => setSelectedEnchantLevel(e.target.value)} value={selectedEnchantLevel || 0} />
                    </label>}

                    {selectionItem &&
                        <div className="flex gap-4 items-start mt-2 flex-1">
                            <div className="flex flex-col justify-between">
                                <div style={{ '--imagesrc': `url('items/${selectionItem.item_icon}')` }}
                                    className={`item-slot ${SIZE_BY_SLOT[slot]} bg-image no-effect mx-auto`}>
                                </div>
                                {selectionItem.item_magic_att_1 === -1 &&
                                    <span className="btn btn-link btn-xs" onClick={() => setShowMagicOpts(!showMagicOpts)}>Edit Stats</span>
                                }
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                
                                {!showMagicOpts && <ItemData
                                    shrink={true}
                                    item={selectionItem}
                                    enchantLevel={selectedEnchantLevel}
                                    magicOpts={selectedMagicOpts}
                                    version={version} />}

                                {showMagicOpts && new Array(6).fill(0).map((_, idx) =>
                                    <div key={idx} className="grid grid-cols-4 join">
                                        <input
                                            type="text"
                                            className="col-span-3 input input-bordered input-xs join-item"
                                            list="magic-opts"
                                            onChange={(e) => selectMagicOpt(e.target.value, 'name', idx)}
                                            value={selectedMagicOpts[idx]?.name || ''}
                                        />
                                        <input
                                            type="text"
                                            className="input input-bordered input-xs join-item"
                                            onChange={(e) => selectMagicOpt(e.target.value, 'value', idx)}
                                            value={selectedMagicOpts[idx]?.value || ''}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    <div className="flex gap-2">
                        <button className="btn btn-neutral flex-1 btn-xs" onClick={() => setSlot(null)}>Cancel</button>
                        <button
                            className="btn btn-primary flex-1 btn-xs"
                            onClick={() => saveSelection(selectionItem, selectedEnchantLevel, selectedMagicOpts, slot)}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemSelectionModal