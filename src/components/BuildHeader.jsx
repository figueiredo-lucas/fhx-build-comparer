import React from 'react'
import { discardBuild, isBuildSaved, isBuildUpdated, saveBuild } from '../utils'

const BuildHeader = ({ build, index, handleChange, removeBuild }) => {
    return (
        <div className="card-title flex justify-between">
            <select className="select select-sm select-bordered" value={build.version} onChange={e => handleChange('version', e.target.value)}>
                {['v1', 'v2'].map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={() => {
                    saveBuild(build)
                    handleChange('updatedAt', Date.now())
                }} disabled={isBuildSaved(build) && !isBuildUpdated(build)}>
                    {isBuildSaved(build) ? 'Update' : 'Save'}
                </button>
                {isBuildSaved(build) && <button className="btn btn-error btn-sm" onClick={() => {
                    discardBuild(build)
                    handleChange('updatedAt', null)
                }}>Discard Save</button>}
                {!isBuildSaved(build) && <button className="btn btn-error btn-sm" onClick={() => removeBuild(index)}>Delete</button>}
            </div>
        </div>
    )
}

export default BuildHeader