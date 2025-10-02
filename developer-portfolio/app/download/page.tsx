import { Navigation } from "@/components/navigation"
import { DownloadSuccess } from "@/components/download/download-success"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "Download - Developer Portfolio",
  description: "Download your purchased template successfully.",
}

export default function DownloadPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <DownloadSuccess />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
