import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center relative">
      <div className="absolute z-10 w-full h-full">
        <video width="1280" height="720" autoPlay muted preload="none" loop playsInline className="w-full h-full object-cover ">
          <source src="/video/bg-v.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="w-full min-h-screen flex justify-center items-center relative z-50 bg-black/70 backdrop-blur-3xl p-6 md:p-10 ">
        <div className="flex w-full max-w-sm flex-col gap-6 relative z-50">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
          <LoginForm />
        </div>
      </div>

    </div>
  )
}
