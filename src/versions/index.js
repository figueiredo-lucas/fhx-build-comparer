import v1 from './v1.json'
import v2 from './v2.json'
import v3 from './v3.json'

// use the same until we have a different one
v2.regeneration = v1.regeneration
v2.constitution = v1.constitution
v2.defense = v1.defense
v3.regeneration = v1.regeneration
v3.constitution = v1.constitution
v3.defense = v1.defense

export default {
    v1, v2, v3
}