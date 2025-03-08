interface CounterProps {
  value: number | string;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const Counter: React.FC<CounterProps> = ({
  value,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex gap-2 items-center my-4">
      <button
        className="btn btn-primary text-xl font-bold aspect-square p-2"
        onClick={onDecrement}
      >
        -
      </button>
      <div className="aspect-square bg-gray-700 p-2 rounded-lg border border-gray-600">
        {value}
      </div>
      <button
        className="btn btn-primary text-xl font-bold aspect-square p-2"
        onClick={onIncrement}
      >
        +
      </button>
    </div>
  );
};

export default Counter;
