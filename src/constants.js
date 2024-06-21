export const RACES = {
    1: 'Barbarian',
    2: 'High Elf',
    3: 'Wood Elf'
}

export const CLASSES = {
    0: 'Warrior',
    1: 'Knight',
    2: 'Archer',
    4: 'Paladin',
    5: 'Wizard',
    7: 'Cleric',
    9: 'Summoner'
}

export const RACES_CLASSES = {
    1: [0, 1, 2, 4],
    2: [2, 5, 7, 9],
    3: [0, 2, 5, 9]
}

export const MAGIC_OPTS_TMPL = ['item_magic_att_[i]', 'item_magic_att_[i]_result']

export const MAGIC_OPTS_PYHS = [111, 304]
export const MAGIC_OPTS_MAGIC = [113, 306]

export const MAX_MAGIC_OPTS = 2

export const WEAPON_TYPES = {
    0: 'melee',
    1: 'ranged',
    2: 'melee',
    3: 'melee',
    4: 'melee',
    5: 'melee',
    7: 'magic',
    8: 'magic',
}

export const HAS_MASTERY = [0, 1, 2, 4, 9]

export const NAME_SPLITTING_REGEX = /^(?<name>[\w?\s'-]+)\s\((?<id>\d+)\)$/