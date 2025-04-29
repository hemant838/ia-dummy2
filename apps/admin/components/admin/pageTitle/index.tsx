'use client';

import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

import { routes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';

const PageTitle = ({
  title,
  pageName,
  pageActions = []
}: any): React.JSX.Element => {
  const router = useRouter();

  return (
    <div className="flex h-auto w-full items-center justify-between">
      <h2 className="text-2xl leading-[150%] font-semibold">{title}</h2>

      <div className="flex items-center gap-x-3">
        {pageActions.map((item: any, itemIndex: number) => {
          let textColor: string = 'text-secondary-foreground';
          if (item?.variant === 'default') {
            textColor = 'text-white';
          }
          return (
            <Button
              key={`button_page_action_${itemIndex}`}
              variant={item?.variant || 'default'}
              className={`gap-x-3 font-medium ${textColor} max-h-[40px]`}
              onClick={() => {
                if (item?.type === 'link') {
                  return router.push(
                    routes.dashboard.admin.routes.programs.routes.CreateProgram
                  );
                }

                if (item?.type === 'button') {
                  return item.onClick();
                }
              }}
            >
              {item?.icon && (
                <span>
                  <item.icon className="size-5" />
                </span>
              )}

              <span>{item?.label}</span>
            </Button>
          );
        })}

        {/* <Button
          variant="secondary"
          className="gap-x-4 font-medium text-secondary-foreground max-h-[40px]"
        >
          <span>
            <LogIn className="size-5" />
          </span>
          <span>Export</span>
        </Button>

        <Button
          variant="default"
          onClick={() => {
            return router.push(
              routes.dashboard.admin.routes.programs.routes.CreateProgram
            );
          }}
          className="max-h-[40px] font-medium"
        >
          Create {pageName}
        </Button> */}
      </div>
    </div>
  );
};

export default PageTitle;
