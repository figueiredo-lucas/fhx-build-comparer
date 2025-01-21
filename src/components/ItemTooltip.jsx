import ItemData from './ItemData'

const ItemTooltip = ({ item, enchantLevel, magicOpts, version = 'v3' }) => {

    if (!item) return null

    return (
        <div className="item-tooltip">
            <div className="tooltip-title">{item.item_name}{enchantLevel > 0 && ` +${enchantLevel}`}</div>
            <ItemData item={item} enchantLevel={enchantLevel} magicOpts={magicOpts} version={version} />
        </div>
    )
}

export default ItemTooltip