
# MERN Stack Vehicle Management Portal 🚗

A feature-rich web application designed to help users register, log in, and manage their personal vehicles and vehicle maintenance details efficiently.

## 🚀 Project Objective

To create a portal using the MERN stack where users can:
- Register and log in to their accounts.
- Manage personal vehicle information.
- Track and manage vehicle maintenance records.

## 🔑 Key Features

### **User Module**
- **Registration & Login**:  
  - Users can register with their details and log in to access the system.
  - Display the user's name and a logout button after login.

### **Vehicle Management Module**
- Add, view, and delete personal vehicles.
- Vehicle details include:
  - **Vehicle Model**  
  - **Vehicle Registration Number**  
  - **Vehicle Type** (Dropdown: Car, Bike, etc.)  
  - **Purchase Date**  
  - **Vehicle Image/Logo**

### **Maintenance Management Module**
- Add and view maintenance records for vehicles.
- Maintenance details include:
  - **Maintenance Type** (e.g., Oil Change, Tire Replacement)  
  - **Date of Maintenance**  
  - **Cost of Maintenance**  
  - **Vehicle** (Dropdown to link to a relevant vehicle)

## 💻 Technology Stack

- **Frontend**: React.js  
- **Backend**: Node.js  
- **Database**: MySQL  
- **Data Dictionary**: To be maintained in an Excel format for clarity and ease of reference.

## 🛠️ Features in Detail

1. **Form Validations**:
   - All input fields across the portal include appropriate validations.

2. **Responsive Design**:
   - The UI is designed to provide a seamless user experience across devices.

3. **Interactive Dropdowns**:
   - Dropdown fields for Vehicle Type and linking Maintenance Records to relevant vehicles ensure an intuitive user interface.



## 🧩 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/krishang2205/AutoCareHub-Mern.git
   ```
2. Navigate to the project directory:
   ```bash
   cd AutoCareHub
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   npm install
   ```
4. Set up the MySQL database:
   - Create a database named `vehicle_portal`.
   - Import the provided SQL file to set up the schema and tables.
5. Configure the backend `.env` file:
   ```plaintext
   DB_HOST=<your-db-host>
   DB_USER=<your-db-user>
   DB_PASS=<your-db-password>
   DB_NAME=vehicle_portal
   ```
6. Start the development server:
   ```bash
   npm start
   ```


