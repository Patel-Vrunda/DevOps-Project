import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    teamLead: '',
    status: 'NEW',
    startDate: '',
    endDate: '',
    team: [],
  });
  const [editingProjectId, setEditingProject] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = () => {
    axios.get('http://127.0.0.1:8000/project/')
      .then(response => setProjects(response.data))
      .catch(error => console.error("Error fetching Projects data!", error));
  };

  const fetchEmployees = () => {
    axios.get('http://127.0.0.1:8000/employee/')
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching Employees data!", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProjectId) {
        await axios.put(`http://127.0.0.1:8000/project/${editingProjectId.id}/update/`, newProject);
        setSuccessMessage('Project updated successfully!');
      } else {
        await axios.post('http://127.0.0.1:8000/project/create/', newProject);
        setSuccessMessage('Project added successfully!');
      }
      setErrorMessage('');
      fetchProjects();
      setNewProject({
        name: '',
        teamLead: '',
        status: 'NEW',
        startDate: '',
        endDate: '',
        team: [],
      });
      setEditingProject(null);
    } catch (error) {
      setErrorMessage('There was an error saving the project.');
      setSuccessMessage('');
    }
  };

  const handleEdit = (project) => {
    setNewProject({
      name: project.name,
      teamLead: project.team_lead,
      status: project.status,
      startDate: project.start_date,
      endDate: project.end_date,
      team: project.team,
    });
    setEditingProject(project);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/project/${id}/delete/`);
      setSuccessMessage('Project deleted successfully!');
      setErrorMessage('');
      fetchProjects();
    } catch (error) {
      setErrorMessage('There was an error deleting the project.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h1>Projects</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Team Lead</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.team_lead}</td>
              <td>{project.status}</td>
              <td>{project.start_date}</td>
              <td>{project.end_date}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(project)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(project.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <h2>{editingProjectId ? 'Edit Project' : 'Add New Project'}</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <table className="form-table">
            <tbody>
              <tr>
                <th><label>Project Name:</label></th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={newProject.name}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th><label>Team Lead:</label></th>
                <td>
                  <select
                    name="teamLead"
                    value={newProject.teamLead}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Team Lead</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <th><label>Team Members:</label></th>
                <td>
                  <select
                    name="team"
                    value={newProject.team}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        team: [...e.target.selectedOptions].map(option => option.value),
                      })
                    }
                    multiple
                  >
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr className="form-buttons">
                <td colSpan="2" style={{ textAlign: 'center' }}>
                  <button type="submit">{editingProjectId ? 'Update' : 'Add'} Project</button>
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

export default ProjectTable;
