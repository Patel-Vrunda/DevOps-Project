import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: '' });
  const [editingDepartmentId, setEditingDepartment] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    axios.get('http://127.0.0.1:8000/department/')
      .then(response => setDepartments(response.data))
      .catch(error => console.error("Error fetching Departments data!", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment({ ...newDepartment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartmentId) {
        await axios.put(`http://127.0.0.1:8000/department/${editingDepartmentId.id}/update/`, newDepartment);
        setSuccessMessage('Department updated successfully!');
      } else {
        await axios.post('http://127.0.0.1:8000/department/create/', newDepartment);
        setSuccessMessage('Department added successfully!');
      }
      setErrorMessage('');
      fetchDepartments();
      setNewDepartment({ name: '' });
      setEditingDepartment(null);
    } catch (error) {
      setErrorMessage('There was an error saving the department.');
      setSuccessMessage('');
    }
  };

  const handleEdit = (department) => {
    setNewDepartment({ name: department.name });
    setEditingDepartment(department);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/department/${id}/delete/`);
      setSuccessMessage('Department deleted successfully!');
      setErrorMessage('');
      fetchDepartments();
    } catch (error) {
      setErrorMessage('There was an error deleting the department.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h1>Departments</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.id}>
              <td>{department.id}</td>
              <td>{department.name}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(department)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(department.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <h2>{editingDepartmentId ? 'Edit Department' : 'Add New Department'}</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <table className="form-table">
            <tbody>
              <tr>
                <th><label>Department Name:</label></th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={newDepartment.name}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr className="form-buttons">
                <td colSpan="2" style={{ textAlign: 'center' }}>
                  <button type="submit">{editingDepartmentId ? 'Update' : 'Add'} Department</button>
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

export default DepartmentTable;
