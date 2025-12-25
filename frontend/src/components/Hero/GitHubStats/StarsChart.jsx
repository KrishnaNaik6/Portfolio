import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Filler,
  RadialLinearScale
);

const StarsChart = ({ repos }) => {
  const chartData = {
    labels: repos.map(r => r.name.length > 12 ? r.name.substring(0, 12) + '..' : r.name),
    datasets: [{
      data: repos.map(r => r.stargazers_count || 0),
      backgroundColor: 'rgba(34, 211, 238, 0.4)',
      borderColor: '#22d3ee',
      borderWidth: 1,
      borderRadius: 12,
      hoverBackgroundColor: '#22d3ee',
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } } }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="h-[250px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StarsChart;