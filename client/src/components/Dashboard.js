import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleForm from './VehicleForm';
import MaintenanceForm from './MaintenanceForm';
import './Dashboard.css';

function Dashboard({ onLogout }) {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState({});
  const [showForm, setShowForm] = useState({});
  const [showRecords, setShowRecords] = useState({});

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVehicles(response.data);
      response.data.forEach(vehicle => fetchMaintenanceRecords(vehicle.id));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchMaintenanceRecords = async (vehicleId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/maintenance/${vehicleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMaintenanceRecords(prev => ({
        ...prev,
        [vehicleId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    }
  };

  const toggleForm = (vehicleId) => {
    setShowForm(prev => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
  };

  const toggleRecords = (vehicleId) => {
    setShowRecords(prev => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">AutoCare Hub</h1>
        <button onClick={onLogout} className="btn btn-logout">Logout</button>
      </header>

      <div className="main-content">
        <section className="form-section">
          <h2>Add New Vehicle</h2>
          <VehicleForm onVehicleAdded={fetchVehicles} />
        </section>

        <section className="vehicles-section">
          <h2>Your Vehicles</h2>
          {vehicles.length > 0 ? (
            <div className="vehicle-list">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="vehicle-item">
                  <h3>Model:{vehicle.model}
                  <p><strong>RegNo:</strong>{vehicle.registration_number}</p></h3>
                  <p><strong>Type:</strong> {vehicle.vehicle_type}</p>
                  <p><strong>Purchase Date:</strong> {new Date(vehicle.purchase_date).toLocaleDateString()}</p>

                  <div className="vehicle-buttons">
                    <button onClick={() => toggleRecords(vehicle.id)} className="btn-maintenance">
                      {showRecords[vehicle.id] ? 'Hide Maintenance Records' : 'Show Maintenance Records'}
                    </button>
                    <button onClick={() => toggleForm(vehicle.id)} className="btn-maintenance">
                      {showForm[vehicle.id] ? 'Hide Maintenance Form' : 'Add Maintenance Record'}
                    </button>
                  </div>

                  {showRecords[vehicle.id] && (
                    <div className="maintenance-records">
                      <h4>Maintenance Records</h4>
                      {maintenanceRecords[vehicle.id]?.length ? (
                        maintenanceRecords[vehicle.id].map(record => (
                          <div key={record.id} className="maintenance-item">
                            <p><strong>MaintenanceType:</strong> {record.maintenance_type}</p>
                            <p><strong>Date:</strong> {new Date(record.maintenance_date).toLocaleDateString()}</p>
                            <p><strong>Cost:</strong> ${record.cost}</p>
                          </div>
                        ))
                      ) : (
                        <p>No maintenance records available.</p>
                      )}
                    </div>
                  )}

                  {showForm[vehicle.id] && (
                    <MaintenanceForm
                      vehicleId={vehicle.id}
                      onMaintenanceAdded={() => fetchMaintenanceRecords(vehicle.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No vehicles added yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
