import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';

const TabList = ({
  value,
  tabItems = [],
  onValueChange
}: any): React.JSX.Element => {
  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      defaultValue={value}
    >
      <TabsList>
        {tabItems.map((item: any, index: number) => {
          return (
            <TabsTrigger
              key={`${item.value}_${index}`}
              value={item.value}
            >
              {item.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default TabList;
