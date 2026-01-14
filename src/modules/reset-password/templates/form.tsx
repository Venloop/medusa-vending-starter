import { useMemo } from "react"
// import { resetPassword } from "@lib/data/customer"
import ResetForm from "./reset-form"
import UpdatePassword from "./update-password"

interface ResetPasswordFormProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function ResetPasswordForm({ searchParams }: ResetPasswordFormProps) {
  // const [loading, setLoading] = useState(false)
  // const [password, setPassword] = useState("")

  const token = useMemo(() => {
    if (!searchParams) return null
    const tokenParam = searchParams.token
    return Array.isArray(tokenParam) ? tokenParam[0] : tokenParam
  }, [searchParams])

  const email = useMemo(() => {
    if (!searchParams) return null
    const emailParam = searchParams.email
    return Array.isArray(emailParam) ? emailParam[0] : emailParam
  }, [searchParams])

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault()
//     if (!token) {
//       return
//     }
//     if (!password) {
//       alert("Password is required")
//       return
//     }
//     setLoading(true)

//     resetPassword(email, password)
//     .then(() => {
//       alert("Password reset successfully!")
//     })
//     .catch((error) => {
//       alert(`Couldn't reset password: ${error.message}`)
//     })
//     .finally(() => {
//       setLoading(false))
//     }
//   }

  return (
    <div className="w-full px-8 py-8">
        <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
            {token ? <UpdatePassword /> : <ResetForm />}
        </div>
    </div>
  )
}