export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('cercu_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  const refreshToken = useCookie<string | null>('cercu_refresh', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  const user = useCookie<any>('cercu_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  const isAuthenticated = computed(() => !!token.value)
  const isProfessional = computed(() => user.value?.role === 'professional' || user.value?.role === 'admin')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const hasProfessionalProfile = computed(() => !!user.value?.hasProfessionalProfile)
  const userRole = computed(() => user.value?.role || 'guest')

  function setTokens(accessToken: string, newRefreshToken: string) {
    token.value = accessToken
    refreshToken.value = newRefreshToken
  }

  function setUser(newUser: any) {
    user.value = newUser
  }

  async function login(phone: string, code: string, name?: string, email?: string, dateOfBirth?: string) {
    const config = useRuntimeConfig()
    const body: any = { phone, code, name }
    if (email) body.email = email
    if (dateOfBirth) body.dateOfBirth = dateOfBirth
    const data: any = await $fetch(`${config.public.apiBase}/auth/verify-otp`, {
      method: 'POST',
      body,
    })
    setTokens(data.data.accessToken, data.data.refreshToken)
    setUser(data.data.user)
    return data.data
  }

  async function googleLogin(credential: string, name?: string, dateOfBirth?: string) {
    const config = useRuntimeConfig()
    const body: any = { credential }
    if (name) body.name = name
    if (dateOfBirth) body.dateOfBirth = dateOfBirth
    const data: any = await $fetch(`${config.public.apiBase}/auth/google`, {
      method: 'POST',
      body,
    })
    setTokens(data.data.accessToken, data.data.refreshToken)
    setUser(data.data.user)
    return data.data
  }

  async function refreshTokenAction() {
    if (!refreshToken.value) return false
    try {
      const config = useRuntimeConfig()
      const data: any = await $fetch(`${config.public.apiBase}/auth/refresh`, {
        method: 'POST',
        body: { refreshToken: refreshToken.value },
      })
      setTokens(data.data.accessToken, data.data.refreshToken)
      return true
    } catch {
      logout()
      return false
    }
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const config = useRuntimeConfig()
      const data: any = await $fetch(`${config.public.apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      setUser(data.data)
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    refreshToken.value = null
    user.value = null
  }

  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    isProfessional,
    isAdmin,
    hasProfessionalProfile,
    userRole,
    setTokens,
    setUser,
    login,
    googleLogin,
    refreshTokenAction,
    fetchMe,
    logout,
  }
})
