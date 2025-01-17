import items from './items.json'

export const ITEM_TYPE = {
	SWORD: 0,
	BOW: 1,
	MACE: 2,
	AXE: 3,
	POLE: 4,
	DAGGER: 5,
	DART: 6,
	WAND: 7,
	STAFF: 8,
	ROBE: 11,
	SHIELD: 12,
	HELMET: 13,
	JACKET: 14,
	PANTS: 15,
	GLOVES: 16,
	SHOES: 17,
	CAPE: 18,
	NECKLACE: 19,
	RING: 20,
	CIRCLET: 21,
}

export const ITEM_SLOT = {
    NA: 0,
    FOREHEAD: 1 << 0,
    CHEST: 1 << 1,
    PANTS: 1 << 2,
    GLOVE: 1 << 3,
    FEET: 1 << 4,
    BACK: 1 << 5,
    RIGHT_HAND: 1 << 6,
    LEFT_HAND: 1 << 7,
    NECK: 1 << 8,
    RING_L: 1 << 9,
    RING_R: 1 << 10
}

export const SIZE_BY_SLOT = {
    [ITEM_SLOT.FOREHEAD]: 'slot-square-md',
    [ITEM_SLOT.CHEST]: 'slot-rect-sm',
    [ITEM_SLOT.PANTS]: 'slot-rect-sm',
    [ITEM_SLOT.GLOVE]: 'slot-square-md',
    [ITEM_SLOT.FEET]: 'slot-square-md',
    [ITEM_SLOT.BACK]: 'slot-square-md',
    [ITEM_SLOT.RIGHT_HAND]: 'slot-rect-md',
    [ITEM_SLOT.LEFT_HAND]: 'slot-rect-md',
    [ITEM_SLOT.NECK]: 'slot-square-sm',
    [ITEM_SLOT.RING_L]: 'slot-square-sm',
    [ITEM_SLOT.RING_R]: 'slot-square-sm',
}

export const ITEM_RACE = {
    NO_RACE: 0,
    HUMAN: 1 << 0,
    BARB: 1 << 1,
    HIGHELF: 1 << 2,
    WOODELF: 1 << 3,
    DWARF: 1 << 4,
    GNOME: 1 << 5
};

export const ITEM_CLASS = {
    NO_CLASS: 0,
    WARRIOR: 1 << 0,
    KNIGHT: 1 << 1,
    ARCHER: 1 << 2,
    THIEF: 1 << 3,
    PALADIN: 1 << 4,
    WIZARD: 1 << 5,
    ENCHANTER: 1 << 6,
    CLERIC: 1 << 7,
    NECRO: 1 << 8,
    SUMMONER: 1 << 9
};

export const ITEM_HAND_TYPE = {
    ONE_HANDED: 0,
    TWO_HANDED: 1
}

export const ITEM_FUNC = {
	NORMAL: 0,
	UNTRADEABLE: 1 << 2, // quest items
	MANUFAC_KIT: 1 << 4,
	UPGRADE_KIT: 1 << 5,
	GUILD_CLOAK: 1 << 6,
	USE_ITEM: 1 << 7, // scrolls, potions
	TELE_BIND: 1 << 8, // Mirror of Summoning
	ENCHANTABLE: 1 << 9,
	ENCHANT_TOOL: 1 << 10, // improve enchanting
	ACCOUNT_EXCLUSIVE: 1 << 11
};

export const filterItemsBySlot = (slot, itemsList = items) =>
    itemsList.filter(it => it.item_equip_type & slot)

export const filterItemsByHandType = (handType, itemsList = items) =>
    itemsList.filter(it => it.hand_type === handType)

export const filterItemsByType = (type, itemsList = items) =>
    itemsList.filter(it => it.item_type === type)

export const isEnchantable = item => !!(item.item_func_flag & ITEM_FUNC.ENCHANTABLE)