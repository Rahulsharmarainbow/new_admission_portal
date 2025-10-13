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
  // Generate dynamic colors based on values
  const getBarColor = (value: number, index: number) => {
    const colors = [
      '#136EFF',
      '#136EFF',
    ];
    return colors[index % colors.length];
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: values,
        backgroundColor: labels.map((_, index) => getBarColor(values[index], index)),
        borderRadius: 6,
        borderWidth: 0,
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
        callbacks: {
          label: function(context: any) {
            return `Applications: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 11,
          },
          color: "#374151",
          maxRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: Math.ceil(Math.max(...values) / 5) || 1,
          font: {
            size: 11,
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
        <div className="text-sm text-gray-500">
          Total: {values.reduce((sum, value) => sum + value, 0)}
        </div>
      </div>
      <div className="h-80">
        {values.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChart;