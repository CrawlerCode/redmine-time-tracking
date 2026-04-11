import { TimerContextMenu } from "./TimerContextMenu";
import { TimerCounter, TimerCounterSkeleton } from "./TimerCounter";
import { TimerDoneButton, TimerDoneButtonSkeleton } from "./TimerDoneButton";
import { TimerNameField, TimerNameFieldSkeleton } from "./TimerNameField";
import { TimerRoot } from "./TimerRoot";
import { TimerSessions, TimerSessionsSkeleton } from "./TimerSessions";
import { TimerToggleButton, TimerToggleButtonSkeleton } from "./TimerToggleButton";
import { TimerWrapper, TimerWrapperCard } from "./TimerWrapper";

export const TimerComponents = {
  Root: TimerRoot,
  ContextMenu: TimerContextMenu,
  Wrapper: TimerWrapper,
  WrapperCard: TimerWrapperCard,
  NameField: TimerNameField,
  Counter: TimerCounter,
  ToggleButton: TimerToggleButton,
  DoneButton: TimerDoneButton,
  Sessions: TimerSessions,
  Skeleton: {
    NameField: TimerNameFieldSkeleton,
    Counter: TimerCounterSkeleton,
    ToggleButton: TimerToggleButtonSkeleton,
    DoneButton: TimerDoneButtonSkeleton,
    Sessions: TimerSessionsSkeleton,
  },
};
