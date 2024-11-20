import React, { useState } from 'react';
import axios from 'axios';
import './VehicleForm.css'; // Make sure to add this CSS file to your project

function VehicleForm({ onVehicleAdded }) {
  const [formData, setFormData] = useState({
    model: '',
    registration_number: '',
    vehicle_type: 'car',
    purchase_date: '',
    image_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/vehicles', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onVehicleAdded();
      setFormData({
        model: '',
        registration_number: '',
        vehicle_type: 'car',
        purchase_date: '',
        image_url: ''
      });
    } catch (error) {
      alert('Error adding vehicle');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="vehicle-form">
      <h3 className="form-title">Add New Vehicle</h3>
      <div className="form-group">
        <label>Model:</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Registration Number:</label>
        <input
          type="text"
          name="registration_number"
          value={formData.registration_number}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Vehicle Type:</label>
        <select
          name="vehicle_type"
          value={formData.vehicle_type}
          onChange={handleChange}
          required
          className="form-control"
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>
      </div>
      <div className="form-group">
        <label>Purchase Date:</label>
        <input
          type="date"
          name="purchase_date"
          value={formData.purchase_date}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Image URL:</label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn-submit">Add Vehicle</button>
    </form>
  );
}

export default VehicleForm;
 