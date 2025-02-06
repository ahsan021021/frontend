import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

function Pipelines() {
  const [pipelines, setPipelines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newPipeline, setNewPipeline] = useState({
    name: '',
    stages: [{ id: Date.now(), name: '', color: '#6366f1' }],
    visibleInFunnel: true,
    visibleInPie: true,
  });

  // Fetch pipelines from the backend
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pipelines');
        setPipelines(response.data);
      } catch (error) {
        console.error('Error fetching pipelines:', error);
      }
    };

    fetchPipelines();
  }, []);

  // Add a new stage to the pipeline
  const handleAddStage = () => {
    setNewPipeline({
      ...newPipeline,
      stages: [...newPipeline.stages, { id: Date.now(), name: '', color: '#6366f1' }],
    });
  };

  // Remove a stage from the pipeline
  const handleRemoveStage = (stageId) => {
    setNewPipeline({
      ...newPipeline,
      stages: newPipeline.stages.filter((stage) => stage.id !== stageId),
    });
  };

  // Update a stage's name or color
  const handleStageChange = (stageId, field, value) => {
    setNewPipeline({
      ...newPipeline,
      stages: newPipeline.stages.map((stage) =>
        stage.id === stageId ? { ...stage, [field]: value } : stage
      ),
    });
  };

  // Create a new pipeline
  const handleAddPipeline = async () => {
    if (newPipeline.name.trim() && newPipeline.stages.every((stage) => stage.name.trim())) {
      try {
        // Format the stages data correctly
        const formattedStages = newPipeline.stages.map((stage) => ({
          name: stage.name.trim(),
          color: stage.color,
        }));

        // Prepare the payload
        const payload = {
          name: newPipeline.name.trim(),
          stages: formattedStages, // Ensure stages is an array of objects
          visibleInFunnel: newPipeline.visibleInFunnel,
          visibleInPie: newPipeline.visibleInPie,
        };

        // Log the payload for debugging
        console.log('Payload:', payload);

        // Send the POST request to create a new pipeline
        const response = await axios.post('http://localhost:5000/api/pipelines', payload);

        // Update the pipelines state with the new pipeline
        setPipelines([...pipelines, response.data]);

        // Reset the form and close the modal
        setNewPipeline({
          name: '',
          stages: [{ id: Date.now(), name: '', color: '#6366f1' }],
          visibleInFunnel: true,
          visibleInPie: true,
        });
        setShowAddModal(false);
      } catch (error) {
        console.error('Error creating pipeline:', error);
      }
    }
  };

  // Edit a pipeline's name
  const handleEditPipeline = async (_id, newName) => {
    if (!_id) {
      console.error('Pipeline ID is missing');
      return;
    }

    try {
      const updatedPipeline = { ...pipelines.find((p) => p._id === _id), name: newName };
      await axios.put(`http://localhost:5000/api/pipelines/${_id}`, updatedPipeline);
      setPipelines(pipelines.map((pipeline) => (pipeline._id === _id ? updatedPipeline : pipeline)));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating pipeline:', error);
    }
  };

  // Delete a pipeline
  const handleDeletePipeline = async (_id) => {
    if (!_id) {
      console.error('Pipeline ID is missing');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/pipelines/${_id}`);
      setPipelines(pipelines.filter((pipeline) => pipeline._id !== _id));
    } catch (error) {
      console.error('Error deleting pipeline:', error);
    }
  };

  return (
    <div>
      <div className="header-controls">
        <h2 className="nav-title">Pipelines</h2>
        <button onClick={() => setShowAddModal(true)} className="button button-primary">
          <PlusIcon className="icon" />
          <span>Create new pipeline</span>
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Stages</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pipelines.map((pipeline) => (
              <tr key={pipeline._id}>
                <td>
                  {editingId === pipeline._id ? (
                    <input
                      type="text"
                      value={pipeline.name}
                      onChange={(e) =>
                        setPipelines(
                          pipelines.map((p) =>
                            p._id === pipeline._id ? { ...p, name: e.target.value } : p
                          )
                        )
                      }
                      onBlur={() => handleEditPipeline(pipeline._id, pipeline.name)}
                      className="modal-input"
                      style={{ margin: 0 }}
                      autoFocus
                    />
                  ) : (
                    pipeline.name
                  )}
                </td>
                <td>
                  <div className="stage-pills">
                    {pipeline.stages.map((stage) => (
                      <span
                        key={stage._id}
                        className="stage-pill"
                        style={{ backgroundColor: stage.color }}
                      >
                        {stage.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => setEditingId(pipeline._id)}
                    className="button button-secondary"
                    style={{ marginRight: '0.5rem' }}
                  >
                    <PencilIcon className="icon" />
                  </button>
                  <button
                    onClick={() => handleDeletePipeline(pipeline._id)}
                    className="button button-secondary"
                  >
                    <TrashIcon className="icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Create New Pipeline</h3>
            </div>

            <div className="form-group">
              <label>Pipeline Name</label>
              <input
                type="text"
                value={newPipeline.name}
                onChange={(e) => setNewPipeline({ ...newPipeline, name: e.target.value })}
                placeholder="Enter pipeline name"
                className="modal-input"
              />
            </div>

            <div className="form-group">
              <label>Stages</label>
              {newPipeline.stages.map((stage) => (
                <div key={stage.id} className="stage-row">
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => handleStageChange(stage.id, 'name', e.target.value)}
                    placeholder="Stage name"
                    className="modal-input"
                  />
                  <input
                    type="color"
                    value={stage.color}
                    onChange={(e) => handleStageChange(stage.id, 'color', e.target.value)}
                    className="color-picker"
                  />
                  {newPipeline.stages.length > 1 && (
                    <button
                      onClick={() => handleRemoveStage(stage.id)}
                      className="button button-secondary"
                    >
                      <TrashIcon className="icon" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={handleAddStage} className="button button-secondary add-stage-btn">
                <PlusIcon className="icon" />
                Add stage
              </button>
            </div>

            <div className="visibility-options">
              <div className="visibility-option">
                <label>
                  <input
                    type="checkbox"
                    checked={newPipeline.visibleInFunnel}
                    onChange={(e) =>
                      setNewPipeline({ ...newPipeline, visibleInFunnel: e.target.checked })
                    }
                  />
                  Visible in Funnel chart
                </label>
              </div>
              <div className="visibility-option">
                <label>
                  <input
                    type="checkbox"
                    checked={newPipeline.visibleInPie}
                    onChange={(e) =>
                      setNewPipeline({ ...newPipeline, visibleInPie: e.target.checked })
                    }
                  />
                  Visible in Pie chart
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewPipeline({
                    name: '',
                    stages: [{ id: Date.now(), name: '', color: '#6366f1' }],
                    visibleInFunnel: true,
                    visibleInPie: true,
                  });
                }}
                className="button button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPipeline}
                className="button button-primary"
                disabled={
                  !newPipeline.name.trim() || !newPipeline.stages.every((stage) => stage.name.trim())
                }
              >
                Create Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pipelines;