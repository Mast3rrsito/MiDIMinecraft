import { Midi } from "https://cdn.jsdelivr.net/npm/@tonejs/midi@2.0.27/build/Midi.js"

export async function parseMidiFile(file) {
  const arrayBuffer = await file.arrayBuffer()
  const midi = new Midi(arrayBuffer)

  const events = []

  midi.tracks.forEach((track, trackIndex) => {
    track.notes.forEach(note => {
      events.push({
        track: trackIndex,
        time: note.time,
        duration: note.duration,
        midi: note.midi,
        velocity: note.velocity,
        channel: track.channel
      })
    })
  })

  return {
    header: midi.header,
    events
  }
}
