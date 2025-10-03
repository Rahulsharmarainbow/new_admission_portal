import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  labels: string[];
  values: number[];
  title: string;
  subtitle: string;
}

const BarChart: React.FC<ChartProps> = ({ labels, values, title, subtitle }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: values,
        backgroundColor: "#3B82F6", // Tailwind blue-500
        borderRadius: 6,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: "#374151",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          font: {
            size: 12,
          },
          color: "#374151",
        },
        grid: {
          color: "#E5E7EB",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h5 className="text-lg font-semibold text-gray-900">{title}</h5>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;