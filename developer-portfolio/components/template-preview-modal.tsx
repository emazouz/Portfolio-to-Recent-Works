"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Star, Code, Palette, Smartphone } from "lucide-react"

interface Template {
  id: number
  title: string
  description: string
  price: number
  rating: number
  downloads: number
  tags: string[]
  category: string
  image: string
  previewUrl: string
  featured: boolean
  difficulty: string
  lastUpdated: string
}

interface TemplatePreviewModalProps {
  template: Template
  isOpen: boolean
  onClose: () => void
}

export function TemplatePreviewModal({ template, isOpen, onClose }: TemplatePreviewModalProps) {
  const features = [
    { icon: Code, title: "Clean Code", description: "Well-structured, documented code" },
    { icon: Palette, title: "Modern Design", description: "Contemporary UI/UX patterns" },
    { icon: Smartphone, title: "Responsive", description: "Works on all devices" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{template.title}</DialogTitle>
              <DialogDescription className="text-base mt-2">{template.description}</DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">${template.price}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {template.rating} ({template.downloads} downloads)
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img src={template.image || "/placeholder.svg"} alt={template.title} className="w-full h-64 object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              {template.featured && <Badge className="bg-yellow-500 text-yellow-900">Featured</Badge>}
              <Badge variant="secondary">{template.difficulty}</Badge>
              <Badge variant="outline">{template.category}</Badge>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium">{feature.title}</div>
                  <div className="text-sm text-muted-foreground">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Technologies */}
          <div>
            <h4 className="font-semibold mb-3">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h4 className="font-semibold mb-3">What's Included</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                Complete source code with TypeScript
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                Comprehensive documentation
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                Design files (Figma)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                Lifetime updates
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />6 months email support
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Buy Now - ${template.price}</Button>
            <Button variant="outline" asChild>
              <a href={template.previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Preview
              </a>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(template.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
