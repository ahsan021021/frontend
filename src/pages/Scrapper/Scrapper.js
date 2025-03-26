import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './Scrapper.css'; // Ensure this file exists in the same folder as Scrapper.js
import ScraperForm from './components/ScraperForm'; // Adjust the path if needed
import ResultsTable from './components/ResultsTable'; // Adjust the path if needed
import Header from './components/Header'; // Adjust the path if needed
import Sidebar from './../../components/Sidebar'; // Adjust the path if needed
import CSVHistory from './components/CSVHistory'; // Adjust the path if needed
import ExportManager from './components/ExportManager'; // Adjust the path if needed
import { FaBars } from 'react-icons/fa';

function Scraper() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [csvHistory, setCsvHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('scraper'); // 'scraper', 'history', or 'exports'

  // Load CSV history from the backend on component mount
  useEffect(() => {
    const fetchCSVHistory = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await axios.get('http://82.180.137.7:5000/api/history', {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });
        setCsvHistory(response.data);
      } catch (err) {
        console.error('Error fetching CSV history:', err);
      }
    };
    fetchCSVHistory();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle scraping data
  const handleScrape = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.post(
        'http://82.180.137.7:5000/api/scrape',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );
      setResults(response.data); // Set the resultss from the backend
    } catch (err) {
      setError('An error occurred while scraping. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export data to CSV
  const exportToCSV = async (customResults = results) => {
    if (customResults.length === 0) return;
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.post(
        'http://82.180.137.7:5000/api/export',
        { results: customResults },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );
      const { csvContent, fileName } = response.data;

      // Create a downloadable CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update CSV history
      const newHistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        fileName,
        keywords: [...new Set(customResults.map((item) => item.category))],
        locations: [...new Set(customResults.map((item) => item.location))],
        recordCount: customResults.length,
        data: csvContent,
      };
      setCsvHistory([newHistoryEntry, ...csvHistory]);
    } catch (err) {
      console.error('Error exporting to CSV:', err);
    }
  };

  // Download CSV from history
  const handleDownloadFromHistory = async (csv) => {
    const blob = new Blob([csv.data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', csv.fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete CSV from history
  const handleDeleteFromHistory = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      await axios.delete(`http://82.180.137.7:5000/api/scrapehistory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      setCsvHistory(csvHistory.filter((csv) => csv.id !== id));
    } catch (err) {
      console.error('Error deleting CSV history:', err);
    }
  };

  // View CSV from history
  const handleViewFromHistory = (csv) => {
    const lines = csv.data.split('\n');
    const headers = lines[0].split(',');
    const parsedResults = lines.slice(1).map((line) => {
      const values = line.split(',');
      const result = {};
      headers.forEach((header, index) => {
        result[header] = values[index];
        if (result[header] && result[header].startsWith('"') && result[header].endsWith('"')) {
          result[header] = result[header].substring(1, result[header].length - 1);
        }
      });
      return result;
    });
    setResults(parsedResults);
    setActiveTab('scraper'); // Switch to the scraper tab to show results
  };

  // Merge multiple CSV exports
  const handleMergeExports = (exportsToMerge) => {
    let allResults = [];
    exportsToMerge.forEach((csv) => {
      const lines = csv.data.split('\n');
      const headers = lines[0].split(',');
      const parsedResults = lines.slice(1).map((line) => {
        const values = line.split(',');
        const result = {};
        headers.forEach((header, index) => {
          result[header] = values[index];
          if (result[header] && result[header].startsWith('"') && result[header].endsWith('"')) {
            result[header] = result[header].substring(1, result[header].length - 1);
          }
        });
        return result;
      });
      allResults = [...allResults, ...parsedResults];
    });
    exportToCSV(allResults);
  };

  return (
    <div className="app-container">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="header-container">
          <Header />
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'scraper' ? 'active' : ''}`}
            onClick={() => setActiveTab('scraper')}
          >
            Scraper
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            CSV History {csvHistory.length > 0 && <span className="history-badge">{csvHistory.length}</span>}
          </button>
          <button
            className={`tab-button ${activeTab === 'exports' ? 'active' : ''}`}
            onClick={() => setActiveTab('exports')}
          >
            Export Manager
          </button>
        </div>

        {activeTab === 'scraper' && (
          <>
            <ScraperForm onSubmit={handleScrape} isLoading={isLoading} />
            <ResultsTable
              results={results}
              isLoading={isLoading}
              error={error}
              onExport={() => exportToCSV(results)}
            />
          </>
        )}

        {activeTab === 'history' && (
          <CSVHistory
            csvHistory={csvHistory}
            onDownload={handleDownloadFromHistory}
            onDelete={handleDeleteFromHistory}
            onView={handleViewFromHistory}
          />
        )}

        {activeTab === 'exports' && (
          <ExportManager
            csvHistory={csvHistory}
            onExport={handleDownloadFromHistory}
            onMerge={handleMergeExports}
          />
        )}

        <footer className="footer">
          <p>© 2025 Google Maps Scraper | All Rights Reserved</p>
        </footer>
      </main>
    </div>
  );
}

export default Scraper;