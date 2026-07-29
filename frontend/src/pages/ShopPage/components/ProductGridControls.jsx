import { Grip, LayoutGrid } from "lucide-react";

const Grid5Icon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {[0, 1, 2].map((row) =>
      [0, 1, 2, 3, 4].map((col) => (
        <rect
          key={`${row}-${col}`}
          x={1 + col * 3.8}
          y={2 + row * 5.5}
          width="2.5"
          height="3.5"
          rx="0.8"
          fill="currentColor"
        />
      )),
    )}
  </svg>
);

const Grid4Icon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {[0, 1, 2].map((row) =>
      [0, 1, 2, 3].map((col) => (
        <rect
          key={`${row}-${col}`}
          x={2 + col * 4.5}
          y={2 + row * 5.5}
          width="3"
          height="3.5"
          rx="0.8"
          fill="currentColor"
        />
      )),
    )}
  </svg>
);

const ProductGridControls = ({ gridColumns, setGridColumns }) => {
  return (
    <>
      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={() => setGridColumns(2)}
          className={`select-none ${gridColumns === 2 ? "opacity-70" : "opacity-20"}`}
          title="2 products per row"
        >
          <LayoutGrid size={20} />
        </button>

        <button
          onClick={() => setGridColumns(3)}
          className={`select-none ${gridColumns === 3 ? "opacity-70" : "opacity-20"}`}
          title="3 products per row"
        >
          <Grip size={20} />
        </button>

        <button
          onClick={() => setGridColumns(4)}
          className={`select-none ${gridColumns === 4 ? "opacity-70" : "opacity-20"}`}
          title="4 products per row"
        >
          <Grid4Icon />
        </button>

        <button
          onClick={() => setGridColumns(5)}
          className={`select-none ${gridColumns === 5 ? "opacity-70" : "opacity-20"}`}
          title="5 products per row"
        >
          <Grid5Icon />
        </button>
      </div>
    </>
  );
};

export default ProductGridControls;
