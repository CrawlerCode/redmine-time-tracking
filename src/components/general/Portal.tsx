import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type PortalProps = {
  containerId: string;
  children: ReactNode;
};

export function Portal({ containerId, children }: PortalProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  const container = document.getElementById(containerId);
  if (!container) return null;

  return createPortal(children, container);
}
