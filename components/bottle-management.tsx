"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Wine, Package, AlertTriangle, TrendingUp } from "lucide-react"

interface Bottle {
  id: number
  name: string
  category: "champagne" | "whiskey" | "sake" | "wine" | "other"
  price: number
  stock: number
  minStock: number
  image?: string
  description?: string
  supplier?: string
  lastOrdered?: string
  totalSold: number
}

export default function BottleManagement() {
  const [bottles, setBottles] = useState<Bottle[]>([
    {
      id: 1,
      name: "Dom Pérignon Vintage 2012",
      category: "champagne",
      price: 45000,
      stock: 5,
      minStock: 3,
      supplier: "Premium Wines Co.",
      lastOrdered: "2024-01-10",
      totalSold: 23,
    },
    {
      id: 2,
      name: "Hennessy XO",
      category: "whiskey",
      price: 35000,
      stock: 8,
      minStock: 5,
      supplier: "Spirits Import Ltd.",
      lastOrdered: "2024-01-12",
      totalSold: 31,
    },
    {
      id: 3,
      name: "Macallan 18 Year",
      category: "whiskey",
      price: 55000,
      stock: 2,
      minStock: 3,
      supplier: "Whiskey World",
      lastOrdered: "2024-01-08",
      totalSold: 15,
    },
    {
      id: 4,
      name: "Dassai 23",
      category: "sake",
      price: 18000,
      stock: 12,
      minStock: 8,
      supplier: "Sake Direct",
      lastOrdered: "2024-01-14",
      totalSold: 42,
    },
    {
      id: 5,
      name: "Opus One 2018",
      category: "wine",
      price: 65000,
      stock: 3,
      minStock: 2,
      supplier: "Fine Wine Imports",
      lastOrdered: "2024-01-11",
      totalSold: 8,
    },
    {
      id: 6,
      name: "Cristal Rosé 2013",
      category: "champagne",
      price: 75000,
      stock: 1,
      minStock: 2,
      supplier: "Premium Wines Co.",
      lastOrdered: "2024-01-09",
      totalSold: 12,
    },
  ])

  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getCategoryName = (category: string) => {
    switch (category) {
      case "champagne":
        return "シャンパン"
      case "whiskey":
        return "ウイスキー"
      case "sake":
        return "日本酒"
      case "wine":
        return "ワイン"
      case "other":
        return "その他"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "champagne":
        return "bg-yellow-500"
      case "whiskey":
        return "bg-amber-600"
      case "sake":
        return "bg-blue-500"
      case "wine":
        return "bg-purple-500"
      case "other":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const isLowStock = (bottle: Bottle) => bottle.stock <= bottle.minStock

  const lowStockBottles = bottles.filter(isLowStock)
  const totalValue = bottles.reduce((sum, bottle) => sum + bottle.price * bottle.stock, 0)
  const totalSold = bottles.reduce((sum, bottle) => sum + bottle.totalSold, 0)
  const categories = ["champagne", "whiskey", "sake", "wine", "other"]

  const updateStock = (bottleId: number, newStock: number) => {
    setBottles(bottles.map((bottle) => (bottle.id === bottleId ? { ...bottle, stock: Math.max(0, newStock) } : bottle)))
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">総在庫数</p>
                <p className="text-2xl font-bold">{bottles.reduce((sum, b) => sum + b.stock, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wine className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">在庫価値</p>
                <p className="text-2xl font-bold">¥{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">総販売数</p>
                <p className="text-2xl font-bold">{totalSold}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">在庫不足</p>
                <p className="text-2xl font-bold">{lowStockBottles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockBottles.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              在庫不足アラート
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockBottles.map((bottle) => (
                <div key={bottle.id} className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="font-medium">{bottle.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">残り{bottle.stock}本</Badge>
                    <Button size="sm" variant="outline">
                      発注
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">在庫管理</TabsTrigger>
          <TabsTrigger value="sales">売上分析</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bottles.map((bottle) => (
              <Card
                key={bottle.id}
                className={`hover:shadow-lg transition-shadow ${isLowStock(bottle) ? "border-red-200" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{bottle.name}</CardTitle>
                      <Badge className={`${getCategoryColor(bottle.category)} text-white`}>
                        {getCategoryName(bottle.category)}
                      </Badge>
                    </div>
                    {isLowStock(bottle) && <AlertTriangle className="h-5 w-5 text-red-500" />}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">¥{bottle.price.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>在庫:</span>
                      <span className={`font-medium ${isLowStock(bottle) ? "text-red-600" : ""}`}>
                        {bottle.stock}本
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>最小在庫:</span>
                      <span>{bottle.minStock}本</span>
                    </div>
                    <div className="flex justify-between">
                      <span>総販売数:</span>
                      <span className="font-medium">{bottle.totalSold}本</span>
                    </div>
                    <div className="flex justify-between">
                      <span>仕入先:</span>
                      <span className="text-xs">{bottle.supplier}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStock(bottle.id, bottle.stock - 1)}
                      disabled={bottle.stock <= 0}
                      className="flex-1"
                    >
                      -1
                    </Button>
                    <Button size="sm" onClick={() => updateStock(bottle.id, bottle.stock + 1)} className="flex-1">
                      +1
                    </Button>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        詳細編集
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{bottle.name} - 詳細情報</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>商品名</Label>
                          <Input value={bottle.name} />
                        </div>
                        <div>
                          <Label>価格</Label>
                          <Input value={bottle.price} type="number" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>在庫数</Label>
                            <Input value={bottle.stock} type="number" />
                          </div>
                          <div>
                            <Label>最小在庫</Label>
                            <Input value={bottle.minStock} type="number" />
                          </div>
                        </div>
                        <div>
                          <Label>仕入先</Label>
                          <Input value={bottle.supplier} />
                        </div>
                        <div>
                          <Label>商品説明</Label>
                          <Input value={bottle.description || ""} placeholder="商品の説明を入力" />
                        </div>
                        <div className="flex space-x-2">
                          <Button className="flex-1">更新</Button>
                          <Button variant="destructive" className="flex-1">
                            削除
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>カテゴリ別売上</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const categoryBottles = bottles.filter((b) => b.category === category)
                    const categorySales = categoryBottles.reduce((sum, b) => sum + b.totalSold, 0)
                    const categoryRevenue = categoryBottles.reduce((sum, b) => sum + b.totalSold * b.price, 0)

                    if (categorySales === 0) return null

                    return (
                      <div key={category} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded ${getCategoryColor(category)}`}></div>
                            <span className="font-medium">{getCategoryName(category)}</span>
                          </div>
                          <Badge variant="outline">{categorySales}本</Badge>
                        </div>
                        <p className="text-lg font-bold">¥{categoryRevenue.toLocaleString()}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>人気商品ランキング</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bottles
                    .sort((a, b) => b.totalSold - a.totalSold)
                    .slice(0, 5)
                    .map((bottle, index) => (
                      <div key={bottle.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{bottle.name}</p>
                          <p className="text-sm text-gray-600">{bottle.totalSold}本販売</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">¥{(bottle.totalSold * bottle.price).toLocaleString()}</p>
                          <p className="text-sm text-gray-600">売上</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新規商品追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新規商品追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>商品名</Label>
                <Input placeholder="商品名を入力" />
              </div>
              <div>
                <Label>カテゴリ</Label>
                <select className="w-full p-2 border rounded">
                  <option value="champagne">シャンパン</option>
                  <option value="whiskey">ウイスキー</option>
                  <option value="sake">日本酒</option>
                  <option value="wine">ワイン</option>
                  <option value="other">その他</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>価格</Label>
                  <Input type="number" placeholder="価格を入力" />
                </div>
                <div>
                  <Label>初期在庫</Label>
                  <Input type="number" placeholder="在庫数を入力" />
                </div>
              </div>
              <div>
                <Label>仕入先</Label>
                <Input placeholder="仕入先を入力" />
              </div>
              <Button className="w-full">追加</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
