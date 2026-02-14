import { Midi } from "https://cdn.jsdelivr.net/npm/@tonejs/midi@2.0.27/build/Midi.js"

export async function parseMidiFile(file) {
  const arrayBuffer = await file.arrayBuffer()
  const midi = new Midi(arrayBuffer)

  const events = []

  midi.tracks.forEach((track, trackIndex) => {
    track.notes.forEach(note => {
      events.push({
        track: trackIndex,
        time: note.time,          // en segundos
        duration: note.duration,  // en segundos
        midi: note.midi,
        velocity: note.velocity,
        channel: track.channel,
        program: track.instrument?.number || 1
      })
    })
  })

  // ordenar por tiempo absoluto
  events.sort((a,b) => a.time - b.time)

  return {
    header: midi.header,
    events
  }
}
