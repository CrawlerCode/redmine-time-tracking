import { ReactNode, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

export type PortalContainer = HTMLElement | ShadowRoot | null;

export type PortalProps = {
  container: PortalContainer | (() => PortalContainer);
  children: ReactNode;
};

export function Portal({ container, children }: PortalProps) {
  const [containerElement, setContainerElement] = useState<PortalContainer>(null);

  useLayoutEffect(() => {
    const resolvedContainer = typeof container === "function" ? container() : container;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContainerElement(resolvedContainer);
  }, [container]);

  if (!containerElement) return null;
  return createPortal(children, containerElement);
}
