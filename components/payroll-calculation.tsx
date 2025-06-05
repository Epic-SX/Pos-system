"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, Clock, Star, Users, Download } from "lucide-react"

interface PayrollData {
  staffId: number
  name: string
  position: string
  workingHours: number
  hourlyRate: number
  nominations: number
  nominationFee: number
  bottleCommission: number
  companionFee: number
  bonuses: number
  deductions: number
  totalSalary: number
  date: string
}

export default function PayrollCalculation() {
  const [selectedPeriod, setSelectedPeriod] = useState("daily")
  const [selectedDate, setSelectedDate] = useState("2024-01-15")

  const [payrollData] = useState<PayrollData[]>([
    {
      staffId: 1,
      name: "Yuki",
      position: "キャスト",
      workingHours: 6.5,
      hourlyRate: 3000,
      nominations: 8,
      nominationFee: 5000,
      bottleCommission: 12000,
      companionFee: 15000,
      bonuses: 5000,
      deductions: 2000,
      totalSalary: 75500,
      date: "2024-01-15",
    },
    {
      staffId: 2,
      name: "Sakura",
      position: "キャスト",
      workingHours: 7.0,
      hourlyRate: 2800,
      nominations: 6,
      nominationFee: 5000,
      bottleCommission: 9500,
      companionFee: 10000,
      bonuses: 3000,
      deductions: 1500,
      totalSalary: 60100,
      date: "2024-01-15",
    },
    {
      staffId: 3,
      name: "Miki",
      position: "キャスト",
      workingHours: 5.5,
      hourlyRate: 2500,
      nominations: 5,
      nominationFee: 5000,
      bottleCommission: 7800,
      companionFee: 8000,
      bonuses: 2000,
      deductions: 1000,
      totalSalary: 45550,
      date: "2024-01-15",
    },
    {
      staffId: 4,
      name: "Takeshi",
      position: "マネージャー",
      workingHours: 8.0,
      hourlyRate: 3500,
      nominations: 0,
      nominationFee: 0,
      bottleCommission: 0,
      companionFee: 0,
      bonuses: 10000,
      deductions: 3000,
      totalSalary: 35000,
      date: "2024-01-15",
    },
  ])

  const calculateBaseSalary = (hours: number, rate: number) => hours * rate
  const calculateNominationTotal = (nominations: number, fee: number) => nominations * fee

  const totalPayroll = payrollData.reduce((sum, data) => sum + data.totalSalary, 0)
  const totalHours = payrollData.reduce((sum, data) => sum + data.workingHours, 0)
  const totalNominations = payrollData.reduce((sum, data) => sum + data.nominations, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">総給与額</p>
                <p className="text-2xl font-bold">¥{totalPayroll.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">総勤務時間</p>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">総指名数</p>
                <p className="text-2xl font-bold">{totalNominations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">対象スタッフ</p>
                <p className="text-2xl font-bold">{payrollData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle>給与計算期間</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 items-end">
            <div>
              <Label>計算期間</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">日次</SelectItem>
                  <SelectItem value="weekly">週次</SelectItem>
                  <SelectItem value="monthly">月次</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>対象日</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              計算実行
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              CSV出力
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Details */}
      <Card>
        <CardHeader>
          <CardTitle>給与明細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">スタッフ名</th>
                  <th className="text-left p-3">ポジション</th>
                  <th className="text-right p-3">勤務時間</th>
                  <th className="text-right p-3">基本給</th>
                  <th className="text-right p-3">指名数</th>
                  <th className="text-right p-3">指名料</th>
                  <th className="text-right p-3">ボトルバック</th>
                  <th className="text-right p-3">同伴料</th>
                  <th className="text-right p-3">ボーナス</th>
                  <th className="text-right p-3">控除</th>
                  <th className="text-right p-3 font-bold">総支給額</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((data) => (
                  <tr key={data.staffId} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{data.name}</td>
                    <td className="p-3">
                      <Badge variant="outline">{data.position}</Badge>
                    </td>
                    <td className="p-3 text-right">{data.workingHours}h</td>
                    <td className="p-3 text-right">
                      ¥{calculateBaseSalary(data.workingHours, data.hourlyRate).toLocaleString()}
                    </td>
                    <td className="p-3 text-right">{data.nominations}</td>
                    <td className="p-3 text-right">
                      ¥{calculateNominationTotal(data.nominations, data.nominationFee).toLocaleString()}
                    </td>
                    <td className="p-3 text-right">¥{data.bottleCommission.toLocaleString()}</td>
                    <td className="p-3 text-right">¥{data.companionFee.toLocaleString()}</td>
                    <td className="p-3 text-right text-green-600">+¥{data.bonuses.toLocaleString()}</td>
                    <td className="p-3 text-right text-red-600">-¥{data.deductions.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-lg">¥{data.totalSalary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-gray-50">
                  <td className="p-3 font-bold" colSpan={2}>
                    合計
                  </td>
                  <td className="p-3 text-right font-bold">{totalHours.toFixed(1)}h</td>
                  <td className="p-3 text-right font-bold">
                    ¥
                    {payrollData
                      .reduce((sum, data) => sum + calculateBaseSalary(data.workingHours, data.hourlyRate), 0)
                      .toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold">{totalNominations}</td>
                  <td className="p-3 text-right font-bold">
                    ¥
                    {payrollData
                      .reduce((sum, data) => sum + calculateNominationTotal(data.nominations, data.nominationFee), 0)
                      .toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold">
                    ¥{payrollData.reduce((sum, data) => sum + data.bottleCommission, 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold">
                    ¥{payrollData.reduce((sum, data) => sum + data.companionFee, 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold text-green-600">
                    +¥{payrollData.reduce((sum, data) => sum + data.bonuses, 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold text-red-600">
                    -¥{payrollData.reduce((sum, data) => sum + data.deductions, 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold text-xl">¥{totalPayroll.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Individual Payroll Details */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList>
          <TabsTrigger value="breakdown">給与内訳</TabsTrigger>
          <TabsTrigger value="settings">計算設定</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payrollData
              .filter((data) => data.position === "キャスト")
              .map((data) => (
                <Card key={data.staffId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {data.name}
                      <Badge>{data.position}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>基本給:</span>
                          <span>¥{calculateBaseSalary(data.workingHours, data.hourlyRate).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>指名料:</span>
                          <span>
                            ¥{calculateNominationTotal(data.nominations, data.nominationFee).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>ボトルバック:</span>
                          <span>¥{data.bottleCommission.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>同伴料:</span>
                          <span>¥{data.companionFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>ボーナス:</span>
                          <span>+¥{data.bonuses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>控除:</span>
                          <span>-¥{data.deductions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>総支給額:</span>
                        <span>¥{data.totalSalary.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      給与明細書出力
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>給与計算設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">基本設定</h3>
                  <div>
                    <Label>指名料単価</Label>
                    <Input type="number" defaultValue="5000" />
                  </div>
                  <div>
                    <Label>ボトルバック率 (%)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                  <div>
                    <Label>同伴料単価</Label>
                    <Input type="number" defaultValue="5000" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">控除設定</h3>
                  <div>
                    <Label>所得税率 (%)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div>
                    <Label>厚生費</Label>
                    <Input type="number" defaultValue="2000" />
                  </div>
                  <div>
                    <Label>その他控除</Label>
                    <Input type="number" defaultValue="0" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button>設定保存</Button>
                <Button variant="outline">デフォルトに戻す</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
