import { writeUncompressed } from "./nbt.js"
import { gzip } from "./gzip.js"

export function generateLitematic(blocks) {

  const palette = {}
  const paletteArray = []

  blocks.forEach(b => {
    const key = `minecraft:note_block[instrument=${b.instrument},note=${b.note},powered=false]`
    if (!palette[key]) {
      palette[key] = paletteArray.length
      paletteArray.push({
        Name: "minecraft:note_block",
        Properties: {
          instrument: b.instrument,
          note: String(b.note),
          powered: "false"
        }
      })
    }
  })

  const nbtData = {
    Metadata: {
      Name: "MIDI Song",
      Author: "MIDI2MC",
      RegionCount: 1
    },
    Regions: {
      Song: {
        Size: { x: 5000, y: 50, z: 1 },
        BlockStatePalette: paletteArray,
        BlockStates: new Array(blocks.length).fill(0)
      }
    }
  }

  const raw = writeUncompressed(nbtData)
  return gzip(raw)
}
