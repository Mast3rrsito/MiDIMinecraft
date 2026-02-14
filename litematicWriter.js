import { NBTWriter } from "./nbt.js"
import { gzip } from "./gzip.js"

export function generateLitematic(blocks) {
  const writer = new NBTWriter()

  writer.writeTag_Compound("", () => {
    writer.writeTag_String("Author", "MIDI2MC")
    writer.writeTag_String("Name", "MIDI Song")
    writer.writeTag_Int("Version", 3)

    // Palette
    const paletteMap = {}
    const paletteArray = []
    blocks.forEach(b => {
      const key = `${b.instrument}_${b.note}`
      if (!paletteMap[key]) {
        paletteMap[key] = paletteArray.length
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

    // escribir lista de palette
    writer.writeTag_List("BlockStatePalette", 10, paletteArray.map(p => {
      return { properties: p.Properties, name: p.Name }
    }))

    // BlockStates simplificado: index en palette
    const stateIndices = blocks.map(b => paletteMap[`${b.instrument}_${b.note}`])
    writer.writeTag_List("BlockStates", 3, stateIndices)

    // Posiciones
    writer.writeTag_List("Blocks", 10, blocks.map(b => {
      const w = new NBTWriter()
      w.writeTag_Int("x", b.x)
      w.writeTag_Int("y", b.y)
      w.writeTag_Int("z", b.z)
      w.writeTag_Int("state", paletteMap[`${b.instrument}_${b.note}`])
      return w
    }))
  })

  return gzip(writer.getArray())
}
