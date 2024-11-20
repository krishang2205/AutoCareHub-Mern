import React, { useState } from 'react';
import axios from 'axios';

function MaintenanceForm({ vehicleId, onMaintenanceAdded }) {
  const [formData, setFormData] = useState({
    maintenance_type: '',
    maintenance_date: '',
    cost: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/maintenance', 
        { ...formData, vehicle_id: vehicleId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      onMaintenanceAdded();
      setFormData({
        maintenance_type: '',
        maintenance_date: '',
        cost: ''
      });
    } catch (error) {
      alert('Error adding maintenance record');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="maintenance-form">
      <div className="form-group">
        <label>Maintenance Type:</label>
        <input
          type="MaintenanceType"
          name="maintenance_type"
          value={formData.maintenance_type}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          name="maintenance_date"
          value={formData.maintenance_date}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Cost:</label>
        <input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <button type="submit" className="btn-submit">Add Maintenance Record</button>
    </form>
  );
}

export default MaintenanceForm;
