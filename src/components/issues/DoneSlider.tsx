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
        className="transparent h-5 appearance-none border-transparent w-[80px]"
        style={{ background: `linear-gradient(90deg, #bae0ba ${value * 0.9 + 10}%, #eeeeee ${value * 0.9 + 10}%)` }}
      />
      <p className="absolute top-1 left-1 text-xs font-medium text-gray-600 leading-none select-none pointer-events-none">{value}%</p>
    </div>
  );
};

export default DoneSlider;
