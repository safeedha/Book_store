import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesGraph = ({ data, options }) => {
  return (
    <div className="p-4 bg-white shadow-lg rounded-md">
      <Bar data={data} options={options} />
    </div>
  );
};

SalesGraph.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
};

export default SalesGraph;
