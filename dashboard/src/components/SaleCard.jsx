import Chart from "react-apexcharts";

const SalesCard = ({ orders }) => {
  const series = [100];

  const totalSales = orders.reduce((acc, order) => {
    if (order.status === "Delivered") {
      return acc + (order.amount || 0) + (order.shippingCharge || 0);
    }
    return acc;
  }, 0);

  const options = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },

    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100">
      <div className="px-5 pt-5 bg-white shadow rounded-2xl pb-10">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 ">Total Sale</h3>
            <p className="mt-1 text-gray-500 text-sm ">
              Your total sales amount
            </p>
          </div>
        </div>

        <div className="relative mt-6">
          <Chart
            options={options}
            series={series}
            type="radialBar"
            height={330}
          />

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
            +100%
          </span>
        </div>

        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="text-sm text-gray-500">
            Impressive progress — total sales so far.
          </p>

          <p className="text-2xl font-bold text-gray-800 mt-1">
            Rs. {totalSales.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesCard;
