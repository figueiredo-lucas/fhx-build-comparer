import { v4 } from "uuid"
import ls from "./localStorage"
import { isEqual } from "../utils"

export const createEmptyBuild = () => ({
    id: v4(),
    version: 'v3',
    name: '',
    race: '',
    charClass: '',
    masteries: [],
    level: 1,
    vit: '',
    str: '',
    dex: '',
    int: '',
    items: {},
})

export const saveBuild = build => {
    const builds = ls.get('fhx.builds') || []
    const idx = builds.findIndex(b => b.id === build.id)
    if (idx > -1) {
        builds.splice(idx, 1, build)
    } else {
        builds.push(build)
    }
    ls.set('fhx.builds', builds)
}

export const discardBuild = build => {
    const builds = ls.get('fhx.builds') || []
    const idx = builds.findIndex(b => b.id === build.id)
    builds.splice(idx, 1)
    ls.set('fhx.builds', builds)
}

export const isBuildSaved = build => {
    const builds = ls.get('fhx.builds') || []
    return builds.some(b => b.id === build.id)
}

export const isBuildUpdated = build => {
    const builds = ls.get('fhx.builds') || []
    const savedBuild = builds.find(b => b.id === build.id)
    delete build.updatedAt
    delete savedBuild?.updatedAt
    return !isEqual(build, savedBuild)
}

export const getBuilds = () => {

    const builds = ls.get('fhx.builds')
    const emptyBuild = createEmptyBuild()

    if (builds?.length) {
        const updatedBuilds = builds.map(b => ({ ...emptyBuild, ...b }))
        ls.set('fhx.builds', updatedBuilds)

        return updatedBuilds
    }

    return [emptyBuild]
}