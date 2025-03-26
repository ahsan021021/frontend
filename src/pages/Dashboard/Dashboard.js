import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar"; // Import the Sidebar component
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./LeadSavvyDashboard.css"; // Import the CSS file for styling

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [emails, setEmails] = useState({ total: 0, daily: [] });
  const [scrapingUsage, setScrapingUsage] = useState({ used: 0, limit: 0 });
  const [contacts, setContacts] = useState({ total: 0, daily: [] });
  const [pipelines, setPipelines] = useState({ total: 0, active: 0, completed: 0 });
  const [payments, setPayments] = useState({ total: 0, history: [] }); // Define payments state
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch email scraped history
        const emailsResponse = await axios.get("http://82.180.137.7:5000/api/history/emails", { headers });
        const totalEmails = emailsResponse.data.reduce((sum, entry) => sum + entry.count, 0);
        setEmails({
          total: totalEmails,
          daily: emailsResponse.data,
        });

        // Fetch contact added history
        const contactsResponse = await axios.get("http://82.180.137.7:5000/api/history/contacts", { headers });
        const totalContacts = contactsResponse.data.reduce((sum, entry) => sum + entry.count, 0);
        setContacts({
          total: totalContacts,
          daily: contactsResponse.data,
        });

        // Fetch scraping usage
        const scrapingResponse = await axios.get("http://82.180.137.7:5000/api/dashboard/scraping-usage", { headers });
        setScrapingUsage(scrapingResponse.data);

        // Fetch pipelines
        const pipelinesResponse = await axios.get("http://82.180.137.7:5000/api/pipelines", { headers });
        setPipelines({
          total: pipelinesResponse.data.length, // Count the total number of pipelines
          active: pipelinesResponse.data.filter((pipeline) => pipeline.status === "active").length,
          completed: pipelinesResponse.data.filter((pipeline) => pipeline.status === "completed").length,
        });

        // Fetch payments
        const paymentsResponse = await axios.get("http://82.180.137.7:5000/api/dashboard/payments", { headers });
        setPayments(paymentsResponse.data); // Set payments data

        // Fetch meetings
        const meetingsResponse = await axios.get("http://82.180.137.7:5000/api/meeting", { headers });
        setMeetings(meetingsResponse.data);

        // Fetch tasks
        const tasksResponse = await axios.get("http://82.180.137.7:5000/api/tasks", { headers }); // Fetch To-Do Tasks
        setTasks(tasksResponse.data);

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false); // Even if there's an error, stop loading
      }
    };

    fetchData();
  }, []);

  // Chart Data for Emails Scraped
  const emailsChartData = {
    labels: emails.daily?.map((entry) => new Date(entry.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: "Emails Scraped",
        data: emails.daily?.map((entry) => entry.count) || [],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 3,
        tension: 0.4, // Smooth curves
        pointRadius: 6,
        pointHoverRadius: 8,
        hoverBorderColor: "#ffffff",
      },
    ],
  };

  // Chart Data for Contacts Added
  const contactsChartData = {
    labels: contacts.daily?.map((entry) => new Date(entry.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: "Contacts Added",
        data: contacts.daily?.map((entry) => entry.count) || [],
        borderColor: "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        borderWidth: 3,
        tension: 0.4, // Smooth curves
        pointRadius: 6,
        pointHoverRadius: 8,
        hoverBorderColor: "#ffffff",
      },
    ],
  };

  // Chart Data for Payments
  const paymentsChartData = {
    labels: payments.history?.map((entry) => new Date(entry.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: "Payments",
        data: payments.history?.map((entry) => entry.amount) || [],
        backgroundColor: "rgba(255, 152, 0, 0.8)",
        borderColor: "#ff9800",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255, 152, 0, 1)",
        borderRadius: 10,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#ffffff", // White text for legend
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#444",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff", // White text for x-axis
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light grid lines
        },
      },
      y: {
        ticks: {
          color: "#ffffff", // White text for y-axis
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light grid lines
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };

  if (loading) {
    return <div className="loading">Loading...</div>; // Show a loading spinner or message while data is being fetched
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Metrics Section */}
        <div className="metrics">
          <div className="card">Total Emails Scraped: {emails.total || 0}</div>
          <div className="card">
            Scraping Usage: {scrapingUsage.used}/{scrapingUsage.limit}
          </div>
          <div className="card">Total Contacts: {contacts.total} contacts exist</div>
          <div className="card">Total Pipelines: {pipelines.total} pipelines exist</div>
          <div className="card">Upcoming Meetings: {meetings.length}</div>
        </div>

        {/* Charts Section */}
        <div className="charts">
          <div className="chart-box">
            <h3>Emails Scraped</h3>
            <Line data={emailsChartData} options={chartOptions} />
          </div>
          <div className="chart-box">
            <h3>Contacts Added</h3>
            <Line data={contactsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Meetings Section */}
        <div className="tables">
          <h3>Upcoming Meetings</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting, index) => (
                <tr key={index}>
                  <td>{meeting.title}</td>
                  <td>{meeting.date}</td>
                  <td>{meeting.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tables">
          <h3>To-Do Tasks</h3>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;