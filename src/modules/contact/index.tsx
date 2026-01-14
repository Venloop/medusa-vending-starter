"use client"

import { Heading, Button } from "@medusajs/ui"
import React, { useState } from "react"
import Input from "@modules/common/components/input"
import { contact } from "@lib/data/contact"
import { useTranslations } from "next-intl"

const Contact = ({ title }: { title: string }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<any>({})
  const [status, setStatus] = useState<null | "success" | "error">(null)
  const [loading, setLoading] = useState(false)
  const t = useTranslations("Contact")

  const validate = () => {
    const newErrors: any = {}
    if (!form.name.trim()) newErrors.name = t("nameRequired")
    if (!form.phone.trim()) newErrors.phone = t("phoneRequired")
    else if (!/^\+?[0-9\s-]{7,}$/.test(form.phone)) newErrors.phone = t("phoneInvalid")
    if (!form.email.trim()) newErrors.email = t("emailRequired")
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = t("emailInvalid")
    if (!form.message.trim()) newErrors.message = t("messageRequired")
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setStatus(null)
    
    if (!validate()) return
    
    setLoading(true)

    try {
      const res = await contact(form)
      
      console.log(res)

      if (res.status === "success") {
        setStatus("success")
        setForm({ name: "", phone: "", email: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full border-b border-ui-border-base relative">
      <div className="content-container py-12 small:py-12 max-w-3.125 mx-auto">
        <Heading level="h1" className="text-ui-fg-base text-2xl leading-tight mb-8 text-center">
          {title}
        </Heading>
        <form className="max-w-lg mx-auto flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Input
            label={t("nameLabel")}
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="given-name"
            errors={errors}
          />
          {errors.name && <span className="text-rose-500 text-sm">{errors.name}</span>}
          <Input
            label={t("phoneLabel")}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            errors={errors}
          />
          {errors.phone && <span className="text-rose-500 text-sm">{errors.phone}</span>}
          <Input
            label={t("emailLabel")}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            errors={errors}
          />
          {errors.email && <span className="text-rose-500 text-sm">{errors.email}</span>}
          <div className="flex flex-col w-full">
            <label htmlFor="message" className="mb-2 txt-compact-medium-plus">{t("messageLabel")} <span className="text-rose-500">*</span></label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="pt-4 pb-1 block w-full px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
            />
            {errors.message && <span className="text-rose-500 text-sm">{errors.message}</span>}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? t("sending") : t("sendButton")}
          </Button>
          {status === "success" && (
            <div className="text-green-600 text-center mt-2">{t("successMessage")}</div>
          )}
          {status === "error" && (
            <div className="text-rose-500 text-center mt-2">{t("errorMessage")}</div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Contact
