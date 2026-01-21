import { decode as b45Decode, encode as b45Encode } from 'base45'
import { decode as cborDecode, encode as cborEncode } from 'cbor-x'

/**
 * Encode any value to base45 (value -> CBOR -> deflate -> base45)
 */
export const encode = async (value: unknown): Promise<string> => {
  const cborBuffer = cborEncode(value)
  const cborBytes = Uint8Array.from(cborBuffer)

  const compressionStream = new CompressionStream('gzip')
  const writer = compressionStream.writable.getWriter()
  await writer.write(cborBytes)
  await writer.close()

  const compressedBuffer = await new Response(
    compressionStream.readable,
  ).arrayBuffer()
  return b45Encode(new Uint8Array(compressedBuffer))
}

/**
 * Decode base45 back to original value (base45 -> deflate -> CBOR -> value)
 */
export const decode = async (encoded: string): Promise<unknown> => {
  const compressedData = b45Decode(encoded)
  const compressedBytes = Uint8Array.from(compressedData)

  const decompressionStream = new DecompressionStream('gzip')
  const writer = decompressionStream.writable.getWriter()
  await writer.write(compressedBytes)
  await writer.close()

  const decompressedBuffer = await new Response(
    decompressionStream.readable,
  ).arrayBuffer()
  return cborDecode(new Uint8Array(decompressedBuffer)) as unknown
}
