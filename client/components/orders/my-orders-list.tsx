"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Search, Filter, FileText, RefreshCw, ShoppingBag } from "lucide-react"
import Link from "next/link"

// Mock orders data
const mockOrders = [
  {
    id: "ORD-2024-001",
    templateName: "Modern E-commerce Dashboard",
    templateVersion: "v1.0.2",
    category: "Dashboard",
    price: 49.99,
    paymentMethod: "Stripe",
    purchaseDate: "2024-01-15T10:30:00Z",
    status: "completed",
    thumbnail: "/modern-ecommerce-dashboard.png",
    transactionId: "txn_1234567890",
    downloadCount: 3,
  },
  {
    id: "ORD-2024-002",
    templateName: "SaaS Landing Page",
    templateVersion: "v2.1.0",
    category: "Landing Page",
    price: 39.99,
    paymentMethod: "PayPal",
    purchaseDate: "2024-01-10T14:20:00Z",
    status: "completed",
    thumbnail: "/saas-landing-page.png",
    transactionId: "txn_0987654321",
    downloadCount: 1,
  },
  {
    id: "ORD-2024-003",
    templateName: "Restaurant Website Template",
    templateVersion: "v1.5.1",
    category: "Business",
    price: 29.99,
    paymentMethod: "Stripe",
    purchaseDate: "2024-01-05T09:15:00Z",
    status: "pending",
    thumbnail: "/restaurant-website-template.png",
    transactionId: "txn_1122334455",
    downloadCount: 0,
  },
]

const categories = ["All Categories", "Dashboard", "Landing Page", "E-commerce", "Business", "Portfolio"]

export function MyOrdersList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[0] | null>(null)

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.templateName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || order.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅"
      case "pending":
        return "⏳"
      case "failed":
        return "❌"
      default:
        return "⚪"
    }
  }

  const handleDownload = (orderId: string) => {
    // In real implementation, this would redirect to download page with order ID
    window.location.href = `/download?order=${orderId}`
  }

  const generateNewLink = (orderId: string) => {
    // Simulate generating new download link
    console.log(`Generating new download link for order: ${orderId}`)
  }

  if (mockOrders.length === 0) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
            <p className="text-muted-foreground mb-8">You haven't purchased any templates yet.</p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/templates">Browse Shop</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Orders</h1>
          <p className="text-xl text-muted-foreground">
            Here you can find all your purchased templates and download them anytime.
          </p>
        </div>

        {/* Filters & Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">
                    #{order.id}
                  </Badge>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)} {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={order.thumbnail || "/placeholder.svg"}
                    alt={order.templateName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight mb-1 truncate">{order.templateName}</h3>
                    <p className="text-xs text-muted-foreground mb-1">Version {order.templateVersion}</p>
                    <Badge variant="outline" className="text-xs">
                      {order.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">${order.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(order.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span>{order.downloadCount}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleDownload(order.id)}
                    disabled={order.status !== "completed"}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Download
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                        <FileText className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>Complete information for order #{selectedOrder?.id}</DialogDescription>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={selectedOrder.thumbnail || "/placeholder.svg"}
                              alt={selectedOrder.templateName}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">{selectedOrder.templateName}</h3>
                              <p className="text-sm text-muted-foreground">Version {selectedOrder.templateVersion}</p>
                              <Badge variant="outline" className="mt-1">
                                {selectedOrder.category}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Transaction ID:</span>
                              <p className="text-muted-foreground">{selectedOrder.transactionId}</p>
                            </div>
                            <div>
                              <span className="font-medium">Payment Method:</span>
                              <p className="text-muted-foreground">{selectedOrder.paymentMethod}</p>
                            </div>
                            <div>
                              <span className="font-medium">Purchase Date:</span>
                              <p className="text-muted-foreground">
                                {new Date(selectedOrder.purchaseDate).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Download Count:</span>
                              <p className="text-muted-foreground">{selectedOrder.downloadCount}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => handleDownload(selectedOrder.id)}
                              disabled={selectedOrder.status !== "completed"}
                              className="flex-1 bg-purple-600 hover:bg-purple-700"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download Now
                            </Button>
                            <Button variant="outline" onClick={() => generateNewLink(selectedOrder.id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Generate New Link
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
