import { MAX_MAGIC_OPTS } from '../constants'

const MagicOptsDrawer = ({ id = 'check-drawer', itemKey, magicOpts, handleChange }) => {
    return (
        <>
            <input type="checkbox" id={id} className="bottom-drawer-toggle" />
            <div className="bottom-drawer">
                <label className="bottom-drawer-overlay" htmlFor={id}></label>
                <div className="bottom-drawer-data">
                    {new Array(MAX_MAGIC_OPTS).fill(0).map((_, idx) =>
                        <div key={idx} className="grid grid-cols-4 join">
                            <input
                                type="text"
                                className="col-span-3 input input-bordered input-xs join-item"
                                list="magic-opts"
                                onChange={e => handleChange(`${itemKey}[${idx}].name`, e.target.value)}
                                value={magicOpts[idx]?.name || ''}
                            />
                            <input
                                type="text"
                                className="input input-bordered input-xs join-item"
                                onChange={e => handleChange(`${itemKey}[${idx}].value`, e.target.value)}
                                value={magicOpts[idx]?.value || ''}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MagicOptsDrawer