"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Users, DollarSign, Plus } from "lucide-react"

interface Table {
  id: number
  number: string
  status: "available" | "occupied" | "reserved" | "cleaning"
  customers: number
  startTime?: string
  duration?: number
  assignedStaff?: string
  currentBill?: number
}

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([
    {
      id: 1,
      number: "T1",
      status: "occupied",
      customers: 4,
      startTime: "21:30",
      duration: 90,
      assignedStaff: "Yuki",
      currentBill: 45000,
    },
    {
      id: 2,
      number: "T2",
      status: "occupied",
      customers: 2,
      startTime: "22:00",
      duration: 60,
      assignedStaff: "Sakura",
      currentBill: 32000,
    },
    { id: 3, number: "T3", status: "available", customers: 0 },
    { id: 4, number: "T4", status: "reserved", customers: 6, startTime: "23:00", assignedStaff: "Miki" },
    {
      id: 5,
      number: "T5",
      status: "occupied",
      customers: 3,
      startTime: "21:45",
      duration: 75,
      assignedStaff: "Yuki",
      currentBill: 28000,
    },
    { id: 6, number: "T6", status: "cleaning", customers: 0 },
    {
      id: 7,
      number: "VIP1",
      status: "occupied",
      customers: 8,
      startTime: "21:00",
      duration: 120,
      assignedStaff: "Sakura",
      currentBill: 85000,
    },
    { id: 8, number: "VIP2", status: "available", customers: 0 },
  ])

  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-red-500"
      case "reserved":
        return "bg-yellow-500"
      case "cleaning":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "空席"
      case "occupied":
        return "使用中"
      case "reserved":
        return "予約済"
      case "cleaning":
        return "清掃中"
      default:
        return status
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, "0")}`
  }

  const updateTableStatus = (tableId: number, newStatus: Table["status"]) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              status: newStatus,
              startTime:
                newStatus === "occupied"
                  ? new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
                  : table.startTime,
            }
          : table,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">空席</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">使用中</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm">予約済</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-sm">清掃中</span>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新規テーブル追加
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{table.number}</CardTitle>
                <Badge className={`${getStatusColor(table.status)} text-white`}>{getStatusText(table.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {table.status === "occupied" && (
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{table.customers}名</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>
                      {table.startTime} ({table.duration ? formatDuration(table.duration) : "0:00"})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>¥{table.currentBill?.toLocaleString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">担当: {table.assignedStaff}</span>
                  </div>
                </>
              )}

              {table.status === "reserved" && (
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{table.customers}名予約</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{table.startTime}予定</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">担当: {table.assignedStaff}</span>
                  </div>
                </>
              )}

              <div className="flex space-x-2 mt-4">
                {table.status === "available" && (
                  <Button size="sm" onClick={() => updateTableStatus(table.id, "occupied")} className="flex-1">
                    案内開始
                  </Button>
                )}
                {table.status === "occupied" && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">
                          詳細
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{table.number} - テーブル詳細</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>お客様人数</Label>
                            <Input value={table.customers} readOnly />
                          </div>
                          <div>
                            <Label>開始時間</Label>
                            <Input value={table.startTime} readOnly />
                          </div>
                          <div>
                            <Label>担当スタッフ</Label>
                            <Input value={table.assignedStaff} readOnly />
                          </div>
                          <div>
                            <Label>現在の会計</Label>
                            <Input value={`¥${table.currentBill?.toLocaleString()}`} readOnly />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={() => updateTableStatus(table.id, "available")} className="flex-1">
                              会計完了
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateTableStatus(table.id, "cleaning")}
                              className="flex-1"
                            >
                              清掃へ
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                {table.status === "cleaning" && (
                  <Button size="sm" onClick={() => updateTableStatus(table.id, "available")} className="flex-1">
                    清掃完了
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
