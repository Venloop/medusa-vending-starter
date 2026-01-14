import { useMemo } from "react"
// import { resetPassword } from "@lib/data/customer"
import ResetPasswordForm from "@modules/reset-password/templates/form"

interface ResetPasswordPageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  // const [loading, setLoading] = useState(false)
  // const [password, setPassword] = useState("")
  // const searchParams = useMemo(() => {
  //   if (typeof window === "undefined") {
  //     return
  //   }

  //   return new URLSearchParams(
  //     window.location.search
  //   )
  // }, [])

  // const token = useMemo(() => {
  //   return searchParams?.get("token")
  // }, [searchParams])
  // const email = useMemo(() => {
  //   return searchParams?.get("email")
  // }, [searchParams])

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
//       setLoading(false)
//     })
//   }

  return (
    <div className="w-full px-8 py-8">
        <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
            <ResetPasswordForm searchParams={searchParams} />
        </div>
    </div>
  )
}