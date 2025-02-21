import { ITEM_SLOT, ITEM_TYPE } from "./itemTypes"

const masteries = [
    {
        "id": 0,
        "charClass": 0,
        "name": "Axe Mastery",
        "value_min_n_1": 1.00,
        "value_max_n_1": 1.00,
        "diff_min_max_1": 0.58,
        "level": 1,
        "max_level": 100,
        shouldApply: (build) => {
            const mainHand = build.items[ITEM_SLOT.LEFT_HAND]
            const offhand = build.items[ITEM_SLOT.RIGHT_HAND]
            const validFirstItem = mainHand?.item && mainHand?.item.item_type === ITEM_TYPE.AXE
            const validSecondItem = !offhand?.item || offhand?.item.item_type === ITEM_TYPE.SHIELD

            return validFirstItem && validSecondItem
        }
    },
    {
        "id": 1,
        "charClass": 0,
        "name": "Defense Mastery",
        "isDefensive": true,
        "value_min_n_1": 1.000000000000,
        "value_max_n_1": 1.000000000000,
        "diff_min_max_1": 1.000000000000,
        "level": 1,
        "max_level": 100,
        shouldApply: () => true
    },
    {
        "id": 6,
        "charClass": 0,
        "name": "Dual Weapon Mastery",
        "value_min_n_1": 1.00,
        "value_max_n_1": 1.00,
        "diff_min_max_1": 0.80,
        "level": 10,
        "max_level": 80,
        shouldApply: (build) => {
            const mainHand = build.items[ITEM_SLOT.LEFT_HAND]
            const offhand = build.items[ITEM_SLOT.RIGHT_HAND]
            const validFirstItem = mainHand?.item && [ITEM_TYPE.AXE, ITEM_TYPE.SWORD].includes(mainHand?.item.item_type)
            const validSecondItem = offhand?.item && offhand?.item !== ITEM_TYPE.SHIELD

            return validFirstItem && validSecondItem
        }
    },
    {
        "id": 100,
        "charClass": 1,
        "name": "Sword Mastery",
        "value_min_n_1": 1.00,
        "value_max_n_1": 1.00,
        "diff_min_max_1": 0.62,
        "level": 1,
        "max_level": 100,
        shouldApply: (build) => {
            const mainHand = build.items[ITEM_SLOT.LEFT_HAND]
            const offhand = build.items[ITEM_SLOT.RIGHT_HAND]
            const validFirstItem = mainHand?.item && mainHand?.item.item_type === ITEM_TYPE.SWORD
            const validSecondItem = !offhand?.item || offhand?.item.item_type === ITEM_TYPE.SHIELD

            return validFirstItem && validSecondItem
        }
    },
    {
        "id": 101,
        "charClass": 1,
        "name": "Defense Mastery",
        "isDefensive": true,
        "value_min_n_1": 3.000000000000,
        "value_max_n_1": 3.000000000000,
        "diff_min_max_1": 1.000000000000,
        "level": 1,
        "max_level": 100,
        shouldApply: () => true
    },
    {
        "id": 106,
        "charClass": 1,
        "name": "Shield Mastery",
        "isDefensive": true,
        "value_min_n_1": 3.000000000000,
        "value_max_n_1": 3.000000000000,
        "diff_min_max_1": 1.500000000000,
        "level": 10,
        "max_level": 100,
        shouldApply: (build) => {
            const offhand = build.items[ITEM_SLOT.RIGHT_HAND]
            return offhand?.item && offhand?.item.item_type === ITEM_TYPE.SHIELD
        }
    },
    {
        "id": 200,
        "charClass": 2,
        "name": "Bow Mastery",
        "value_min_n_1": 1.00,
        "value_max_n_1": 1.00,
        "diff_min_max_1": 0.80,
        "level": 1,
        "max_level": 100,
        shouldApply: (build) => {
            const mainHand = build.items[ITEM_SLOT.LEFT_HAND]
            const offhand = build.items[ITEM_SLOT.RIGHT_HAND]
            return mainHand?.item && mainHand?.item.item_type === ITEM_TYPE.BOW ||
                offhand?.item && offhand?.item.item_type === ITEM_TYPE.BOW
        }
    },
    {
        "id": 400,
        "charClass": 4,
        "name": "Sword Mastery",
        "value_min_n_1": 1.00,
        "value_max_n_1": 1.00,
        "diff_min_max_1": 0.65,
        "level": 1,
        "max_level": 100,
        shouldApply: (build) => {
            const mainHand = build.items[ITEM_SLOT.LEFT_HAND]
            const offhand = build.items[ITEM_SLOT.RIGHT_HAND]
            const validFirstItem = mainHand?.item && mainHand?.item.item_type === ITEM_TYPE.SWORD
            const validSecondItem = !offhand?.item || offhand?.item.item_type === ITEM_TYPE.SHIELD

            return validFirstItem && validSecondItem
        }
    },
    {
        "id": 401,
        "charClass": 4,
        "name": "Mace Mastery",
        "value_min_n_1": 1.00,
        "value_max_n_1": 1.00,
        "diff_min_max_1": 0.65,
        "level": 1,
        "max_level": 100,
        shouldApply: (build) => {
            const mainHand = build.items[ITEM_SLOT.LEFT_HAND]
            const offhand = build.items[ITEM_SLOT.RIGHT_HAND]
            const validFirstItem = mainHand?.item && mainHand?.item.item_type === ITEM_TYPE.MACE
            const validSecondItem = !offhand?.item || offhand?.item.item_type === ITEM_TYPE.SHIELD

            return validFirstItem && validSecondItem
        }
    },
    {
        "id": 406,
        "charClass": 4,
        "name": "Shield Mastery",
        "isDefensive": true,
        "value_min_n_1": 2.000000000000,
        "value_max_n_1": 2.000000000000,
        "diff_min_max_1": 1.500000000000,
        "level": 10,
        "max_level": 100,
        shouldApply: (build) => {
            const offhand = build.items[ITEM_SLOT.RIGHT_HAND]
            return offhand?.item && offhand?.item.item_type === ITEM_TYPE.SHIELD
        }
    },
    {
        "id": 900,
        "charClass": 9,
        "name": "Polearm Mastery",
        "value_min_n_1": 1.00,
        "value_max_n_1": 1.00,
        "diff_min_max_1": 0.65,
        "level": 1,
        "max_level": 100,
        shouldApply: (build) => {
            const mainHand = build.items[ITEM_SLOT.LEFT_HAND]
            const offhand = build.items[ITEM_SLOT.RIGHT_HAND]
            return mainHand?.item && mainHand?.item.item_type === ITEM_TYPE.POLE ||
                offhand?.item && offhand?.item.item_type === ITEM_TYPE.POLE
        }
    }
]

export default masteries