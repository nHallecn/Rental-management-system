"use client";

import { Drawer as VaulDrawer } from "vaul";

// This component simplifies using the Vaul library
// It takes a button to open the drawer and the content to show inside
export const Drawer = ({ open, onOpenChange, button, title, description, children }) => {
  return (
    <VaulDrawer.Root open={open} onOpenChange={onOpenChange}>
      <VaulDrawer.Trigger asChild>
        {button}
      </VaulDrawer.Trigger>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            <div className="max-w-md mx-auto">
              <VaulDrawer.Title className="font-bold text-2xl mb-1">
                {title}
              </VaulDrawer.Title>
              <p className="text-gray-500 mb-6">{description}</p>
              {children}
            </div>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
