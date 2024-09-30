
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

interface BarGraphprops {
	categoryTotals: { [key: string ]: number };
}

export default function BarGraph({ categoryTotals }: BarGraphprops) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {

			const labels = Object.keys(categoryTotals);
			const data = Object.values(categoryTotals);

        const BarGraphData = {
            labels: labels,
            datasets: [
                {
                    label: 'Sales',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                      ],
                      borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                      ],
                      borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(BarGraphData);
        setChartOptions(options);
    }, [categoryTotals]);

    return (
        <div className="card">
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    )
}
        