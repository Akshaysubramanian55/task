import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, startOfHour, endOfHour, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    TimeScale
);

const getRandomValue = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

function Dashboard() {
    const [data, setData] = useState([]);
    const [selectedTab, setSelectedTab] = useState('daily');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem('token');
    const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    useEffect(() => {
        if (data.length) {
            updateChartData(data);
        }
    }, [data, selectedTab]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3100/api/getdata', {
                params: { userId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                setData(response.data);
            } else {
                console.error('No data received');
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const aggregateData = (data, unit) => {
        const result = {};
        data.forEach(item => {
            const date = new Date(item.date);
            let key;
            switch (unit) {
                case 'hour':
                    key = format(startOfHour(date), 'yyyy-MM-dd HH:00:00');
                    break;
                case 'day':
                    key = format(startOfDay(date), 'yyyy-MM-dd');
                    break;
                case 'week':
                    key = format(startOfWeek(date), 'yyyy-ww');
                    break;
                case 'month':
                    key = format(startOfMonth(date), 'yyyy-MM');
                    break;
                case 'year':
                    key = format(startOfYear(date), 'yyyy');
                    break;
                default:
                    return;
            }

            if (!result[key]) {
                result[key] = {
                    count: 0,
                    pH: 0,
                    TSS: 0,
                    TDS: 0,
                    BOD: 0,
                    COD: 0,
                    chloride: 0,
                };
            }

            result[key].count += 1;
            result[key].pH += item.pH;
            result[key].TSS += item.TSS;
            result[key].TDS += item.TDS;
            result[key].BOD += item.BOD;
            result[key].COD += item.COD;
            result[key].chloride += item.chloride;
        });

        Object.keys(result).forEach(key => {
            result[key].pH /= result[key].count;
            result[key].TSS /= result[key].count;
            result[key].TDS /= result[key].count;
            result[key].BOD /= result[key].count;
            result[key].COD /= result[key].count;
            result[key].chloride /= result[key].count;
        });

        return result;
    };

    const updateChartData = (data) => {
        const unit = selectedTab === 'daily' ? 'hour' :
            selectedTab === 'weekly' ? 'day' :
                selectedTab === 'monthly' ? 'month' : 'year';

        const aggregatedData = aggregateData(data, unit);

        const labels = Object.keys(aggregatedData);
        const pHData = labels.map(label => aggregatedData[label].pH);
        const TSSData = labels.map(label => aggregatedData[label].TSS);
        const TDSData = labels.map(label => aggregatedData[label].TDS);
        const BODData = labels.map(label => aggregatedData[label].BOD);
        const CODData = labels.map(label => aggregatedData[label].COD);
        const chlorideData = labels.map(label => aggregatedData[label].chloride);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'pH',
                    data: pHData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                },
                {
                    label: 'TSS',
                    data: TSSData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                },
                {
                    label: 'TDS',
                    data: TDSData,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    fill: false,
                },
                {
                    label: 'BOD',
                    data: BODData,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: false,
                },
                {
                    label: 'COD',
                    data: CODData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                },
                {
                    label: 'Chloride',
                    data: chlorideData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                }
            ],
        });
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            console.error('No token found');
            return;
        }

        const randomData = {
            userId,
            date: new Date().toISOString(),
            pH: getRandomValue(6.0, 8.0),
            TSS: getRandomValue(0, 500),
            TDS: getRandomValue(0, 1000),
            BOD: getRandomValue(0, 200),
            COD: getRandomValue(0, 500),
            chloride: getRandomValue(0, 300),
        };

        try {
            setSubmitting(true);
            await axios.post('http://localhost:3100/api/data', randomData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Data submitted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error submitting data', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getTabContent = () => {
        return (
            <div className="bg-white shadow-lg rounded-lg p-4">
                <Line
                    data={chartData}
                    options={{
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: selectedTab === 'daily' ? 'hour' :
                                        selectedTab === 'weekly' ? 'day' :
                                            selectedTab === 'monthly' ? 'month' : 'year',
                                },
                                title: {
                                    display: true,
                                    text: 'Date',
                                },
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Value',
                                },
                            },
                        },
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
                                    },
                                },
                            },
                        },
                    }}
                />
            </div>
        );
    };

    const getCurrentValues = () => {
        const latestData = data.length > 0 ? data[data.length - 1] : {};
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {['pH', 'TSS', 'TDS', 'BOD', 'COD', 'chloride'].map((label, index) => (
                    <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700">{label}</h4>
                        <p className="text-gray-600">{latestData[label] !== undefined ? latestData[label] : 'N/A'}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Environmental Data Dashboard</h2>

                <div className="mb-6 flex justify-between">
                    <button onClick={() => handleTabChange('daily')} className={`px-6 py-2 rounded ${selectedTab === 'daily' ? 'bg-blue-700' : 'bg-blue-500'} text-white hover:bg-blue-800 transition`}>
                        Daily
                    </button>
                    <button onClick={() => handleTabChange('weekly')} className={`px-6 py-2 rounded ${selectedTab === 'weekly' ? 'bg-blue-700' : 'bg-blue-500'} text-white hover:bg-blue-800 transition`}>
                        Weekly
                    </button>
                    <button onClick={() => handleTabChange('monthly')} className={`px-6 py-2 rounded ${selectedTab === 'monthly' ? 'bg-blue-700' : 'bg-blue-500'} text-white hover:bg-blue-800 transition`}>
                        Monthly
                    </button>
                    <button onClick={() => handleTabChange('yearly')} className={`px-6 py-2 rounded ${selectedTab === 'yearly' ? 'bg-blue-700' : 'bg-blue-500'} text-white hover:bg-blue-800 transition`}>
                        Yearly
                    </button>
                </div>

                <div className="mb-6 bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Current Values</h3>
                    {getCurrentValues()}
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Submit Random Data</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 ${submitting ? 'bg-gray-500' : 'bg-blue-600'} text-white rounded-lg hover:bg-blue-700 transition`}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Random Data'}
                        </button>
                    </form>
                </div>

                {getTabContent()}
            </div>
        </div>
    );
}

export default Dashboard;
