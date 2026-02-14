export class NBTWriter {
  constructor() {
    this.buf = []
  }

  writeByte(val) { this.buf.push(val & 0xff) }
  writeShort(val) { this.writeByte((val>>8)&0xff); this.writeByte(val&0xff) }
  writeInt(val) { this.writeShort((val>>16)&0xffff); this.writeShort(val&0xffff) }
  writeString(str) {
    const enc = new TextEncoder()
    const bytes = enc.encode(str)
    this.writeShort(bytes.length)
    bytes.forEach(b => this.buf.push(b))
  }

  getArray() { return new Uint8Array(this.buf) }

  writeTag_Compound(name, contentFunc) {
    this.writeByte(0x0a)  // TAG_Compound
    this.writeString(name)
    contentFunc()
    this.writeByte(0x00)  // TAG_End
  }

  writeTag_List(name, type, array) {
    this.writeByte(0x09) // TAG_List
    this.writeString(name)
    this.writeByte(type)
    this.writeInt(array.length)
    array.forEach(item => {
      if (type === 8) this.writeString(item)
      else if (type === 1) this.writeByte(item)
      else if (type === 3) this.writeInt(item)
      else if (type === 2) this.writeShort(item)
    })
  }

  writeTag_String(name, value) {
    this.writeByte(0x08)
    this.writeString(name)
    this.writeString(value)
  }

  writeTag_Int(name, value) {
    this.writeByte(0x03)
    this.writeString(name)
    this.writeInt(value)
  }

  writeTag_Byte(name, value) {
    this.writeByte(0x01)
    this.writeString(name)
    this.writeByte(value)
  }

  writeTag_Short(name, value) {
    this.writeByte(0x02)
    this.writeString(name)
    this.writeShort(value)
  }
}
