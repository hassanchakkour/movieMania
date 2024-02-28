// import Chart  from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import React, { useEffect, useState } from 'react';

let chartDataSkeleton = {
    graphType: '',
    graphTitle: '',
    graphData: '',
    graphLabels: ''
}

const CustomChart = (props) => {
    const { graphType, graphTitle, graphData, graphLabels } = props



    useEffect(() => {


        const ctx = document.getElementById('myChart').getContext('2d');


        const myChart = new Chart(ctx, {
            type: graphType,
            data: {
                labels: graphLabels,
                datasets: [{
                    label: '',
                    data: graphData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        beginAtZero: true
                    }
                },
            },
            hoverOffset:20,
            offset: [20,0,0,0,0,0,0,0,0,0]  

        });

        return () => {
            myChart.destroy()
        }

    }, [graphType, graphData])



return (
    <div className=''>
        <canvas id="myChart" width="500" height="500"></canvas>

    </div>

    // <Chart type = {graphType} data={{                                          
    //     labels: graphLabels,
    //     datasets: [
    //         {
    //           label: graphTitle,
    //           data: graphData,
    //           backgroundColor: [
    //             'rgba(255, 99, 132, 1)',
    //             'rgba(54, 162, 235, 1)',
    //             'rgba(255, 206, 86, 1)',
    //             'rgba(75, 192, 192, 1)',
    //             'rgba(153, 102, 255, 1)',
    //             'rgba(255, 159, 64, 1)',
    //             'rgba(255, 109, 64, 1)',
    //             'rgba(125, 169, 34, 1)',
    //             'rgba(225, 99, 251, 1)',
    //             'rgba(225, 99, 101, 1)',

    //           ],
    //           borderColor: [
    //             'rgba(255, 99, 132, 1)',
    //             'rgba(54, 162, 235, 1)',
    //             'rgba(255, 206, 86, 1)',
    //             'rgba(75, 192, 192, 1)',
    //             'rgba(153, 102, 255, 1)',
    //             'rgba(255, 159, 64, 1)',
    //             'rgba(255, 109, 64, 0.6)',
    //             'rgba(125, 169, 34, 0.8)',
    //             'rgba(225, 99, 251, 0.3)',
    //             'rgba(225, 99, 101, 0.4)',                        
    //           ],
            //   borderWidth: 1,
            //   hoverOffset:20,
            //   offset: [20,0,0,0,0,0,0,0,0,0]                     
    //         },
    //       ],

    // }} />
)
}



export default CustomChart