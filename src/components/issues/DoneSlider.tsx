import clsx from "clsx";

interface PropTypes extends Omit<React.ComponentProps<"input">, "value"> {
  value: number;
}
const DoneSlider = ({ value, className, ...props }: PropTypes) => {
  return (
    <div className={clsx("relative", className)}>
      <input
        {...props}
        value={value}
        min="0"
        max="100"
        step="10"
        type="range"
        className={clsx("h-5 w-[80px] cursor-pointer appearance-none border-transparent", "focus:ring-primary-focus focus:outline-none focus:ring-2")}
        style={{ background: `linear-gradient(90deg, #bae0ba ${value * 0.9 + 10}%, #eeeeee ${value * 0.9 + 10}%)` }}
      />
      <p className="pointer-events-none absolute left-1 top-1 select-none text-xs font-medium leading-none text-gray-600">{value}%</p>
    </div>
  );
};

export default DoneSlider;
