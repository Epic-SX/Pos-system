"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, Receipt, Wine, Coffee, Utensils } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  price: number
  category: "bottle" | "drink" | "food" | "service"
  image?: string
  stock?: number
}

interface OrderItem {
  id: number
  menuItem: MenuItem
  quantity: number
  tableNumber: string
  staffName: string
  timestamp: string
}

export default function OrderManagement() {
  const [menuItems] = useState<MenuItem[]>([
    { id: 1, name: "Dom Pérignon", price: 45000, category: "bottle", stock: 5 },
    { id: 2, name: "Hennessy XO", price: 35000, category: "bottle", stock: 8 },
    { id: 3, name: "Premium Whiskey Set", price: 25000, category: "bottle", stock: 12 },
    { id: 4, name: "Champagne Cocktail", price: 2500, category: "drink" },
    { id: 5, name: "Premium Sake", price: 3000, category: "drink" },
    { id: 6, name: "Fruit Platter", price: 4500, category: "food" },
    { id: 7, name: "Sushi Set", price: 6000, category: "food" },
    { id: 8, name: "Nomination Fee", price: 5000, category: "service" },
  ])

  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 1, menuItem: menuItems[0], quantity: 1, tableNumber: "T1", staffName: "Yuki", timestamp: "22:30" },
    { id: 2, menuItem: menuItems[3], quantity: 2, tableNumber: "T1", staffName: "Yuki", timestamp: "22:35" },
    { id: 3, menuItem: menuItems[1], quantity: 1, tableNumber: "VIP1", staffName: "Sakura", timestamp: "22:15" },
  ])

  const [currentOrder, setCurrentOrder] = useState<{ [key: number]: number }>({})
  const [selectedTable, setSelectedTable] = useState<string>("T1")
  const [selectedStaff, setSelectedStaff] = useState<string>("Yuki")

  const addToOrder = (menuItem: MenuItem) => {
    setCurrentOrder((prev) => ({
      ...prev,
      [menuItem.id]: (prev[menuItem.id] || 0) + 1,
    }))
  }

  const removeFromOrder = (menuItemId: number) => {
    setCurrentOrder((prev) => {
      const newOrder = { ...prev }
      if (newOrder[menuItemId] > 1) {
        newOrder[menuItemId]--
      } else {
        delete newOrder[menuItemId]
      }
      return newOrder
    })
  }

  const submitOrder = () => {
    const newOrders = Object.entries(currentOrder).map(([itemId, quantity]) => ({
      id: orders.length + Number.parseInt(itemId),
      menuItem: menuItems.find((item) => item.id === Number.parseInt(itemId))!,
      quantity,
      tableNumber: selectedTable,
      staffName: selectedStaff,
      timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
    }))

    setOrders([...orders, ...newOrders])
    setCurrentOrder({})
  }

  const getTotalAmount = () => {
    return Object.entries(currentOrder).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find((item) => item.id === Number.parseInt(itemId))
      return total + (item?.price || 0) * quantity
    }, 0)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bottle":
        return Wine
      case "drink":
        return Coffee
      case "food":
        return Utensils
      default:
        return Receipt
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "bottle":
        return "ボトル"
      case "drink":
        return "ドリンク"
      case "food":
        return "フード"
      case "service":
        return "サービス"
      default:
        return category
    }
  }

  const categories = ["bottle", "drink", "food", "service"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu Items */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>メニュー</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bottle" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category)
                  return (
                    <TabsTrigger key={category} value={category} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{getCategoryName(category)}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{item.name}</h3>
                              {item.stock !== undefined && <Badge variant="outline">在庫: {item.stock}</Badge>}
                            </div>
                            <p className="text-lg font-bold text-blue-600 mb-3">¥{item.price.toLocaleString()}</p>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromOrder(item.id)}
                                disabled={!currentOrder[item.id]}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{currentOrder[item.id] || 0}</span>
                              <Button
                                size="sm"
                                onClick={() => addToOrder(item)}
                                disabled={item.stock !== undefined && item.stock <= 0}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>注文内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>テーブル</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="T2">T2</SelectItem>
                  <SelectItem value="T5">T5</SelectItem>
                  <SelectItem value="VIP1">VIP1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>担当スタッフ</Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yuki">Yuki</SelectItem>
                  <SelectItem value="Sakura">Sakura</SelectItem>
                  <SelectItem value="Miki">Miki</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              {Object.entries(currentOrder).length === 0 ? (
                <p className="text-gray-500 text-center">注文がありません</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(currentOrder).map(([itemId, quantity]) => {
                    const item = menuItems.find((item) => item.id === Number.parseInt(itemId))!
                    return (
                      <div key={itemId} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            ¥{item.price.toLocaleString()} × {quantity}
                          </p>
                        </div>
                        <p className="font-medium">¥{(item.price * quantity).toLocaleString()}</p>
                      </div>
                    )
                  })}
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>合計</span>
                      <span>¥{getTotalAmount().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button className="w-full" onClick={submitOrder} disabled={Object.keys(currentOrder).length === 0}>
              注文確定
            </Button>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>最近の注文</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders
                .slice(-5)
                .reverse()
                .map((order) => (
                  <div key={order.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{order.tableNumber}</span>
                      <span className="text-sm text-gray-600">{order.timestamp}</span>
                    </div>
                    <p className="text-sm">
                      {order.menuItem.name} × {order.quantity}
                    </p>
                    <p className="text-sm text-gray-600">担当: {order.staffName}</p>
                    <p className="font-medium">¥{(order.menuItem.price * order.quantity).toLocaleString()}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
