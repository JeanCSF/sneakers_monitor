import { Chart } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useEffect, useRef } from "react";
interface PriceData {
  date: string;
  price: number;
}

interface Props {
  data: PriceData[];
}
export const PriceChart: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (data && data.length && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: data.map((item) => item.date),
            datasets: [
              {
                label: "Preço",
                data: data.map((item) => item.price),
                borderColor: "#4F46E5",
                backgroundColor: "rgba(79, 70, 229, 0.1)",
              },
            ],
          },
          options: {
            maintainAspectRatio: true,
            responsive: true,
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                },
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [data]);

  return (
    <div className="w-full h-full">
      <Line
        data={{
          labels: data.map((item) => {
            const date = new Date(item.date);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month > 9 ? month : `0${month}`}/${year}`;
          }),
          datasets: [
            {
              label: "Preço",
              data: data.map((item) => item.price),
              borderColor: "#4F46E5",
              backgroundColor: "rgba(79, 70, 229, 0.1)",
            },
          ],
        }}
      />
    </div>
  );
};
