import { useSettings } from "@/provider/SettingsProvider";
import { ReactElement, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type PropTypes = {
  message: ReactNode;
  children: ReactElement;
};

const HelpTooltip = ({ message, children }: PropTypes) => {
  const { settings } = useSettings();

  if (!settings.style.showTooltips) return children;

  return (
    <Tooltip delay={700}>
      <TooltipTrigger render={children} />
      <TooltipContent className="italic">{message}</TooltipContent>
    </Tooltip>
  );
};

export default HelpTooltip;
