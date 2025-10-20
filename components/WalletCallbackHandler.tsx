"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function WalletCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const handleWalletCallback = async () => {
      const referralToken = searchParams.get("referralToken")

      if (referralToken) {
        // Store the referral token in localStorage for subsequent use in this new browser context
        localStorage.setItem("referralToken", referralToken)
        toast({
          title: "Referral Token Found",
          description: "Referral token successfully retrieved.",
          variant: "default",
        })
      } else {
        // Optionally, clear any old referral token if no new one is present
        localStorage.removeItem("referralToken")
      }

      // Now, redirect to the main application flow, e.g., dashboard or home
      // The QPAYPortal component (home page) will then pick up the referralToken from localStorage
      router.push("/") // Or "/dashboard" if that's the next step
    }

    handleWalletCallback()
  }, [searchParams, router, toast])

  return null // This component doesn't render anything directly, it just handles the callback
}
