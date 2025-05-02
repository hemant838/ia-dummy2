"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts"

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

interface StageData {
  stage: string;
  value: number;
  fill: string;
  label: string;
}

interface ThesisData {
  thesis: string;
  value: number;
  fill: string;
  label: string;
}

interface PieChartProps {
  stageData?: StageData[];
  thesisData?: ThesisData[];
}

// Default data if none is provided
const defaultStageData = [
  { stage: "L1", value: 80, fill: "#b91c1c", label: "Early Stage" },  // Dark red
  { stage: "L2", value: 60, fill: "#ef4444", label: "Growth Stage" },  // Medium red
  { stage: "L3", value: 40, fill: "#fca5a5", label: "Scale Stage" },  // Light red
  { stage: "L4", value: 23, fill: "#fee2e2", label: "Mature Stage" },  // Very light red
]

const defaultThesisData = [
  { thesis: "AI/ML", value: 95, fill: "#1e40af", label: "Artificial Intelligence" },  // Blue
  { thesis: "FinTech", value: 75, fill: "#3b82f6", label: "Financial Technology" },  // Medium blue
  { thesis: "EdTech", value: 55, fill: "#93c5fd", label: "Education Technology" },  // Light blue
  { thesis: "Climate", value: 40, fill: "#dbeafe", label: "Climate Tech" },  // Very light blue
]

const chartConfig = {
  value: {
    label: "Startups",
  },
} satisfies ChartConfig

export function Component({ stageData = defaultStageData, thesisData = defaultThesisData }: PieChartProps) {
  const [view, setView] = React.useState<'stage' | 'thesis'>('stage')

  // Select data based on current view
  const chartData = view === 'stage'
    ? stageData
    : thesisData.map(item => ({
        stage: item.thesis,
        value: item.value,
        fill: item.fill,
        label: item.label
      }));

  const totalStartups = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader className="flex-row items-center justify-between py-2 px-6 mb-2 border-b">
        <div>
          <CardTitle className="text-[16px] font-medium">
            {view === 'stage' ? 'Count of startups stage wise' : 'Count of startups by thesis'}
          </CardTitle>
        </div>
        <div className="flex items-center gap-0 bg-gray-100 rounded-md p-[2px]">
          <button
            onClick={() => setView('stage')}
            className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === 'stage'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Stage
          </button>
          <button
            onClick={() => setView('thesis')}
            className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === 'thesis'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Thesis
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="stage"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                startAngle={90}
                endAngle={-270}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <g>
                          <text
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 15}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-gray-500 text-sm"
                          >
                            Startups
                          </text>
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy || 0 - 10}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalStartups}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <div className="py-1">
        {chartData.map((item, index) => (
          <div
            key={item.stage}
            className="flex items-center justify-between py-2 border-l-2 pl-2 border-t border-gray-200 hover:bg-gray-50"
            style={{ borderLeftColor: item.fill }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-medium">{item.stage}</span>
              <span className="text-xs text-gray-500">({item.label})</span>
            </div>
            <div className="flex items-center gap-2 pr-4">
              <span className="text-sm font-medium">{item.value}</span>
              <span className="text-sm text-gray-500">({Math.round((item.value / totalStartups) * 100)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
