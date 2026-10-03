"use client"

import { useState, type FormEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Linkedin, Github, Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useCvData, usePortfolioData } from "@/components/portfolio-data-provider"
import { sendContact } from "@/lib/api"

type FormStatus = "idle" | "sending" | "success" | "error"

export function ContactSection() {
  const { t, language } = useLanguage()
  const { contact } = useCvData()
  const { backendOnline } = usePortfolioData()

  const [status, setStatus] = useState<FormStatus>("idle")
  const [feedback, setFeedback] = useState("")
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" })

  const copy = {
    es: {
      title: "Envíame un mensaje",
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      send: "Enviar mensaje",
      sending: "Enviando…",
      success: "Mensaje enviado. Gracias, te responderé lo antes posible.",
      error: "No se pudo enviar el mensaje. Prueba de nuevo o escríbeme por email.",
      offline: "El backend no responde ahora mismo; puedes escribirme directamente por email.",
    },
    en: {
      title: "Send me a message",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send message",
      sending: "Sending…",
      success: "Message sent. Thanks, I'll get back to you as soon as possible.",
      error: "The message could not be sent. Try again or email me directly.",
      offline: "The backend is not responding right now; you can email me directly.",
    },
  }[language]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.website) return // honeypot
    setStatus("sending")
    setFeedback("")
    try {
      const receipt = await sendContact({
        name: form.name,
        email: form.email,
        message: form.message,
      })
      setStatus("success")
      setFeedback(receipt.reference ? `${copy.success} [${receipt.reference}]` : copy.success)
      setForm({ name: "", email: "", message: "", website: "" })
    } catch (error) {
      setStatus("error")
      setFeedback(error instanceof Error ? error.message : copy.error)
    }
  }

  const inputClass =
    "w-full border border-[var(--omarchy-border)] bg-[var(--omarchy-bg-alt)] px-3 py-2 text-sm text-[var(--omarchy-fg)] outline-none transition-colors focus-visible:border-[var(--omarchy-accent)]"

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-secondary/10 via-accent/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">{t("contact.title")}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("contact.description")}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6 animate-slide-in-up">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-1">Email</h3>
                      <p className="text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-1">Ubicación</h3>
                      <p className="text-muted-foreground">{contact.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <div className="flex space-x-4">
                <Button className="btn-outline flex-1" asChild>
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </a>
                </Button>
                <Button className="btn-outline flex-1" asChild>
                  <a href={contact.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </a>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground" aria-live="polite">
                {backendOnline === false ? copy.offline : null}
              </p>
            </div>

            {/* Formulario real contra POST /api/contact */}
            <Card className="card-elevated animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-xl text-foreground mb-4">{copy.title}</h3>
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label htmlFor="contact-name" className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                      {copy.name}
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      className={inputClass}
                      disabled={status === "sending"}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                      {copy.email}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      className={inputClass}
                      disabled={status === "sending"}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                      {copy.message}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={5}
                      value={form.message}
                      onChange={(event) => setForm({ ...form, message: event.target.value })}
                      className={inputClass}
                      disabled={status === "sending"}
                    />
                  </div>
                  {/* Honeypot anti-spam: invisible para humanos, visible para bots. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(event) => setForm({ ...form, website: event.target.value })}
                    />
                  </div>

                  <Button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
                    {status === "sending" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {copy.sending}
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        {copy.send}
                      </>
                    )}
                  </Button>

                  {status === "success" ? (
                    <p role="status" className="flex items-start gap-2 text-sm text-[var(--omarchy-success,#9ece6a)]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{feedback}</span>
                    </p>
                  ) : null}
                  {status === "error" ? (
                    <p role="alert" className="flex items-start gap-2 text-sm text-[var(--omarchy-danger,#f7768e)]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>
                        {feedback}{" "}
                        <a className="underline" href={`mailto:${contact.email}`}>
                          {contact.email}
                        </a>
                      </span>
                    </p>
                  ) : null}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
