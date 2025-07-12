import { useSettings } from "@/provider/SettingsProvider";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type PropTypes = {
  message: ReactNode;
  children: ReactNode;
};

const HelpTooltip = ({ message, children }: PropTypes) => {
  const { settings } = useSettings();

  if (!settings.style.showTooltips) return children;

  return (
    <Tooltip delayDuration={700}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="italic">{message}</TooltipContent>
    </Tooltip>
  );
};

export default HelpTooltip;
