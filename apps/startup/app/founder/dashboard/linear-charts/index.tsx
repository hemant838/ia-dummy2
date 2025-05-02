"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type DateRange } from "react-day-picker"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { DateRangePicker } from "@workspace/ui/components/date-picker"

interface LinearChartItem {
  month: string;
  desktop: number;
}

interface LinearChartProps {
  data?: LinearChartItem[];
  initialDateRange?: DateRange;
}

// Default data if none is provided
const defaultChartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "rgb(220, 38, 38)",
  },
} satisfies ChartConfig

export function Component({
  data = defaultChartData,
  initialDateRange = {
    from: new Date(2024, 0, 1), // January 1, 2024
    to: new Date(2024, 5, 30),  // June 30, 2024
  }
}: LinearChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange)

  return (
    <Card className="h-full">
      <CardHeader className="py-2 mb-2 border-b">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[16px]">Area Chart - Linear</CardTitle>
            <CardDescription className="text-[14px]">
              Showing total visitors for the last 6 months
            </CardDescription>
          </div>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            className="w-auto"
          />
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-120px)]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            accessibilityLayer
            data={data}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="rgb(220, 38, 38)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="rgb(254, 202, 202)"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={12}
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tick={{ fill: 'var(--muted-foreground)' }}
              tickFormatter={(value) => value.toLocaleString()}
              width={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="desktop"
              type="linear"
              fill="url(#colorValue)"
              stroke="rgb(220, 38, 38)"
              strokeWidth={2}
              fillOpacity={1}
              dot={{ fill: "rgb(220, 38, 38)", strokeWidth: 2 }}
              activeDot={{
                r: 6,
                fill: "rgb(220, 38, 38)",
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
