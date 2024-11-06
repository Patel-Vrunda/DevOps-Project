import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EmployeeTable from './EmployeeTable';
import DepartmentTable from './DepartmentTable';
import ProjectTable from './ProjectTable';

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setTimeout(() => {

      // Get employee data
      axios.get('http://127.0.0.1:8000/employee/')
        .then(response => {
          setEmployees(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching Employees data!", error);
      });

      // Get department data
      axios.get('http://127.0.0.1:8000/department/')
        .then(response => {
          setDepartments(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching Departments data!", error);
        });

      // Get project data
      axios.get('http://127.0.0.1:8000/project/')
        .then(response => {
          setProjects(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching Projects data!", error);
        });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Router>
      <div>
        { loading ? (
          <div className="loadingContainer">
            <img 
              src='https://i.gifer.com/ZZ5H.gif'
              alt='LOADING.....'
              className='loadingGif'
            />
            <p className='loadingText'>Fetching Employee, Department and Project data......</p>
          </div>
        ) : (

          <div className='container'>
            <nav>
              <ul>
                <div>
                    <li><Link to="/employees">Employees</Link></li>
                </div>
                <li><Link to="/departments">Departments</Link></li>
                <li><Link to="/projects">Projects</Link></li>
              </ul>
            </nav>

            <Routes>
              <Route path="/employees" element={<EmployeeTable employees={employees} />} />
              <Route path="/departments" element={<DepartmentTable departments={departments} />} />
              <Route path="/projects" element={<ProjectTable projects={projects} />} />
            </Routes>

          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
