import items from './src/assets/items.json' assert { type: "json" }
import fs from 'fs/promises'


console.log('Creating TMP folder to select the correct files')
await fs.rm('./public/items-tmp', { recursive: true, force: true })
await fs.mkdir('./public/items-tmp')

const missingFiles = []

console.log('Lower casing all files to match them properly')
const files = await fs.readdir('./public/items')
await Promise.all(files.map(file => fs.rename(`./public/items/${file}`, `./public/items/${file.toLowerCase()}`)))

console.log('Copying the files based on the items.json')
await Promise.all(items.map(async it => {
    try {
        await fs.cp(`./public/items/${it.item_icon.toLowerCase()}`, `./public/items-tmp/${it.item_icon.toLowerCase()}`)
    } catch (err) {
        missingFiles.push(it.item_icon)
    }
}))

if (missingFiles.length) {
    console.log('Not deleting the folders, validate the missing files and delete them manually')
    console.log(missingFiles)
}

console.log('Removing old items folder')
await fs.rm('./public/items', { recursive: true, force: true })

console.log('Making TMP folder the actual items folder')
await fs.rename('./public/items-tmp', './public/items')