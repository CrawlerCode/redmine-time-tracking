import { ReactNode, useEffectEvent, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

type PortalNode = HTMLElement | ShadowRoot | null;

type PortalProps = {
  container: PortalNode | (() => PortalNode);
  children: ReactNode;
};

export function Portal({ container, children }: PortalProps) {
  const [portalNode, setPortalNode] = useState<PortalNode>(null);

  const updateNode = useEffectEvent(() => setPortalNode(typeof container === "function" ? container() : container));
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => updateNode(), []);

  if (!portalNode) return null;
  return createPortal(children, portalNode);
}
