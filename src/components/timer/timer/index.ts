import { TimerContextMenu } from "./TimerContextMenu";
import { TimerCounter } from "./TimerCounter";
import { TimerDoneButton } from "./TimerDoneButton";
import { TimerNameField } from "./TimerNameField";
import { TimerRoot } from "./TimerRoot";
import { TimerToggleButton } from "./TimerToggleButton";
import { TimerWrapper, TimerWrapperCard } from "./TimerWrapper";

const Timer = {
  Root: TimerRoot,
  ContextMenu: TimerContextMenu,
  Wrapper: TimerWrapper,
  WrapperCard: TimerWrapperCard,
  NameField: TimerNameField,
  Counter: TimerCounter,
  ToggleButton: TimerToggleButton,
  DoneButton: TimerDoneButton,
};

export default Timer;
