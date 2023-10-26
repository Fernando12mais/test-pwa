import { LoginResponse } from '@/@fake-db/types'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import axios from '@axios'

export const useMockLogin = () => {
  onMounted(() => {
    const errors = ref<Record<string, string | undefined>>({
      email: undefined,
      password: undefined,
    })
    const route = useRoute()
    const router = useRouter()
    const ability = useAppAbility()

    axios
      .post<LoginResponse>('/auth/login', {
        email: 'admin@demo.com',
        password: 'admin',
      })
      .then(r => {
        const { accessToken, userData, userAbilities } = r.data

        localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
        ability.update(userAbilities)

        localStorage.setItem('userData', JSON.stringify(userData))
        localStorage.setItem('accessToken', JSON.stringify(accessToken))

        // Redirect to `to` query if exist or redirect to index route
        router.replace(route.query.to ? String(route.query.to) : '/')
      })
      .catch(e => {
        const { errors: formErrors } = e.response.data

        errors.value = formErrors
        console.error(e.response.data)
      })
  })
}
