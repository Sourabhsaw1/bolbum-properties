'use client'
import { useEffect } from 'react'

export default function Animations() {
  useEffect(() => {
    // Cursor
    const cursor = document.createElement('div')
    const dot = document.createElement('div')
    cursor.id = 'custom-cursor'
    dot.id = 'cursor-dot'
    document.body.appendChild(cursor)
    document.body.appendChild(dot)

    let mx = 0, my = 0, cx = 0, cy = 0
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY
      dot.style.left = mx + 'px'; dot.style.top = my + 'px'
    })
    const loop = () => {
      cx += (mx - cx) * 0.22; cy += (my - cy) * 0.22
      cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'
      requestAnimationFrame(loop)
    }
    loop()

    document.querySelectorAll('a,button,.property-card,.stat-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'))
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'))
    })

    document.addEventListener('click', e => {
      const r = document.createElement('div')
      r.className = 'click-ripple'
      r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`
      document.body.appendChild(r)
      setTimeout(() => r.remove(), 700)
    })

    // Particles
    const canvas = document.createElement('canvas')
    canvas.id = 'particles-canvas'
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.5;'
    document.body.prepend(canvas)
    const ctx = canvas.getContext('2d')!
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight })

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5, alpha: Math.random() * 0.4 + 0.1,
    }))

    let pmx = W / 2, pmy = H / 2
    document.addEventListener('mousemove', e => { pmx = e.clientX; pmy = e.clientY })

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 120) { ctx.beginPath(); ctx.strokeStyle = `rgba(255,107,26,${0.08 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() }
        })
        const d = Math.hypot(pmx - p.x, pmy - p.y)
        if (d < 150) { p.vx += (pmx - p.x) * 0.00006; p.vy += (pmy - p.y) * 0.00006 }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = '#FF6B1A'; ctx.globalAlpha = p.alpha; ctx.fill(); ctx.globalAlpha = 1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    // Reveal
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }), { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))

    document.body.classList.add('loaded')

    return () => {
      cursor.remove(); dot.remove(); canvas.remove()
      cancelAnimationFrame(animId); obs.disconnect()
    }
  }, [])
  return null
}
