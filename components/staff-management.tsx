"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Clock, DollarSign, Star, Users } from "lucide-react"

interface Staff {
  id: number
  name: string
  status: "active" | "break" | "off-duty"
  startTime?: string
  hourlyRate: number
  todayNominations: number
  todaySales: number
  bottleCommission: number
  position: "cast" | "manager" | "bartender"
  avatar?: string
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: 1,
      name: "Yuki",
      status: "active",
      startTime: "20:00",
      hourlyRate: 3000,
      todayNominations: 8,
      todaySales: 85000,
      bottleCommission: 12000,
      position: "cast",
    },
    {
      id: 2,
      name: "Sakura",
      status: "active",
      startTime: "20:30",
      hourlyRate: 2800,
      todayNominations: 6,
      todaySales: 72000,
      bottleCommission: 9500,
      position: "cast",
    },
    {
      id: 3,
      name: "Miki",
      status: "break",
      startTime: "19:30",
      hourlyRate: 2500,
      todayNominations: 5,
      todaySales: 58000,
      bottleCommission: 7800,
      position: "cast",
    },
    {
      id: 4,
      name: "Takeshi",
      status: "active",
      startTime: "19:00",
      hourlyRate: 3500,
      todayNominations: 0,
      todaySales: 0,
      bottleCommission: 0,
      position: "manager",
    },
    {
      id: 5,
      name: "Hiroshi",
      status: "active",
      startTime: "20:00",
      hourlyRate: 2200,
      todayNominations: 0,
      todaySales: 0,
      bottleCommission: 0,
      position: "bartender",
    },
  ])

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "break":
        return "bg-yellow-500"
      case "off-duty":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "勤務中"
      case "break":
        return "休憩中"
      case "off-duty":
        return "退勤"
      default:
        return status
    }
  }

  const getPositionText = (position: string) => {
    switch (position) {
      case "cast":
        return "キャスト"
      case "manager":
        return "マネージャー"
      case "bartender":
        return "バーテンダー"
      default:
        return position
    }
  }

  const updateStaffStatus = (staffId: number, newStatus: Staff["status"]) => {
    setStaff(staff.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s)))
  }

  const calculateWorkingHours = (startTime: string) => {
    if (!startTime) return 0
    const start = new Date(`2024-01-01 ${startTime}:00`)
    const now = new Date(
      `2024-01-01 ${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}:00`,
    )
    const diff = now.getTime() - start.getTime()
    return Math.max(0, diff / (1000 * 60 * 60))
  }

  const activeCast = staff.filter((s) => s.position === "cast" && s.status === "active")
  const allCast = staff.filter((s) => s.position === "cast")
  const otherStaff = staff.filter((s) => s.position !== "cast")

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">出勤中スタッフ</p>
                <p className="text-2xl font-bold">{activeCast.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">本日指名総数</p>
                <p className="text-2xl font-bold">{allCast.reduce((sum, s) => sum + s.todayNominations, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">本日売上総額</p>
                <p className="text-2xl font-bold">
                  ¥{allCast.reduce((sum, s) => sum + s.todaySales, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">平均勤務時間</p>
                <p className="text-2xl font-bold">
                  {activeCast.length > 0
                    ? (
                        activeCast.reduce((sum, s) => sum + calculateWorkingHours(s.startTime || ""), 0) /
                        activeCast.length
                      ).toFixed(1)
                    : "0"}
                  h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cast" className="w-full">
        <TabsList>
          <TabsTrigger value="cast">キャスト</TabsTrigger>
          <TabsTrigger value="other">その他スタッフ</TabsTrigger>
        </TabsList>

        <TabsContent value="cast">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCast.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{member.name}</h3>
                        <Badge className={`${getStatusColor(member.status)} text-white`}>
                          {getStatusText(member.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{getPositionText(member.position)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {member.status !== "off-duty" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>出勤時間:</span>
                        <span>{member.startTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>勤務時間:</span>
                        <span>{calculateWorkingHours(member.startTime || "").toFixed(1)}h</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>本日指名:</span>
                    <span className="font-medium">{member.todayNominations}回</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>本日売上:</span>
                    <span className="font-medium">¥{member.todaySales.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>ボトルバック:</span>
                    <span className="font-medium">¥{member.bottleCommission.toLocaleString()}</span>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    {member.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStaffStatus(member.id, "break")}
                        className="flex-1"
                      >
                        休憩
                      </Button>
                    )}
                    {member.status === "break" && (
                      <Button size="sm" onClick={() => updateStaffStatus(member.id, "active")} className="flex-1">
                        復帰
                      </Button>
                    )}
                    {member.status !== "off-duty" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStaffStatus(member.id, "off-duty")}
                        className="flex-1"
                      >
                        退勤
                      </Button>
                    )}
                    {member.status === "off-duty" && (
                      <Button size="sm" onClick={() => updateStaffStatus(member.id, "active")} className="flex-1">
                        出勤
                      </Button>
                    )}
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
                        <DialogTitle>{member.name} - 詳細情報</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>名前</Label>
                          <Input value={member.name} />
                        </div>
                        <div>
                          <Label>時給</Label>
                          <Input value={member.hourlyRate} type="number" />
                        </div>
                        <div>
                          <Label>ポジション</Label>
                          <Input value={getPositionText(member.position)} readOnly />
                        </div>
                        <div>
                          <Label>本日の指名数</Label>
                          <Input value={member.todayNominations} type="number" />
                        </div>
                        <Button className="w-full">更新</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="other">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherStaff.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{member.name}</h3>
                        <Badge className={`${getStatusColor(member.status)} text-white`}>
                          {getStatusText(member.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{getPositionText(member.position)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {member.status !== "off-duty" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>出勤時間:</span>
                        <span>{member.startTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>勤務時間:</span>
                        <span>{calculateWorkingHours(member.startTime || "").toFixed(1)}h</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>時給:</span>
                    <span className="font-medium">¥{member.hourlyRate.toLocaleString()}</span>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    {member.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStaffStatus(member.id, "break")}
                        className="flex-1"
                      >
                        休憩
                      </Button>
                    )}
                    {member.status === "break" && (
                      <Button size="sm" onClick={() => updateStaffStatus(member.id, "active")} className="flex-1">
                        復帰
                      </Button>
                    )}
                    {member.status !== "off-duty" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStaffStatus(member.id, "off-duty")}
                        className="flex-1"
                      >
                        退勤
                      </Button>
                    )}
                    {member.status === "off-duty" && (
                      <Button size="sm" onClick={() => updateStaffStatus(member.id, "active")} className="flex-1">
                        出勤
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新規スタッフ追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新規スタッフ追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>名前</Label>
                <Input placeholder="スタッフ名を入力" />
              </div>
              <div>
                <Label>ポジション</Label>
                <select className="w-full p-2 border rounded">
                  <option value="cast">キャスト</option>
                  <option value="manager">マネージャー</option>
                  <option value="bartender">バーテンダー</option>
                </select>
              </div>
              <div>
                <Label>時給</Label>
                <Input type="number" placeholder="時給を入力" />
              </div>
              <Button className="w-full">追加</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
