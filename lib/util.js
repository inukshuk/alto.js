export function intersects(a, b) {
  return (a == null || b == null) || (
    (
      (a.x >= b.x && a.x <= (b.x + b.width)) ||
      (b.x >= a.x && b.x <= (a.x + a.width))
    ) && (
      (a.y >= b.y && a.y <= (b.y + b.height)) ||
      (b.y >= a.y && b.y <= (a.y + a.height))
    )
  )
}
