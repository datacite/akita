import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  { repository: 'A', count: 28 },
  { repository: 'B', count: 55 },
  { repository: 'C', count: 43 },
  { repository: 'D', count: 91 },
  { repository: 'E', count: 81 },
  { repository: 'F', count: 53 },
  { repository: 'G', count: 19 },
  { repository: 'H', count: 87 },
  { repository: 'I', count: 52 },
];

class SimpleBarChart extends PureComponent {

  render() {
    return (
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <XAxis dataKey="repository" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#7bdcc0" />
      </BarChart>
    );
  }
}

export default SimpleBarChart;

