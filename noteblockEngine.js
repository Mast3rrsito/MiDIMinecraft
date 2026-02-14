import { GM_TO_NOTEBLOCK } from "./gmMapping.js"

const BASE_MIDI = 54 // F#3

function secondsToTicks(seconds) {
  return Math.round(seconds * 20)
}

function midiToNote(midi, octaveShift) {
  return midi - BASE_MIDI + (octaveShift * 12)
}

export function convertToNoteblocks(midiData) {

  const blocks = []

  midiData.events.forEach(event => {

    const program = event.program || 1
    const mapping = GM_TO_NOTEBLOCK[program] || { instrument: "harp", octaveShift: 0 }

    const tick = secondsToTicks(event.time)
    const note = midiToNote(event.midi, mapping.octaveShift)

    if (note < 0 || note > 24) return

    blocks.push({
      x: tick,
      y: event.track,
      z: 0,
      instrument: mapping.instrument,
      note
    })

  })

  return blocks
}
