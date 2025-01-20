import React, { useState } from 'react'
import ItemSelectionModal from './ItemSelectionModal'
import { ITEM_HAND_TYPE, ITEM_SLOT } from '../assets/itemTypes'
import ItemTooltip from './ItemTooltip'

const SetBuilderModal = ({ build, handleChange, setShowInventory }) => {

    const [slot, setSlot] = useState(null)

    const saveSelection = (item, enchantLevel = 0, magicOpts = [], itemSlot) => {
        setSlot(null)
        handleChange(`items[${itemSlot}]`, { item, enchantLevel, magicOpts })

        if (![ITEM_SLOT.LEFT_HAND, ITEM_SLOT.RIGHT_HAND].includes(itemSlot)) return

        setTimeout(() => {
            const oppositeSlot = itemSlot === ITEM_SLOT.LEFT_HAND ? ITEM_SLOT.RIGHT_HAND : ITEM_SLOT.LEFT_HAND
            
            if (item?.hand_type === ITEM_HAND_TYPE.TWO_HANDED) {
                
                handleChange(`items[${oppositeSlot}]`, { item: null, enchantLevel: null, magicOpts: [] })

            } else if (item?.hand_type === ITEM_HAND_TYPE.ONE_HANDED) {

                const oppositeItem = build.items[oppositeSlot]
                if (oppositeItem?.item && oppositeItem.item.hand_type === ITEM_HAND_TYPE.TWO_HANDED) {
                    handleChange(`items[${oppositeSlot}]`, { item: null, enchantLevel: null, magicOpts: [] })
                }

            }
        }, 0)
    }

    const getItem = slot => build.items?.[slot] || {}

    const getHandItem = slot => {
        const oppositeSlot = slot === ITEM_SLOT.LEFT_HAND ? ITEM_SLOT.RIGHT_HAND : ITEM_SLOT.LEFT_HAND
        const item = getItem(slot)
        const oppositeItem = getItem(oppositeSlot)

        if (!oppositeItem?.item && item?.item)
            return item
        else if (!item?.item && oppositeItem?.item && oppositeItem?.item?.hand_type === ITEM_HAND_TYPE.TWO_HANDED)
            return oppositeItem
        return item
    }

    return (
        <div className="set-builder-overlay" onClick={(ev) => ev.target.classList.contains('set-builder-overlay') && setShowInventory(false)}>
            <div className="set-builder-modal">
                {slot && <ItemSelectionModal
                    {...getItem(slot)}
                    slot={slot}
                    setSlot={setSlot}
                    saveSelection={saveSelection} />}
                <div className="modal-header">
                    Inventory
                </div>
                <div className="modal-body">
                    <div className="flex gap-2">
                        <div className="grid grid-cols-2 gap-[1px]">
                            <div
                                style={{ '--imagesrc': `url('items/${getItem(ITEM_SLOT.NECK).item?.item_icon}')` }}
                                className="col-start-2 item-slot slot-square-sm bg-image"
                                onClick={() => setSlot(ITEM_SLOT.NECK)}>
                                <ItemTooltip {...getItem(ITEM_SLOT.NECK)} />
                            </div>
                            <div
                                style={{ '--imagesrc': `url('items/${getItem(ITEM_SLOT.RING_L).item?.item_icon}')` }}
                                className="item-slot slot-square-sm bg-image"
                                onClick={() => setSlot(ITEM_SLOT.RING_L)}>
                                <ItemTooltip {...getItem(ITEM_SLOT.RING_L)} />
                            </div>
                            <div
                                style={{ '--imagesrc': `url('items/${getItem(ITEM_SLOT.RING_R).item?.item_icon}')` }}
                                className="item-slot slot-square-sm bg-image"
                                onClick={() => setSlot(ITEM_SLOT.RING_R)}>
                                <ItemTooltip {...getItem(ITEM_SLOT.RING_R)} />
                            </div>
                        </div>
                        <div
                            style={{ '--imagesrc': `url('items/${getItem(ITEM_SLOT.FOREHEAD).item?.item_icon}')` }}
                            className="item-slot slot-square-md bg-image"
                            onClick={() => setSlot(ITEM_SLOT.FOREHEAD)}>
                            <ItemTooltip {...getItem(ITEM_SLOT.FOREHEAD)} />
                        </div>
                        <div
                            style={{ '--imagesrc': `url('items/${getItem(ITEM_SLOT.BACK).item?.item_icon}')` }}
                            className="item-slot slot-square-md bg-image"
                            onClick={() => setSlot(ITEM_SLOT.BACK)}>
                            <ItemTooltip {...getItem(ITEM_SLOT.BACK)} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex flex-col gap-2">
                            <div
                            style={{ '--imagesrc': `url('items/${getHandItem(ITEM_SLOT.LEFT_HAND).item?.item_icon}')` }}
                                className="item-slot slot-rect-md bg-image"
                                onClick={() => setSlot(ITEM_SLOT.LEFT_HAND)}>
                                <ItemTooltip {...getHandItem(ITEM_SLOT.LEFT_HAND)} />
                            </div>
                            <div
                            style={{ '--imagesrc': `url('items/${getItem(ITEM_SLOT.GLOVE).item?.item_icon}')` }}
                                className="item-slot slot-square-md bg-image"
                                onClick={() => setSlot(ITEM_SLOT.GLOVE)}>
                                <ItemTooltip {...getItem(ITEM_SLOT.GLOVE)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div
                            style={{ '--imagesrc': `url('items/${getItem(ITEM_SLOT.CHEST).item?.item_icon}')` }}
                                className="item-slot slot-rect-sm bg-image"
                                onClick={() => setSlot(ITEM_SLOT.CHEST)}>
                                <ItemTooltip {...getItem(ITEM_SLOT.CHEST)} />
                            </div>
                            <div
                            style={{ '--imagesrc': `url('items/${getItem(ITEM_SLOT.PANTS).item?.item_icon}')` }}
                                className="item-slot slot-rect-sm bg-image"
                                onClick={() => setSlot(ITEM_SLOT.PANTS)}>
                                <ItemTooltip {...getItem(ITEM_SLOT.PANTS)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div
                            style={{ '--imagesrc': `url('items/${getHandItem(ITEM_SLOT.RIGHT_HAND).item?.item_icon}')` }}
                                className="item-slot slot-rect-md bg-image"
                                onClick={() => setSlot(ITEM_SLOT.RIGHT_HAND)}>
                                <ItemTooltip {...getHandItem(ITEM_SLOT.RIGHT_HAND)} />
                            </div>
                            <div
                            style={{ '--imagesrc': `url('items/${getItem(ITEM_SLOT.FEET).item?.item_icon}')` }}
                                className="item-slot slot-square-md bg-image"
                                onClick={() => setSlot(ITEM_SLOT.FEET)}>
                                <ItemTooltip {...getItem(ITEM_SLOT.FEET)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetBuilderModal