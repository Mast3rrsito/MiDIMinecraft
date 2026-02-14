import { parseMidiFile } from "./midiParser.js"
import { convertToNoteblocks } from "./noteblockEngine.js"
import { generateLitematic } from "./litematicWriter.js"

const log = document.getElementById("log")

document.getElementById("generateBtn").onclick = async () => {
  const file = document.getElementById("midiInput").files[0]
  if (!file) return alert("Select MIDI file")

  log.textContent = "Parsing MIDI..."
  const midiData = await parseMidiFile(file)

  log.textContent = "Converting to Noteblocks..."
  const blocks = convertToNoteblocks(midiData)

  log.textContent = "Generating Litematic..."
  const litematic = generateLitematic(blocks)

  const blob = new Blob([litematic], { type: "application/octet-stream" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = "song.litematic"
  a.click()

  log.textContent = "Done!"
}
