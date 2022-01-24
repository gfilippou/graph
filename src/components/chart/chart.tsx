import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from 'src/components/chart/chart.module.css';

export const Chart = ({ data }: any) => {
  return (
    <div className={styles.chart}>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis>
            <Label
              position={{ x: 110, y: 20 }}
              style={{ textAnchor: 'middle' }}
            >
              Value (ETH)
            </Label>
          </YAxis>
          <Legend />
          <Tooltip />
          <Area
            type='monotone'
            dataKey={'TVL'}
            stroke='#8884d8'
            fill='#8884d8'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
