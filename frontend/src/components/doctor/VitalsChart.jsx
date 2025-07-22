import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BASE_URL || 'http://localhost:5000');

const VitalsChart = () => {
  const [vitalsData, setVitalsData] = useState([]);

  useEffect(() => {
    // Listen for real-time updates from the server
    socket.on('new_vitals', (newVitals) => {
      setVitalsData(prevData => {
        const timestamp = new Date().toLocaleTimeString();
        const updatedData = [...prevData, { ...newVitals, time: timestamp }];
        // Keep the chart to a manageable size (last 20 data points)
        return updatedData.length > 20 ? updatedData.slice(updatedData.length - 20) : updatedData;
      });
    });

    // Simulate IoT device data for demonstration
    const simulator = setInterval(() => {
      const newVitals = {
        'Heart Rate': 70 + Math.floor(Math.random() * 20) - 10,
        'Blood Pressure': 120 + Math.floor(Math.random() * 10) - 5,
        'SPO2': 97 + Math.floor(Math.random() * 3),
      };
      // Emit the simulated data to the server
      socket.emit('vitals_update', newVitals);
    }, 5000); // every 5 seconds

    return () => {
      socket.off('new_vitals');
      clearInterval(simulator);
    };
  }, []);

  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={vitalsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
          <XAxis dataKey="time" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: 'rgba(100, 116, 139, 0.5)',
              borderRadius: '0.5rem'
            }}
            labelStyle={{ color: '#f1f5f9' }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend />
          <Line type="monotone" dataKey="Heart Rate" stroke="#3b82f6" dot={false} strokeWidth={2}/>
          <Line type="monotone" dataKey="Blood Pressure" stroke="#22c55e" dot={false} strokeWidth={2}/>
          <Line type="monotone" dataKey="SPO2" stroke="#f97316" dot={false} strokeWidth={2}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsChart;