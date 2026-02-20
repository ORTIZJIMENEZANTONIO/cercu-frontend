import gsap from 'gsap'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal(opts?: ScrollRevealOptions) {
  const observer = ref<IntersectionObserver | null>(null)

  function reveal(el: Element, animation: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scaleIn' | 'stagger' = 'fadeUp') {
    // Set initial hidden state
    gsap.set(el, { opacity: 0, y: animation === 'fadeUp' ? 30 : 0, x: animation === 'fadeLeft' ? -30 : animation === 'fadeRight' ? 30 : 0, scale: animation === 'scaleIn' ? 0.9 : 1 })

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            opacity: 1, y: 0, x: 0, scale: 1,
            duration: 0.6, ease: 'power3.out'
          })
          if (opts?.once !== false) io.unobserve(el)
        }
      })
    }, {
      threshold: opts?.threshold ?? 0.15,
      rootMargin: opts?.rootMargin ?? '0px 0px -40px 0px'
    })

    io.observe(el)
    return io
  }

  function revealChildren(parent: Element, selector: string, stagger = 0.08) {
    const children = parent.querySelectorAll(selector)
    if (!children.length) return

    gsap.set(children, { opacity: 0, y: 20, scale: 0.95 })

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(children, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.5, stagger, ease: 'power2.out'
          })
          if (opts?.once !== false) io.unobserve(parent)
        }
      })
    }, {
      threshold: opts?.threshold ?? 0.1,
      rootMargin: opts?.rootMargin ?? '0px 0px -40px 0px'
    })

    io.observe(parent)
    return io
  }

  onUnmounted(() => {
    observer.value?.disconnect()
  })

  return { reveal, revealChildren }
}
