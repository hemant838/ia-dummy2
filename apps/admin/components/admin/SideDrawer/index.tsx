'use client';

import { Drawer as VaulDrawer } from 'vaul';

import { Drawer } from '@workspace/ui/components/drawer';

const FilterDrawer = ({ modal, title, children }: any) => {
  return (
    <Drawer
      open={modal.visible}
      onOpenChange={modal.handleOpenChange}
      direction="right"
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content
          className="right-0 top-0 bottom-0 fixed z-10 outline-none w-[392px] flex"
          style={
            { '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties
          }
        >
          <div className="bg-white h-full w-full grow p-3 flex flex-col rounded-0 space-y-3">
            <div className="w-full flex items-center h-14">
              <VaulDrawer.Title className="font-medium text-lg mb-2 text-black">
                {title}
              </VaulDrawer.Title>
            </div>

            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </Drawer>
  );
};

export default FilterDrawer;
