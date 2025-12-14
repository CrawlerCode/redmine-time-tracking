import { clsxm } from "@/utils/clsxm";
import { WindowLocationType } from "@/utils/popout";
import { PropsWithChildren } from "react";

interface LayoutProps extends PropsWithChildren {
  locationType: WindowLocationType;
}

export const Layout = ({ locationType, children }: LayoutProps) => {
  return (
    <div
      className={clsxm("mx-auto flex h-screen w-[320px] flex-col overflow-hidden", {
        "w-full min-w-[320px]": ["popout", "options"].includes(locationType),
        "h-[550px]": ["popup", "options"].includes(locationType),
      })}
      onContextMenu={(e) => e.preventDefault()} // disable context menu
    >
      {children}
    </div>
  );
};
