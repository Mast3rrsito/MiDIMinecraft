import { GM_TO_NOTEBLOCK } from "./gmMapping.js"

const BASE_MIDI = 54 // F#3 base

function secondsToTicks(seconds) {
  return Math.round(seconds * 20) // 20 ticks por segundo
}

function midiToNote(midi, octaveShift) {
  return midi - BASE_MIDI + (octaveShift * 12)
}

export function convertToNoteblocks(midiData) {

  const blocks = []

  midiData.events.forEach(event => {

    const mapping = GM_TO_NOTEBLOCK[event.program] || { instrument: "harp", octaveShift: 0 }

    const tick = secondsToTicks(event.time)
    const note = midiToNote(event.midi, mapping.octaveShift)

    if (note < 0 || note > 24) return // Minecraft limit 25 notes

    blocks.push({
      x: tick,      // eje X = tiempo
      y: note,      // eje Y = altura de la nota
      z: event.track, // eje Z = track
      instrument: mapping.instrument,
      note
    })
  })

  return blocks
}
