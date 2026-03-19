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

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        Division division = null;
        if (request.getDivisionId() != null) {
            division = divisionRepository.findById(request.getDivisionId())
                    .orElseThrow(() -> new RuntimeException("Division not found"));
        }

        ServiceEntity service = null;
        if (request.getServiceId() != null) {
            service = serviceEntityRepository.findById(request.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Service not found"));
        }

        User directManager = null;
        if (request.getDirectManagerId() != null) {
            directManager = userRepository.findById(request.getDirectManagerId())
                    .orElseThrow(() -> new RuntimeException("Direct manager not found"));
        }

        Employee employee = Employee.builder()
                .matricule(request.getMatricule())
                .user(user)
                .department(department)
                .division(division)
                .service(service)
                .directManager(directManager)
                .positionTitle(request.getPositionTitle())
                .hireDate(request.getHireDate())
                .build();

        return employeeRepository.save(employee);
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
}