const path = require('path');
const fs = require('fs');

const data = {
  'employees': require('./../model/employees.json'),
  setEmployees: function (data) {
    this.employees = data;
    const jsonData = JSON.stringify(data);
    fs.writeFileSync(
      path.join(__dirname, '..', 'model', 'employees.json'),
      jsonData
    );
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!newEmployee.firstName || !newEmployee.lastName) {
    return res
      .status(400)
      .json({ message: 'First and last names are required' });
  }
  data.setEmployees([...data.employees, newEmployee]);

  res.json(data.employees);
};

const updateEmployee = (req, res) => {
  const updateEmployee = {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!updateEmployee.id) {
    return res.status(400).json({ message: 'Id is required' });
  }

  const newData = data.employees.map((employee) => {
    if (employee.id === updateEmployee.id) {
      employee.firstName = updateEmployee.firstName || employee.firstName;
      employee.lastName = updateEmployee.lastName || employee.lastName;
    }
    return employee;
  });
  data.setEmployees([...newData]);

  res.json(data);
};

const deleteEmployee = (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(400).json({ message: 'Id is required' });
  }

  const newData = data.employees.filter((employee) => employee.id !== id);
  data.setEmployees([...newData]);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const id = req.params.id;
  const employee = data.employees.find((employee) => employee.id === +id);
  if (!employee) {
    return res.status(400).json({ message: 'User not found' });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
