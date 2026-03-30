import { clsxm } from "@/utils/clsxm";
import { ComponentPropsWithRef, ReactNode, useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface ScrollspyGroup {
  key: string;
  label: ReactNode;
}

interface SidebarScrollspyProps {
  groups: ScrollspyGroup[];
  children: ({ getGroupProps }: { getGroupProps: (key: string) => ComponentPropsWithRef<"div"> }) => ReactNode;
  classNames?: {
    root?: string;
    sidebar?: string;
    section?: string;
  };
}

export function SidebarScrollspy({ groups, classNames, children }: SidebarScrollspyProps) {
  const [activeGroup, setActiveGroup] = useState<string | undefined>(groups[0]?.key ?? undefined);

  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleTabChange = (value: string) => {
    setActiveGroup(value);
    groupRefs.current[value]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { scrollContainerRef, registerElement } = useMostVisible((element) => {
    const groupKey = element.getAttribute("data-group-key");
    if (groupKey) setActiveGroup(groupKey);
  });

  const getGroupProps = useCallback(
    (key: string) => ({
      ref: (el: HTMLDivElement | null) => {
        const prevEl = groupRefs.current[key] || null;
        groupRefs.current[key] = el;
        registerElement(el, prevEl);
      },
      "data-group-key": key,
    }),
    [registerElement]
  );

  return (
    <div className={clsxm("flex min-h-0 flex-1", classNames?.root)}>
      <aside className={clsxm("shrink-0 overflow-y-auto border-r", classNames?.sidebar)}>
        <Tabs value={activeGroup} onValueChange={handleTabChange} orientation="vertical">
          <TabsList variant="line" className="w-full">
            {groups.map((group) => (
              <TabsTrigger key={group.key} value={group.key} className="w-full">
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </aside>
      <section ref={scrollContainerRef} className={clsxm("flex-1 overflow-y-auto", classNames?.section)}>
        {children?.({ getGroupProps })}
      </section>
    </div>
  );
}

const dummyGetGroupProps = () => ({});
export const OptionalSidebarScrollspy = ({ enabled, ...props }: SidebarScrollspyProps & { enabled: boolean }) => {
  return enabled ? (
    <SidebarScrollspy {...props} />
  ) : (
    <div className={clsxm("flex min-h-0", props.classNames?.root)}>
      <section className={clsxm("flex-1 overflow-y-auto", props.classNames?.section)}>{props.children?.({ getGroupProps: dummyGetGroupProps })}</section>
    </div>
  );
};

const useMostVisible = (onChange: (element: Element) => void) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const ratiosRef = useRef<Map<Element, number>>(new Map());
  const pendingElementsRef = useRef<Set<HTMLDivElement>>(new Set());

  const onChangeEvent = useEffectEvent(onChange);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const ratios = ratiosRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let maxRatio = 0;
        let mostVisible: Element | null = null;
        for (const [el, ratio] of ratios) {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisible = el;
          }
        }

        if (mostVisible && maxRatio > 0) {
          onChangeEvent(mostVisible);
        }
      },
      { root: container, threshold: [0, 0.1, 0.3, 0.5, 0.7, 1], rootMargin: "0px 0px -60% 0px" }
    );
    observerRef.current = observer;

    for (const el of pendingElementsRef.current) {
      observer.observe(el);
    }
    pendingElementsRef.current.clear();

    return () => {
      observer.disconnect();
      ratios.clear();
      observerRef.current = null;
    };
  }, []);

  const registerElement = (el: HTMLDivElement | null, prevEl: HTMLDivElement | null) => {
    if (prevEl) {
      observerRef.current?.unobserve(prevEl);
      ratiosRef.current.delete(prevEl);
      pendingElementsRef.current.delete(prevEl);
    }
    if (el) {
      if (observerRef.current) {
        observerRef.current.observe(el);
      } else {
        pendingElementsRef.current.add(el);
      }
    }
  };

  return { scrollContainerRef, registerElement };
};
