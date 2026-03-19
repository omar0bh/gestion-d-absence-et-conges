package Laa.Urbaine.backend.service.employee;

import Laa.Urbaine.backend.dto.employee.EmployeeRequest;
import Laa.Urbaine.backend.entity.Employee;

import java.util.List;

public interface EmployeeService {
    Employee createEmployee(EmployeeRequest request);
    List<Employee> getAllEmployees();
    Employee getEmployeeById(Long id);
    Employee getEmployeeByUserId(Long userId);
}