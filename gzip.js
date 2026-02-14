import pako from "https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm"

export function gzip(data) {
  return pako.gzip(data)
}
