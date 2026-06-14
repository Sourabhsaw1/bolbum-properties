'use client'

import React, { useRef, useEffect, useMemo, useCallback, CSSProperties } from 'react'
import * as THREE from 'three'

/* ── helpers ─────────────────────────────────────────────────────── */
function isTouchDevice() {
  return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
}

/* ── vertex / fragment shaders ──────────────────────────────────── */
const vertexShader = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 3.0 * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 iColor;
  uniform float iBrightness;
  uniform float iEdgeIntensity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float edge = iEdgeIntensity > 0.0 ? smoothstep(0.5, 0.35, d) * smoothstep(0.0, 0.3, d) * iEdgeIntensity : 0.0;
    float alpha = (core + edge) * vAlpha * iBrightness;
    gl_FragColor = vec4(iColor, alpha);
  }
`

/* ── simple film grain pass (no postprocessing import needed) ──── */
function createFilmGrainMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      intensity: { value: 0.05 },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
      void main(){
        vec4 color = texture2D(tDiffuse, vUv);
        float noise = rand(vUv + time) * intensity;
        gl_FragColor = vec4(color.rgb + noise, color.a);
      }
    `,
  })
}

/* ── props ──────────────────────────────────────────────────────── */
interface GhostCursorProps {
  color?: string
  brightness?: number
  trailLength?: number
  inertia?: number
  bloomStrength?: number
  grainIntensity?: number
  edgeIntensity?: number
  mixBlendMode?: CSSProperties['mixBlendMode']
  fadeDelayMs?: number
  fadeDurationMs?: number
  zIndex?: number
  className?: string
  style?: CSSProperties
}

/* ── component ──────────────────────────────────────────────────── */
export function GhostCursor({
  color = '#FF6B1A',
  brightness = 1,
  trailLength = 50,
  inertia = 0.5,
  bloomStrength = 0.1,
  grainIntensity = 0.05,
  edgeIntensity = 0,
  mixBlendMode = 'screen',
  fadeDelayMs = 1000,
  fadeDurationMs = 1500,
  zIndex = 10,
  className,
  style,
}: GhostCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const filmMatRef = useRef<THREE.ShaderMaterial | null>(null)

  /* ---------- main effect ---------- */
  useEffect(() => {
    if (!containerRef.current || isTouchDevice()) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(rect.width, rect.height)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    if (mixBlendMode) {
      renderer.domElement.style.mixBlendMode = String(mixBlendMode)
    }

    // scene + camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 1000)
    camera.position.z = 5

    // trail geometry
    const positions = new Float32Array(trailLength * 3)
    const alphas = new Float32Array(trailLength)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))

    const c = new THREE.Color(color)
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iColor: { value: new THREE.Vector3(c.r, c.g, c.b) },
        iBrightness: { value: brightness },
        iEdgeIntensity: { value: edgeIntensity },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    materialRef.current = mat

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // optional bloom-like glow (a second larger, dimmer points set)
    let glowPoints: THREE.Points | null = null
    if (bloomStrength > 0) {
      const glowGeo = new THREE.BufferGeometry()
      const glowPos = new Float32Array(trailLength * 3)
      const glowAlphas = new Float32Array(trailLength)
      glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3))
      glowGeo.setAttribute('aAlpha', new THREE.BufferAttribute(glowAlphas, 1))
      const glowMat = new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
          attribute float aAlpha;
          varying float vAlpha;
          void main() {
            vAlpha = aAlpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 12.0 * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader,
        uniforms: {
          iColor: { value: new THREE.Vector3(c.r, c.g, c.b) },
          iBrightness: { value: bloomStrength * 0.4 },
          iEdgeIntensity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      glowPoints = new THREE.Points(glowGeo, glowMat)
      scene.add(glowPoints)
    }

    // film grain render target + quad
    const rt = new THREE.WebGLRenderTarget(rect.width, rect.height)
    const filmMat = createFilmGrainMaterial()
    filmMat.uniforms.tDiffuse.value = rt.texture
    filmMat.uniforms.intensity.value = grainIntensity
    filmMatRef.current = filmMat

    const fsScene = new THREE.Scene()
    const fsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const fsQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), filmMat)
    fsScene.add(fsQuad)

    // mouse tracking
    let curX = 0, curY = 0
    let targetX = 0, targetY = 0
    const trail: { x: number; y: number }[] = Array.from({ length: trailLength }, () => ({ x: 0, y: 0 }))
    let active = false
    let fadeOpacity = 0
    let idleTimer: ReturnType<typeof setTimeout> | null = null

    const handleMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect()
      targetX = ((e.clientX - r.left) / r.width) * 2 - 1
      targetY = -((e.clientY - r.top) / r.height) * 2 + 1
      active = true
      fadeOpacity = 1
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => { active = false }, fadeDelayMs)
    }
    container.addEventListener('mousemove', handleMouseMove)

    // resize
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width === 0 || height === 0) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      rt.setSize(width, height)
    })
    ro.observe(container)

    // render loop
    let raf = 0
    const clock = new THREE.Clock()
    const loop = () => {
      const dt = clock.getDelta()

      // smooth cursor position
      curX += (targetX - curX) * (1 - inertia)
      curY += (targetY - curY) * (1 - inertia)

      // shift trail
      for (let i = trail.length - 1; i > 0; i--) {
        trail[i].x = trail[i - 1].x
        trail[i].y = trail[i - 1].y
      }
      trail[0].x = curX * 4
      trail[0].y = curY * 3

      // fade
      if (!active && fadeOpacity > 0) {
        fadeOpacity = Math.max(0, fadeOpacity - dt / (fadeDurationMs / 1000))
      }

      // update position + alpha buffers
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
      const alphaAttr = geo.getAttribute('aAlpha') as THREE.BufferAttribute
      for (let i = 0; i < trailLength; i++) {
        posAttr.setXYZ(i, trail[i].x, trail[i].y, 0)
        alphaAttr.setX(i, (1 - i / trailLength) * fadeOpacity)
      }
      posAttr.needsUpdate = true
      alphaAttr.needsUpdate = true

      // sync glow
      if (glowPoints) {
        const gp = glowPoints.geometry.getAttribute('position') as THREE.BufferAttribute
        const ga = glowPoints.geometry.getAttribute('aAlpha') as THREE.BufferAttribute
        for (let i = 0; i < trailLength; i++) {
          gp.setXYZ(i, trail[i].x, trail[i].y, 0)
          ga.setX(i, (1 - i / trailLength) * fadeOpacity * 0.5)
        }
        gp.needsUpdate = true
        ga.needsUpdate = true
      }

      // draw
      filmMat.uniforms.time.value = clock.elapsedTime
      renderer.setRenderTarget(rt)
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
      renderer.render(fsScene, fsCamera)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      if (idleTimer) clearTimeout(idleTimer)
      container.removeEventListener('mousemove', handleMouseMove)
      ro.disconnect()
      rt.dispose()
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      filmMat.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [color, brightness, trailLength, inertia, bloomStrength, grainIntensity, edgeIntensity, mixBlendMode, fadeDelayMs, fadeDurationMs])

  /* ---- color hotswap ---- */
  useEffect(() => {
    if (materialRef.current) {
      const c = new THREE.Color(color)
      ;(materialRef.current.uniforms.iColor.value as THREE.Vector3).set(c.r, c.g, c.b)
    }
  }, [color])

  useEffect(() => {
    if (materialRef.current) materialRef.current.uniforms.iBrightness.value = brightness
  }, [brightness])

  useEffect(() => {
    if (materialRef.current) materialRef.current.uniforms.iEdgeIntensity.value = edgeIntensity
  }, [edgeIntensity])

  useEffect(() => {
    if (filmMatRef.current) filmMatRef.current.uniforms.intensity.value = grainIntensity
  }, [grainIntensity])

  useEffect(() => {
    const el = rendererRef.current?.domElement
    if (!el) return
    if (mixBlendMode) el.style.mixBlendMode = String(mixBlendMode)
    else el.style.removeProperty('mix-blend-mode')
  }, [mixBlendMode])

  const mergedStyle = useMemo<React.CSSProperties>(() => ({ zIndex, ...style }), [zIndex, style])

  return (
    <div
      ref={containerRef}
      className={`${className ?? ''}`}
      style={{ pointerEvents: 'none', position: 'absolute', inset: 0, ...mergedStyle }}
    />
  )
}

export default GhostCursor
