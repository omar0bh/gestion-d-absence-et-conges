package Laa.Urbaine.backend.service.department;

import Laa.Urbaine.backend.dto.department.DepartmentRequest;
import Laa.Urbaine.backend.entity.Department;

import java.util.List;

public interface DepartmentService {
    Department createDepartment(DepartmentRequest request);
    List<Department> getAllDepartments();
    Department getDepartmentById(Long id);
}