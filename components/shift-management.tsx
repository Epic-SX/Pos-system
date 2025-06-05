"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, Plus, Edit, ChevronLeft, ChevronRight } from "lucide-react"

interface Shift {
  id: number
  staffId: number
  staffName: string
  date: string
  startTime: string
  endTime: string
  position: string
  status: "scheduled" | "confirmed" | "completed" | "absent"
  notes?: string
}

interface ShiftRequest {
  id: number
  staffId: number
  staffName: string
  requestedDates: string[]
  preferredTimes: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

export default function ShiftManagement() {
  const [currentWeek, setCurrentWeek] = useState(new Date("2024-01-15"))

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: 1,
      staffId: 1,
      staffName: "Yuki",
      date: "2024-01-15",
      startTime: "20:00",
      endTime: "02:00",
      position: "キャスト",
      status: "confirmed",
    },
    {
      id: 2,
      staffId: 2,
      staffName: "Sakura",
      date: "2024-01-15",
      startTime: "20:30",
      endTime: "02:30",
      position: "キャスト",
      status: "confirmed",
    },
    {
      id: 3,
      staffId: 3,
      staffName: "Miki",
      date: "2024-01-16",
      startTime: "19:30",
      endTime: "01:30",
      position: "キャスト",
      status: "scheduled",
    },
    {
      id: 4,
      staffId: 4,
      staffName: "Takeshi",
      date: "2024-01-15",
      startTime: "19:00",
      endTime: "03:00",
      position: "マネージャー",
      status: "confirmed",
    },
    {
      id: 5,
      staffId: 1,
      staffName: "Yuki",
      date: "2024-01-17",
      startTime: "20:00",
      endTime: "02:00",
      position: "キャスト",
      status: "scheduled",
    },
  ])

  const [shiftRequests, setShiftRequests] = useState<ShiftRequest[]>([
    {
      id: 1,
      staffId: 3,
      staffName: "Miki",
      requestedDates: ["2024-01-18", "2024-01-19"],
      preferredTimes: "20:00-02:00",
      status: "pending",
      submittedAt: "2024-01-14 15:30",
    },
    {
      id: 2,
      staffId: 2,
      staffName: "Sakura",
      requestedDates: ["2024-01-20"],
      preferredTimes: "19:00-01:00",
      status: "pending",
      submittedAt: "2024-01-14 12:15",
    },
  ])

  const getWeekDates = (startDate: Date) => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })
  }

  const formatDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("ja-JP", { weekday: "short" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-500"
      case "confirmed":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "absent":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "予定"
      case "confirmed":
        return "確定"
      case "completed":
        return "完了"
      case "absent":
        return "欠勤"
      default:
        return status
    }
  }

  const weekDates = getWeekDates(currentWeek)

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const getShiftsForDate = (date: string) => {
    return shifts.filter((shift) => shift.date === date)
  }

  const updateShiftStatus = (shiftId: number, newStatus: Shift["status"]) => {
    setShifts(shifts.map((shift) => (shift.id === shiftId ? { ...shift, status: newStatus } : shift)))
  }

  const approveShiftRequest = (requestId: number) => {
    setShiftRequests(
      shiftRequests.map((request) => (request.id === requestId ? { ...request, status: "approved" } : request)),
    )
  }

  const rejectShiftRequest = (requestId: number) => {
    setShiftRequests(
      shiftRequests.map((request) => (request.id === requestId ? { ...request, status: "rejected" } : request)),
    )
  }

  const totalShiftsThisWeek = shifts.filter((shift) => {
    const shiftDate = new Date(shift.date)
    const weekStart = new Date(currentWeek)
    const weekEnd = new Date(currentWeek)
    weekEnd.setDate(weekStart.getDate() + 6)
    return shiftDate >= weekStart && shiftDate <= weekEnd
  }).length

  const confirmedShifts = shifts.filter((shift) => shift.status === "confirmed").length
  const pendingRequests = shiftRequests.filter((request) => request.status === "pending").length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">今週のシフト</p>
                <p className="text-2xl font-bold">{totalShiftsThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">確定済み</p>
                <p className="text-2xl font-bold">{confirmedShifts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">承認待ち</p>
                <p className="text-2xl font-bold">{pendingRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">出勤率</p>
                <p className="text-2xl font-bold">95%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">シフト表</TabsTrigger>
          <TabsTrigger value="requests">シフト希望</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>週間シフト表</CardTitle>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">
                    {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {weekDates.map((date, index) => {
                  const dateString = formatDateString(date)
                  const dayShifts = getShiftsForDate(dateString)

                  return (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="text-center mb-3">
                        <p className="font-medium">{getDayName(date)}</p>
                        <p className="text-sm text-gray-600">{formatDate(date)}</p>
                      </div>

                      <div className="space-y-2">
                        {dayShifts.map((shift) => (
                          <div key={shift.id} className="p-2 border rounded text-xs">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{shift.staffName}</span>
                              <Badge className={`${getStatusColor(shift.status)} text-white text-xs`}>
                                {getStatusText(shift.status)}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{shift.position}</p>
                            <p className="text-gray-600">
                              {shift.startTime}-{shift.endTime}
                            </p>

                            {shift.status === "scheduled" && (
                              <div className="flex space-x-1 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateShiftStatus(shift.id, "confirmed")}
                                  className="text-xs px-2 py-1 h-6"
                                >
                                  確定
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}

                        {dayShifts.length === 0 && <p className="text-gray-400 text-center text-xs">シフトなし</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <div className="space-y-4">
            {shiftRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{request.staffName}</h3>
                        <Badge
                          variant={
                            request.status === "pending"
                              ? "default"
                              : request.status === "approved"
                                ? "default"
                                : "destructive"
                          }
                          className={
                            request.status === "pending"
                              ? "bg-yellow-500"
                              : request.status === "approved"
                                ? "bg-green-500"
                                : ""
                          }
                        >
                          {request.status === "pending"
                            ? "承認待ち"
                            : request.status === "approved"
                              ? "承認済み"
                              : "却下"}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>希望日: {request.requestedDates.join(", ")}</p>
                        <p>希望時間: {request.preferredTimes}</p>
                        <p>申請日時: {request.submittedAt}</p>
                      </div>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => approveShiftRequest(request.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          承認
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => rejectShiftRequest(request.id)}>
                          却下
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {shiftRequests.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">シフト希望はありません</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>スタッフ別勤務時間</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Yuki", "Sakura", "Miki", "Takeshi"].map((name) => {
                    const staffShifts = shifts.filter((shift) => shift.staffName === name)
                    const totalHours = staffShifts.length * 6 // 仮の計算

                    return (
                      <div key={name} className="flex justify-between items-center p-3 border rounded">
                        <span className="font-medium">{name}</span>
                        <div className="text-right">
                          <p className="font-bold">{totalHours}時間</p>
                          <p className="text-sm text-gray-600">{staffShifts.length}日</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>出勤率統計</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span>今週の出勤率</span>
                      <span className="text-2xl font-bold text-green-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>

                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span>今月の出勤率</span>
                      <span className="text-2xl font-bold text-blue-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>

                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">欠勤理由</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>体調不良</span>
                        <span>60%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>私用</span>
                        <span>30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>その他</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              一括編集
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>シフト一括編集</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>対象期間</Label>
                <div className="flex space-x-2">
                  <Input type="date" />
                  <span className="flex items-center">〜</span>
                  <Input type="date" />
                </div>
              </div>
              <div>
                <Label>対象スタッフ</Label>
                <select className="w-full p-2 border rounded">
                  <option value="all">全スタッフ</option>
                  <option value="cast">キャストのみ</option>
                  <option value="other">その他スタッフ</option>
                </select>
              </div>
              <Button className="w-full">一括更新</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              シフト追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新規シフト追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>スタッフ</Label>
                <select className="w-full p-2 border rounded">
                  <option value="">スタッフを選択</option>
                  <option value="1">Yuki</option>
                  <option value="2">Sakura</option>
                  <option value="3">Miki</option>
                  <option value="4">Takeshi</option>
                </select>
              </div>
              <div>
                <Label>日付</Label>
                <Input type="date" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>開始時間</Label>
                  <Input type="time" />
                </div>
                <div>
                  <Label>終了時間</Label>
                  <Input type="time" />
                </div>
              </div>
              <div>
                <Label>備考</Label>
                <Input placeholder="備考があれば入力" />
              </div>
              <Button className="w-full">追加</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
