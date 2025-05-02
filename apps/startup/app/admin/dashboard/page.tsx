import * as React from 'react';
import { type Metadata } from 'next';
import { LogIn } from 'lucide-react';

import { getJWTToken } from '@workspace/auth/jwtAccessToken';
import { APP_NAME } from '@workspace/common/app';
import { routes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';

import { createTitle } from '~/lib/formatters';
import { Component as PieChartComponent } from './pie-charts';
import { StatsCardGrid } from './stats-card';
import { Component as LinearChartsComponent } from './linear-charts';
import { Component as BarChartComponent } from './bar-charts';

// Centralized dashboard data
export const dashboardData = {
  stats: {
    totalApplications: 24828,
    sourcesOfStartups: 18543,
    totalMentors: 1267,
    sourcingPartners: 845,
    percentageChange: {
      applications: 21.1,
      startups: 18.5,
      mentors: 15.3,
      partners: 12.8
    }
  },
  startupStages: [
    { stage: "L1", value: 80, fill: "#b91c1c", label: "Early Stage" },  // Dark red
    { stage: "L2", value: 60, fill: "#ef4444", label: "Growth Stage" },  // Medium red
    { stage: "L3", value: 40, fill: "#fca5a5", label: "Scale Stage" },  // Light red
    { stage: "L4", value: 23, fill: "#fee2e2", label: "Mature Stage" },  // Very light red
  ],
  startupThesis: [
    { thesis: "AI/ML", value: 95, fill: "#1e40af", label: "Artificial Intelligence" },  // Blue
    { thesis: "FinTech", value: 75, fill: "#3b82f6", label: "Financial Technology" },  // Medium blue
    { thesis: "EdTech", value: 55, fill: "#93c5fd", label: "Education Technology" },  // Light blue
    { thesis: "Climate", value: 40, fill: "#dbeafe", label: "Climate Tech" },  // Very light blue
  ],
  monthlyVisitors: {
    linear: [
      { month: "January", desktop: 186 },
      { month: "February", desktop: 305 },
      { month: "March", desktop: 237 },
      { month: "April", desktop: 73 },
      { month: "May", desktop: 209 },
      { month: "June", desktop: 214 },
    ],
    bar: [
      { month: "January", desktop: 186, mobile: 80 },
      { month: "February", desktop: 305, mobile: 200 },
      { month: "March", desktop: 237, mobile: 120 },
      { month: "April", desktop: 73, mobile: 190 },
      { month: "May", desktop: 209, mobile: 130 },
      { month: "June", desktop: 214, mobile: 140 },
    ]
  },
  dateRange: {
    from: new Date(2024, 0, 1), // January 1, 2024
    to: new Date(2024, 5, 30),  // June 30, 2024
  }
};

const PageTitle = ({ title }: any): React.JSX.Element => {
  return (
    <div className="flex h-auto w-full items-center justify-between">
      <h2 className="text-2xl leading-[150%] font-semibold">{title}</h2>
    </div>
  );
};

export const metadata: Metadata = {
  title: createTitle('Dashboard')
};

export default async function DashboardPage(): Promise<React.JSX.Element> {
  return (
    <div className="relative h-full w-full space-y-2">
      {/* <PageTitle title="Dashboard Overview" /> */}

      <StatsCardGrid data={dashboardData.stats} />

      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-2">
        <div className="md:col-span-2 lg:col-span-2 h-[500px]">
          <PieChartComponent
            stageData={dashboardData.startupStages}
            thesisData={dashboardData.startupThesis}
          />
        </div>
        <div className="md:col-span-3 lg:col-span-3 h-[500px]">
          <LinearChartsComponent
            data={dashboardData.monthlyVisitors.linear}
            initialDateRange={dashboardData.dateRange}
          />
        </div>
        <div className="md:col-span-5 lg:col-span-5">
          <BarChartComponent data={dashboardData.monthlyVisitors.bar} />
        </div>
      </div>
    </div>
  );
}
