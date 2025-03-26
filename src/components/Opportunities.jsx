import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Squares2X2Icon,
  PlusIcon,
} from '@heroicons/react/24/outline';

function Opportunities() {
  const [pipelines, setPipelines] = useState([]); // Fetch pipelines from API
  const [selectedPipeline, setSelectedPipeline] = useState('');
  const [opportunities, setOpportunities] = useState({}); // Pre-fetched opportunities for all stages
  const [selectedStage, setSelectedStage] = useState(null); // Selected stage
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    description: '',
    value: 0,
    stage: '',
  });

  // Fetch pipelines from the backend
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get('http://localhost:5000/api/pipelines', { headers });
        setPipelines(response.data);
        if (response.data.length > 0) {
          setSelectedPipeline(response.data[0].name); // Set the first pipeline as selected by default
        }
      } catch (error) {
        console.error('Error fetching pipelines:', error);
      }
    };

    fetchPipelines();
  }, []);

  // Pre-fetch opportunities for all stages when a pipeline is selected
  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!selectedPipeline) return;

      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const headers = { Authorization: `Bearer ${token}` };

        const pipeline = pipelines.find((p) => p.name === selectedPipeline);
        if (!pipeline) return;

        const opportunitiesByStage = {};

        // Fetch opportunities for each stage in the selected pipeline
        await Promise.all(
          pipeline.stages.map(async (stage) => {
            const response = await axios.get(
              `http://localhost:5000/api/opportunities/${pipeline._id}/${stage._id}/opportunities`,
              { headers }
            );
            opportunitiesByStage[stage._id] = response.data;
          })
        );

        setOpportunities(opportunitiesByStage); // Store all opportunities in state
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
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const headers = { Authorization: `Bearer ${token}` };

      // Find the pipelineId and stageId based on the selected pipeline and stage
      const pipeline = pipelines.find((p) => p.name === selectedPipeline);
      if (!pipeline) {
        alert('Pipeline not found.');
        return;
      }

      const stage = pipeline.stages.find((s) => s.name === newOpportunity.stage);
      if (!stage) {
        alert('Stage not found in the selected pipeline.');
        return;
      }

      const pipelineId = pipeline._id;
      const stageId = stage._id;

      // Make the POST request to create the opportunity
      const response = await axios.post(
        `http://localhost:5000/api/opportunities/${pipelineId}/${stageId}/opportunities`, // Correct endpoint
        {
          title: newOpportunity.name, // Opportunity title
          description: newOpportunity.description || '', // Optional description
          value: newOpportunity.value || 0, // Opportunity value
          status: 'Open', // Default status
        },
        { headers }
      );

      // Update the opportunities list for the specific stage
      setOpportunities((prev) => ({
        ...prev,
        [stageId]: [...(prev[stageId] || []), response.data],
      }));
      handleCloseAddModal(); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert('Failed to create opportunity. Please try again.');
    }
  };

  // Handle selecting a stage
  const handleStageClick = (stageId) => {
    setSelectedStage(stageId === selectedStage ? null : stageId); // Toggle stage selection
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
          <button className="button button-secondary">
            <Squares2X2Icon className="icon" />
          </button>
          <button className="button button-primary" onClick={handleOpenAddModal}>
            <PlusIcon className="icon" />
            <span>Add opportunity</span>
          </button>
        </div>
      </div>

      <div className="stages-grid">
        {pipelines
          .find((p) => p.name === selectedPipeline)
          ?.stages.map((stage) => (
            <div
              key={stage._id}
              className={`stage-card ${selectedStage === stage._id ? 'selected-stage' : ''}`} // Highlight selected stage
              onClick={() => handleStageClick(stage._id)}
            >
              <div className="stage-header">
                <div
                  className="stage-indicator"
                  style={{ backgroundColor: stage.color }}
                ></div>
                <h3 className="stage-title">{stage.name}</h3>
              </div>
              <div className="stage-stats">
                <div>
                  {opportunities[stage._id]?.length || 0} Opportunities
                </div>
                <div>
                  Rs
                  {opportunities[stage._id]
                    ?.reduce((sum, opp) => sum + (opp.value || 0), 0)
                    .toLocaleString() || 0}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Show opportunities in a styled box */}
      {selectedStage && (
        <div className="stages-grid">
          {opportunities[selectedStage]?.map((opportunity) => (
            <div key={opportunity._id} className="stage-card">
              <div className="stage-header">
                <h4 className="stage-title">{opportunity.title}</h4>
              </div>
              <div className="stage-stats">
                <p>{opportunity.description}</p>
                <p>Value: Rs {(opportunity.value || 0).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

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