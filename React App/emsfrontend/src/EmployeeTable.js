import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    salary: '',
    designation: '',
    department: '',
    address: '',
    projects: [],
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
    axios.get('http://127.0.0.1:8000/department/')
      .then((response) => setDepartments(response.data))
      .catch(error => console.error('Error fetching departments', error));

    axios.get('http://127.0.0.1:8000/project/')
      .then((response) => setProjects(response.data))
      .catch(error => console.error('Error fetching projects', error));
  }, []);

  const fetchEmployees = () => {
    axios.get('http://127.0.0.1:8000/employee/')
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching Employees data!", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployeeId) {
        // Update employee
        await axios.put(`http://127.0.0.1:8000/employee/${editingEmployeeId}/update/`, newEmployee);
        setSuccessMessage('Employee updated successfully!');
        setEditingEmployeeId(null);
      } else {
        // Add new employee
        await axios.post('http://127.0.0.1:8000/employee/create/', newEmployee);
        setSuccessMessage('Employee added successfully!');
      }
      setErrorMessage('');
      fetchEmployees();  // Refresh employee list
      resetForm();
    } catch (error) {
      setErrorMessage('There was an error saving the employee.');
      setSuccessMessage('');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployeeId(employee.id);
    setNewEmployee({
      name: employee.name,
      salary: employee.salary,
      designation: employee.designation,
      department: employee.department,
      address: employee.address,
      projects: employee.projects,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/employee/${id}/delete/`);
      setSuccessMessage('Employee deleted successfully!');
      setErrorMessage('');
      fetchEmployees();
    } catch (error) {
      setErrorMessage('There was an error deleting the employee.');
      setSuccessMessage('');
    }
  };

  const resetForm = () => {
    setNewEmployee({
      name: '',
      salary: '',
      designation: '',
      department: '',
      address: '',
      projects: [],
    });
  };

  return (
    <div>
      <h1>Employees</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Salary</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Address</th>
            <th>Projects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.salary}</td>
              <td>{employee.designation}</td>
              <td>{employee.department}</td>
              <td>{employee.address}</td>
              <td>{employee.projects.join(', ')}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(employee)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>    
      <h2>{editingEmployeeId ? 'Edit Employee' : 'Add New Employee'}</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <table className="form-table">
            <tbody>
              <tr>
                <th><label>Name:</label></th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th><label>Salary:</label></th>
                <td>
                  <input
                    type="number"
                    name="salary"
                    value={newEmployee.salary}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th><label>Designation:</label></th>
                <td>
                  <input
                    type="text"
                    name="designation"
                    value={newEmployee.designation}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th><label>Address:</label></th>
                <td>
                  <input
                    type="text"
                    name="address"
                    value={newEmployee.address}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th><label>Department:</label></th>
                <td>
                  <select
                    name="department"
                    value={newEmployee.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <th><label>Projects:</label></th>
                <td>
                  <select
                    name="projects"
                    value={newEmployee.projects}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        projects: [...e.target.selectedOptions].map(option => option.value),
                      })
                    }
                    multiple
                  >
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr className="form-buttons">
                <td colSpan="2" style={{ textAlign: 'center' }}>
                  <button type="submit">{editingEmployeeId ? 'Update' : 'Add'} Employee</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default EmployeeTable;
