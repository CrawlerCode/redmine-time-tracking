import { clsxm } from "@/utils/clsxm";
import { Entrypoint } from "@/utils/entrypoint";
import { PropsWithChildren } from "react";

interface LayoutProps extends PropsWithChildren {
  entrypoint: Entrypoint;
}

export const Layout = ({ entrypoint, children }: LayoutProps) => {
  return (
    <div
      className={clsxm("mx-auto flex h-screen w-[320px] flex-col overflow-hidden", {
        "w-full min-w-[320px]": ["index", "options"].includes(entrypoint),
        "h-[550px]": ["popup", "options"].includes(entrypoint),
      })}
      onContextMenu={(e) => e.preventDefault()} // disable context menu
    >
      {children}
    </div>
  );
};
