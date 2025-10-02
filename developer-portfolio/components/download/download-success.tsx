"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Mock order data - this would come from URL params or API
const mockOrder = {
  id: "ORD-2024-001",
  templateName: "Modern E-commerce Dashboard",
  templateVersion: "v1.0.2",
  price: 49.99,
  paymentMethod: "Stripe",
  purchaseDate: "2024-01-15T10:30:00Z",
  thumbnail: "/modern-ecommerce-dashboard.png",
}

export function DownloadSuccess() {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [isDownloading, setIsDownloading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Show expiration warning
  useEffect(() => {
    if (timeLeft === 300) {
      // 5 minutes left
      toast({
        title: "Download link expires soon",
        description: "Your download link will expire in 5 minutes.",
        variant: "destructive",
      })
    }
  }, [timeLeft, toast])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleDownload = async () => {
    setIsDownloading(true)

    // Simulate backend verification and signed URL generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In real implementation, this would:
    // 1. Verify ownership
    // 2. Generate signed URL
    // 3. Start download

    toast({
      title: "Download started",
      description: "Your template download has begun.",
    })

    setIsDownloading(false)
  }

  const handleEmailDownload = async () => {
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setEmailSent(true)
    toast({
      title: "Email sent",
      description: "Download link has been sent to your email.",
    })
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Purchase Successful!</h1>
          <p className="text-xl text-muted-foreground">Your template is ready to download.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Order Summary
                  <Badge variant="secondary">#{mockOrder.id}</Badge>
                </CardTitle>
                <CardDescription>
                  Purchase completed on {new Date(mockOrder.purchaseDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={mockOrder.thumbnail || "/placeholder.svg"}
                    alt={mockOrder.templateName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{mockOrder.templateName}</h3>
                    <p className="text-muted-foreground mb-2">Version {mockOrder.templateVersion}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">${mockOrder.price}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">Paid via {mockOrder.paymentMethod}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{new Date(mockOrder.purchaseDate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Download Section */}
          <div className="space-y-6">
            {/* Download Timer */}
            <Card className="border-orange-200 dark:border-orange-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Download expires in</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-2">{formatTime(timeLeft)}</div>
                <p className="text-sm text-muted-foreground">Download link will expire for security reasons</p>
              </CardContent>
            </Card>

            {/* Download Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Download Your Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading || timeLeft === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {isDownloading ? (
                    "Preparing Download..."
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Download Template
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleEmailDownload}
                  disabled={emailSent}
                  className="w-full bg-transparent"
                >
                  {emailSent ? (
                    "Email Sent ✓"
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send to My Email
                    </>
                  )}
                </Button>

                {timeLeft === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 dark:text-red-400">
                      Download link has expired. Please contact support.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Support Info */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Having trouble downloading? Contact support for assistance.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
