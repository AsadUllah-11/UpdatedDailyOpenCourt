import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, AlertTriangle, MapPin } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2>Analytics Dashboard</h2>
        <p>Crime analysis and insights</p>
      </div>

      {/* Key Insights */}
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon" style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}>
            <TrendingUp size={32} />
          </div>
          <div className="insight-content">
            <h3>Top Category</h3>
            <p className="insight-value">
              {stats?.category_stats?.[0]?.category || 'N/A'}
            </p>
            <p className="insight-subtitle">
              {stats?.category_stats?.[0]?.count || 0} cases
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <AlertTriangle size={32} />
          </div>
          <div className="insight-content">
            <h3>High Crime Area</h3>
            <p className="insight-value">
              {stats?.police_station_stats?.[0]?.police_station || 'N/A'}
            </p>
            <p className="insight-subtitle">
              {stats?.police_station_stats?.[0]?.count || 0} complaints
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
            <MapPin size={32} />
          </div>
          <div className="insight-content">
            <h3>Total Divisions</h3>
            <p className="insight-value">
              {stats?.division_stats?. length || 0}
            </p>
            <p className="insight-subtitle">
              Active divisions
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-charts">
        {/* Crime Categories Bar Chart */}
        <div className="chart-card full-width">
          <h3>Crime Category Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats?.category_stats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={150} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Number of Cases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Police Station Comparison */}
        <div className="chart-card full-width">
          <h3>Police Station Wise Complaints</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats?.police_station_stats?. slice(0, 10) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="police_station" angle={-45} textAnchor="end" height={150} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" stackId="a" />
              <Bar dataKey="heard" fill="#10b981" name="Heard" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Division Distribution Pie */}
        <div className="chart-card">
          <h3>Division Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={stats?.division_stats || []}
                dataKey="count"
                nameKey="division"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.division}:  ${entry.count}`}
              >
                {stats?.division_stats?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution Pie */}
        <div className="chart-card">
          <h3>Application Status</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Pending', value: stats?.overall_stats?.pending || 0 },
                  { name: 'Heard', value: stats?. overall_stats?.heard || 0 },
                  { name: 'Referred', value: stats?.overall_stats?.referred || 0 },
                  { name: 'Closed', value: stats?.overall_stats?.closed || 0 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {['#f59e0b', '#10b981', '#8b5cf6', '#6b7280'].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="data-table-card">
        <h3>Police Station Details</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Police Station</th>
                <th>Total Cases</th>
                <th>Pending</th>
                <th>Heard</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {stats?. police_station_stats?.map((ps, idx) => (
                <tr key={idx}>
                  <td>{ps.police_station}</td>
                  <td>{ps.count}</td>
                  <td><span className="badge badge-warning">{ps.pending}</span></td>
                  <td><span className="badge badge-success">{ps.heard}</span></td>
                  <td>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${(ps.heard / ps.count * 100).toFixed(0)}%`,
                          backgroundColor: '#10b981'
                        }}
                      >
                        {(ps.heard / ps.count * 100).toFixed(0)}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;