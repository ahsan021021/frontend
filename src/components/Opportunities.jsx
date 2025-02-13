import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FunnelIcon,
  ListBulletIcon,
  Squares2X2Icon,
  ArrowDownTrayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { usePipelines } from '../context/PipelineContext';

function Opportunities() {
  const { pipelines } = usePipelines();
  const [viewType, setViewType] = useState('grid');
  const [selectedPipeline, setSelectedPipeline] = useState(pipelines[0]?.name || '');
  const [opportunities, setOpportunities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    description: '',
    value: 0,
    stage: '',
  });

  // Fetch opportunities for the selected pipeline
  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!selectedPipeline) return;

      try {
        const pipelineId = pipelines.find((p) => p.name === selectedPipeline)?._id;
        if (pipelineId) {
          const response = await axios.get(`http://localhost:5000/api/opportunities?pipelineId=${pipelineId}`);
          setOpportunities(response.data);
        }
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();
  }, [selectedPipeline, pipelines]);

  // Handle opening the "Add Opportunity" modal
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  // Handle closing the "Add Opportunity" modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewOpportunity({
      name: '',
      description: '',
      value: 0,
      stage: '',
    });
  };

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOpportunity({
      ...newOpportunity,
      [name]: value,
    });
  };

  // Handle adding a new opportunity
  const handleAddOpportunity = async () => {
    if (!newOpportunity.name.trim() || !newOpportunity.stage.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const pipelineId = pipelines.find((p) => p.name === selectedPipeline)?._id;
      const response = await axios.post('http://localhost:5000/api/opportunities', {
        ...newOpportunity,
        pipelineId,
      });
      setOpportunities([...opportunities, response.data]);
      handleCloseAddModal();
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
  };

  return (
    <div>
      <div className="header-controls">
        <div className="button-group">
          <select
            value={selectedPipeline}
            onChange={(e) => setSelectedPipeline(e.target.value)}
            className="pipeline-select"
          >
            {pipelines.map((pipeline) => (
              <option key={pipeline._id} value={pipeline.name}>
                {pipeline.name}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button
            className={`button button-secondary ${viewType === 'grid' ? 'active' : ''}`}
            onClick={() => setViewType('grid')}
          >
            <Squares2X2Icon className="icon" />
          </button>
          <button
            className={`button button-secondary ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => setViewType('list')}
          >
            <ListBulletIcon className="icon" />
          </button>
          <button className="button button-secondary">
            <ArrowDownTrayIcon className="icon" />
            <span>Import</span>
          </button>
          <button className="button button-primary" onClick={handleOpenAddModal}>
            <PlusIcon className="icon" />
            <span>Add opportunity</span>
          </button>
        </div>
      </div>

      <div className="button-group" style={{ marginBottom: '2rem' }}>
        <button className="button button-secondary">
          <FunnelIcon className="icon" />
          <span>Advanced Filters</span>
        </button>
        <button className="button button-secondary">
          <span>Sort (1)</span>
        </button>
      </div>

      <div className="stages-grid">
        {pipelines
          .find((p) => p.name === selectedPipeline)
          ?.stages.map((stage) => (
            <div key={stage._id} className="stage-card">
              <div className="stage-header">
                <div
                  className="stage-indicator"
                  style={{ backgroundColor: stage.color }}
                ></div>
                <h3 className="stage-title">{stage.name}</h3>
              </div>
              <div className="stage-stats">
                <div>
                  {opportunities.filter((opp) => opp.stage === stage.name).length} Opportunities
                </div>
                <div>
                  Rs
                  {opportunities
                    .filter((opp) => opp.stage === stage.name)
                    .reduce((sum, opp) => sum + opp.value, 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add Opportunity Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add New Opportunity</h3>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={newOpportunity.name}
                onChange={handleInputChange}
                placeholder="Enter opportunity name"
                className="modal-input"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={newOpportunity.description}
                onChange={handleInputChange}
                placeholder="Enter opportunity description"
                className="modal-input"
              />
            </div>

            <div className="form-group">
              <label>Value</label>
              <input
                type="number"
                name="value"
                value={newOpportunity.value}
                onChange={handleInputChange}
                placeholder="Enter opportunity value"
                className="modal-input"
              />
            </div>

            <div className="form-group">
              <label>Stage</label>
              <select
                name="stage"
                value={newOpportunity.stage}
                onChange={handleInputChange}
                className="modal-input"
              >
                <option value="">Select a stage</option>
                {pipelines
                  .find((p) => p.name === selectedPipeline)
                  ?.stages.map((stage) => (
                    <option key={stage._id} value={stage.name}>
                      {stage.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={handleCloseAddModal} className="button button-secondary">
                Cancel
              </button>
              <button onClick={handleAddOpportunity} className="button button-primary">
                Add Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Opportunities;