'use client';

import * as React from 'react';
import { FileText, Users, Check, UserPlus } from 'lucide-react';

import { Card, CardContent } from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  percentageChange: number;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  percentageChange,
  className
}: StatsCardProps): React.JSX.Element => {
  return (
    <Card className={cn('p-6', className)}>
      <CardContent className="p-0 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground text-[#000]">{title}</span>
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[#000]">{value.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground text-slate-600">
            +{percentageChange}% from last month
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatsData {
  totalApplications: number;
  sourcesOfStartups: number;
  totalMentors: number;
  sourcingPartners: number;
  percentageChange: {
    applications: number;
    startups: number;
    mentors: number;
    partners: number;
  };
}

interface StatsCardGridProps {
  data?: StatsData;
}

// Default data if none is provided
const defaultStatsData = {
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
};

export function StatsCardGrid({ data = defaultStatsData }: StatsCardGridProps): React.JSX.Element {
  const statsItems = [
    {
      title: 'Total Application',
      value: data.totalApplications,
      icon: <FileText className="size-5 text-muted-foreground" />,
      percentageChange: data.percentageChange.applications
    },
    {
      title: 'Sources of Startups',
      value: data.sourcesOfStartups,
      icon: <Check className="size-5 text-muted-foreground" />,
      percentageChange: data.percentageChange.startups
    },
    {
      title: 'Total Mentors',
      value: data.totalMentors,
      icon: <Users className="size-5 text-muted-foreground" />,
      percentageChange: data.percentageChange.mentors
    },
    {
      title: 'Sourcing Partners',
      value: data.sourcingPartners,
      icon: <UserPlus className="size-5 text-muted-foreground" />,
      percentageChange: data.percentageChange.partners
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {statsItems.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          percentageChange={stat.percentageChange}
        />
      ))}
    </div>
  );
}
