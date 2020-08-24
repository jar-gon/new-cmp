export function ConvertMemorySize(props: { size: number }) {
  const size = props.size / 1024
  return size.toFixed(size < 1 ? 1 : 0)
}
