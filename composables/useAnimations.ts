import gsap from 'gsap'

export function useAnimations() {
  // ─── Entrance animations ───
  function fadeInUp(el: Element | string, opts?: { delay?: number; duration?: number; y?: number }) {
    return gsap.fromTo(el,
      { opacity: 0, y: opts?.y ?? 30 },
      { opacity: 1, y: 0, duration: opts?.duration ?? 0.6, delay: opts?.delay ?? 0, ease: 'power3.out' }
    )
  }

  function fadeInDown(el: Element | string, opts?: { delay?: number; duration?: number }) {
    return gsap.fromTo(el,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: opts?.duration ?? 0.5, delay: opts?.delay ?? 0, ease: 'power3.out' }
    )
  }

  function fadeInLeft(el: Element | string, opts?: { delay?: number; duration?: number }) {
    return gsap.fromTo(el,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: opts?.duration ?? 0.5, delay: opts?.delay ?? 0, ease: 'power3.out' }
    )
  }

  function fadeInRight(el: Element | string, opts?: { delay?: number; duration?: number }) {
    return gsap.fromTo(el,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: opts?.duration ?? 0.5, delay: opts?.delay ?? 0, ease: 'power3.out' }
    )
  }

  function scaleIn(el: Element | string, opts?: { delay?: number; duration?: number }) {
    return gsap.fromTo(el,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: opts?.duration ?? 0.4, delay: opts?.delay ?? 0, ease: 'back.out(1.7)' }
    )
  }

  // ─── Stagger animations (for lists/grids) ───
  function staggerIn(els: Element | string, opts?: { delay?: number; stagger?: number; y?: number }) {
    return gsap.fromTo(els,
      { opacity: 0, y: opts?.y ?? 20, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.5,
        stagger: opts?.stagger ?? 0.08,
        delay: opts?.delay ?? 0,
        ease: 'power2.out'
      }
    )
  }

  function staggerScale(els: Element | string, opts?: { delay?: number; stagger?: number }) {
    return gsap.fromTo(els,
      { opacity: 0, scale: 0 },
      {
        opacity: 1, scale: 1,
        duration: 0.4,
        stagger: opts?.stagger ?? 0.06,
        delay: opts?.delay ?? 0,
        ease: 'back.out(1.4)'
      }
    )
  }

  // ─── Micro-interactions ───
  function bounceClick(el: Element | string) {
    return gsap.fromTo(el,
      { scale: 1 },
      { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    )
  }

  function popIn(el: Element | string, opts?: { delay?: number }) {
    return gsap.fromTo(el,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, delay: opts?.delay ?? 0, ease: 'elastic.out(1, 0.5)' }
    )
  }

  function wiggle(el: Element | string) {
    return gsap.to(el, {
      x: -4, duration: 0.08, repeat: 5, yoyo: true, ease: 'power2.inOut',
      onComplete: () => gsap.set(el, { x: 0 })
    })
  }

  function pulse(el: Element | string, opts?: { scale?: number; repeat?: number }) {
    return gsap.to(el, {
      scale: opts?.scale ?? 1.05,
      duration: 0.3,
      repeat: opts?.repeat ?? 1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }

  // ─── Number counter (for trust signals / stats) ───
  function countUp(el: Element, target: number, opts?: { duration?: number; delay?: number; prefix?: string; suffix?: string }) {
    const obj = { val: 0 }
    return gsap.to(obj, {
      val: target,
      duration: opts?.duration ?? 1.5,
      delay: opts?.delay ?? 0,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = `${opts?.prefix ?? ''}${Math.floor(obj.val)}${opts?.suffix ?? ''}`
      }
    })
  }

  // ─── Step / slide transitions ───
  function slideOutLeft(el: Element | string, opts?: { duration?: number }) {
    return gsap.to(el, {
      x: -40, opacity: 0, duration: opts?.duration ?? 0.3, ease: 'power2.in'
    })
  }

  function slideInRight(el: Element | string, opts?: { duration?: number; delay?: number }) {
    return gsap.fromTo(el,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: opts?.duration ?? 0.4, delay: opts?.delay ?? 0.1, ease: 'power2.out' }
    )
  }

  function slideOutRight(el: Element | string, opts?: { duration?: number }) {
    return gsap.to(el, {
      x: 40, opacity: 0, duration: opts?.duration ?? 0.3, ease: 'power2.in'
    })
  }

  function slideInLeft(el: Element | string, opts?: { duration?: number; delay?: number }) {
    return gsap.fromTo(el,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: opts?.duration ?? 0.4, delay: opts?.delay ?? 0.1, ease: 'power2.out' }
    )
  }

  // ─── Celebration (for success screens) ───
  function celebrationBurst(container: Element) {
    const colors = ['#3730A3', '#FB7185', '#10B981', '#F59E0B', '#3B82F6']
    const particles: HTMLElement[] = []

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: absolute; width: 8px; height: 8px; border-radius: 50%;
        background: ${colors[i % colors.length]}; pointer-events: none;
        top: 50%; left: 50%; z-index: 10;
      `
      container.appendChild(particle)
      particles.push(particle)
    }

    particles.forEach((particle, i) => {
      gsap.to(particle, {
        x: gsap.utils.random(-120, 120),
        y: gsap.utils.random(-120, 120),
        scale: gsap.utils.random(0.5, 1.5),
        opacity: 0,
        duration: 1,
        delay: i * 0.02,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      })
    })
  }

  // ─── Success checkmark animation ───
  function successCheck(el: Element | string) {
    const tl = gsap.timeline()
    tl.fromTo(el,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }
    )
    tl.to(el, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 })
    return tl
  }

  // ─── Typing / reveal text ───
  function revealText(el: Element | string, opts?: { delay?: number }) {
    return gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 0.8, delay: opts?.delay ?? 0, ease: 'power3.inOut' }
    )
  }

  // ─── Hover helpers (for programmatic use) ───
  function hoverLift(el: Element) {
    const enter = () => gsap.to(el, { y: -4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)', duration: 0.25, ease: 'power2.out' })
    const leave = () => gsap.to(el, { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', duration: 0.25, ease: 'power2.out' })
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
    }
  }

  // ─── Gamification animations ───

  function xpFloat(container: Element, amount: number, opts?: { color?: string }) {
    const el = document.createElement('div')
    el.textContent = `+${amount} XP`
    el.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1.25rem;
      color: ${opts?.color ?? '#3730A3'}; pointer-events: none; z-index: 100;
      text-shadow: 0 1px 4px rgba(55, 48, 163, 0.3);
    `
    container.appendChild(el)

    const tl = gsap.timeline()
    tl.fromTo(el,
      { opacity: 0, y: 0, scale: 0.5 },
      { opacity: 1, y: -20, scale: 1.2, duration: 0.4, ease: 'back.out(1.7)' }
    )
    tl.to(el, { y: -60, opacity: 0, duration: 0.6, ease: 'power2.in', onComplete: () => el.remove() })
    return tl
  }

  function levelUpCelebration(container: Element) {
    const tl = gsap.timeline()
    tl.to(container, { scale: 1.1, duration: 0.2, ease: 'power2.out' })
    tl.to(container, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' })
    celebrationBurst(container)
    return tl
  }

  function progressFill(el: Element | string, targetPercent: number, opts?: { duration?: number; delay?: number }) {
    return gsap.fromTo(el,
      { width: '0%' },
      { width: `${targetPercent}%`, duration: opts?.duration ?? 1.2, delay: opts?.delay ?? 0, ease: 'power2.out' }
    )
  }

  function gaugeArc(el: SVGElement | string, targetPercent: number, opts?: { duration?: number; delay?: number }) {
    const circumference = 283 // approx for r=45 semicircle
    const offset = circumference - (targetPercent / 100) * circumference
    return gsap.fromTo(el,
      { strokeDashoffset: circumference },
      { strokeDashoffset: offset, duration: opts?.duration ?? 1.5, delay: opts?.delay ?? 0, ease: 'power2.out' }
    )
  }

  return {
    fadeInUp, fadeInDown, fadeInLeft, fadeInRight,
    scaleIn, staggerIn, staggerScale,
    bounceClick, popIn, wiggle, pulse,
    countUp,
    slideOutLeft, slideInRight, slideOutRight, slideInLeft,
    celebrationBurst, successCheck, revealText,
    hoverLift,
    xpFloat, levelUpCelebration, progressFill, gaugeArc,
  }
}
