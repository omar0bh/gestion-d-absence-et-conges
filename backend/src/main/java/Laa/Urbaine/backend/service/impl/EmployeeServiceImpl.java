package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.dto.employee.EmployeeRequest;
import Laa.Urbaine.backend.entity.*;
import Laa.Urbaine.backend.repository.*;
import Laa.Urbaine.backend.service.employee.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DivisionRepository divisionRepository;
    private final ServiceEntityRepository serviceEntityRepository;

    @Override
    public Employee createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByMatricule(request.getMatricule())) {
            throw new RuntimeException("Matricule already exists");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (employeeRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new RuntimeException("This user is already linked to an employee");
        }

        return employeeRepository.save(buildEmployee(null, request, user));
    }

    @Override
    public Employee updateEmployee(Long id, EmployeeRequest request) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employeeRepository.existsByMatriculeAndIdNot(request.getMatricule(), id)) {
            throw new RuntimeException("Matricule already exists");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (employeeRepository.findByUserIdAndIdNot(request.getUserId(), id).isPresent()) {
            throw new RuntimeException("This user is already linked to another employee");
        }

        Employee updated = buildEmployee(existing, request, user);
        return employeeRepository.save(updated);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employeeRepository.delete(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @Override
    public Employee getEmployeeByUserId(Long userId) {
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found for this user"));
    }

    private Employee buildEmployee(Employee existing, EmployeeRequest request, User user) {
        String role = user.getRole().name();
        boolean topLevelRole = "DIRECTOR".equals(role) || "SYSTEM_ADMIN".equals(role);

        Department department = null;
        Division division = null;
        ServiceEntity service = null;
        User directManager = null;

        if (!topLevelRole) {
            if (request.getDepartmentId() == null) {
                throw new RuntimeException("Department is required for this role");
            }

            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));

            if (request.getDivisionId() != null) {
                division = divisionRepository.findById(request.getDivisionId())
                        .orElseThrow(() -> new RuntimeException("Division not found"));
            }

            if (request.getServiceId() != null) {
                service = serviceEntityRepository.findById(request.getServiceId())
                        .orElseThrow(() -> new RuntimeException("Service not found"));
            }

            if (request.getDirectManagerId() != null) {
                directManager = userRepository.findById(request.getDirectManagerId())
                        .orElseThrow(() -> new RuntimeException("Direct manager not found"));
            }
        }

        Employee employee = existing != null ? existing : new Employee();

        employee.setMatricule(request.getMatricule());
        employee.setUser(user);
        employee.setDepartment(department);
        employee.setDivision(division);
        employee.setService(service);
        employee.setDirectManager(directManager);
        employee.setPositionTitle(request.getPositionTitle());
        employee.setHireDate(request.getHireDate());

        return employee;
    }
}