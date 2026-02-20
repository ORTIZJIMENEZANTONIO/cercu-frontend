declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (el: HTMLElement, config: any) => void
          prompt: (callback?: (notification: any) => void) => void
        }
      }
    }
  }
}

let scriptLoaded = false
let scriptLoading = false

function loadGsiScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve()
  if (scriptLoading) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (scriptLoaded) {
          clearInterval(check)
          resolve()
        }
      }, 50)
    })
  }

  scriptLoading = true
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      scriptLoaded = true
      scriptLoading = false
      resolve()
    }
    script.onerror = () => {
      scriptLoading = false
      reject(new Error('Failed to load Google GSI script'))
    }
    document.head.appendChild(script)
  })
}

export function useGoogleAuth() {
  const config = useRuntimeConfig()
  const loading = ref(false)
  let credentialResolver: ((credential: string) => void) | null = null
  let credentialRejecter: ((error: Error) => void) | null = null

  async function initGoogle() {
    await loadGsiScript()

    if (!window.google) throw new Error('Google GSI not available')

    window.google.accounts.id.initialize({
      client_id: config.public.googleClientId,
      callback: handleCredentialResponse,
      auto_select: false,
    })
  }

  function handleCredentialResponse(response: { credential: string }) {
    if (credentialResolver) {
      credentialResolver(response.credential)
      credentialResolver = null
      credentialRejecter = null
    }
  }

  async function renderButton(el: HTMLElement) {
    await initGoogle()
    if (!window.google) return

    window.google.accounts.id.renderButton(el, {
      type: 'standard',
      shape: 'rectangular',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      locale: 'es',
      width: el.offsetWidth || 320,
    })
  }

  async function promptOneTap(): Promise<string> {
    await initGoogle()
    if (!window.google) throw new Error('Google GSI not available')

    return new Promise((resolve, reject) => {
      credentialResolver = resolve
      credentialRejecter = reject
      window.google!.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // One Tap not shown, user can use the button instead
        }
      })
    })
  }

  return {
    loading,
    initGoogle,
    renderButton,
    promptOneTap,
  }
}
