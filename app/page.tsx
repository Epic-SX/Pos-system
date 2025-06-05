"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, DollarSign, Wine, Calendar, Settings } from "lucide-react"
import TableManagement from "@/components/table-management"
import OrderManagement from "@/components/order-management"
import StaffManagement from "@/components/staff-management"
import PayrollCalculation from "@/components/payroll-calculation"
import BottleManagement from "@/components/bottle-management"
import ShiftManagement from "@/components/shift-management"

type ActiveModule = "dashboard" | "tables" | "orders" | "staff" | "payroll" | "bottles" | "shifts"

export default function POSSystem() {
  const [activeModule, setActiveModule] = useState<ActiveModule>("dashboard")

  const stats = [
    { title: "使用中テーブル", value: "12", icon: Users, color: "bg-blue-500" },
    { title: "本日売上", value: "¥245,000", icon: DollarSign, color: "bg-green-500" },
    { title: "出勤スタッフ", value: "8", icon: Clock, color: "bg-purple-500" },
    { title: "ボトル販売数", value: "23", icon: Wine, color: "bg-orange-500" },
  ]

  const navigationItems = [
    { id: "dashboard", label: "ダッシュボード", icon: Settings },
    { id: "tables", label: "テーブル管理", icon: Users },
    { id: "orders", label: "注文管理", icon: DollarSign },
    { id: "staff", label: "スタッフ管理", icon: Users },
    { id: "payroll", label: "給与計算", icon: DollarSign },
    { id: "bottles", label: "ボトル管理", icon: Wine },
    { id: "shifts", label: "シフト管理", icon: Calendar },
  ]

  const renderActiveModule = () => {
    switch (activeModule) {
      case "tables":
        return <TableManagement />
      case "orders":
        return <OrderManagement />
      case "staff":
        return <StaffManagement />
      case "payroll":
        return <PayrollCalculation />
      case "bottles":
        return <BottleManagement />
      case "shifts":
        return <ShiftManagement />
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>最近の注文</CardTitle>
                  <CardDescription>最新のお客様注文</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { table: "Table 5", items: "Dom Pérignon, Whiskey Set", amount: "¥45,000", time: "10:30 PM" },
                      { table: "Table 2", items: "Champagne Tower", amount: "¥32,000", time: "10:15 PM" },
                      { table: "Table 8", items: "Premium Sake Set", amount: "¥18,000", time: "10:00 PM" },
                    ].map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.table}</p>
                          <p className="text-sm text-gray-600">{order.items}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.amount}</p>
                          <p className="text-sm text-gray-600">{order.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>スタッフ実績</CardTitle>
                  <CardDescription>本日のトップパフォーマー</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Yuki", nominations: 8, sales: "¥85,000", status: "active" },
                      { name: "Sakura", nominations: 6, sales: "¥72,000", status: "active" },
                      { name: "Miki", nominations: 5, sales: "¥58,000", status: "break" },
                    ].map((staff, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {staff.name[0]}
                          </div>
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-sm text-gray-600">{staff.nominations} 指名</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{staff.sales}</p>
                          <Badge variant={staff.status === "active" ? "default" : "secondary"}>
                            {staff.status === "active" ? "勤務中" : "休憩中"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">クラブPOS</h1>
            <p className="text-sm text-gray-600">管理システム</p>
          </div>
          <nav className="mt-6">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as ActiveModule)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                  activeModule === item.id ? "bg-blue-50 border-r-2 border-blue-500 text-blue-600" : "text-gray-700"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">
              {activeModule === "dashboard"
                ? "ダッシュボード"
                : navigationItems.find((item) => item.id === activeModule)?.label}
            </h2>
            <p className="text-gray-600">
              {activeModule === "dashboard"
                ? "ナイトクラブ運営の概要"
                : `管理：${navigationItems.find((item) => item.id === activeModule)?.label.toLowerCase()}`}
            </p>
          </div>
          {renderActiveModule()}
        </div>
      </div>
    </div>
  )
}
