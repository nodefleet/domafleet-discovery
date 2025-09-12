export function flyToCart(sourceEl: HTMLElement) {
  try {
    const target = document.getElementById('navbar-cart-target')
    if (!target) return

    const s = sourceEl.getBoundingClientRect()
    const t = target.getBoundingClientRect()

    const startX = s.left + s.width / 2
    const startY = s.top + s.height / 2
    const endX = t.left + t.width / 2
    const endY = t.top + t.height / 2

    const dot = document.createElement('div')
    dot.style.position = 'fixed'
    dot.style.left = `${startX - 8}px`
    dot.style.top = `${startY - 8}px`
    dot.style.width = '16px'
    dot.style.height = '16px'
    dot.style.borderRadius = '9999px'
    dot.style.background = 'linear-gradient(135deg, rgba(85,154,208,1), rgba(85,154,208,0.6))'
    dot.style.boxShadow = '0 0 0 2px rgba(85,154,208,0.3), 0 6px 14px rgba(0,0,0,0.3)'
    dot.style.zIndex = '9999'
    document.body.appendChild(dot)

    const dx = endX - startX
    const dy = endY - startY

    const anim = dot.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5}px) scale(0.9)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0.2 }
    ], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' })

    anim.onfinish = () => {
      dot.remove()
      // target pulse
      target.animate([
        { boxShadow: '0 0 0 0 rgba(85,154,208,0.8)' },
        { boxShadow: '0 0 0 8px rgba(85,154,208,0)' }
      ], { duration: 500 })
    }
  } catch { }
}


