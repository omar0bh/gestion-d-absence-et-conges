package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.dto.department.DepartmentRequest;
import Laa.Urbaine.backend.entity.Department;
import Laa.Urbaine.backend.entity.User;
import Laa.Urbaine.backend.repository.DepartmentRepository;
import Laa.Urbaine.backend.repository.UserRepository;
import Laa.Urbaine.backend.service.department.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    public Department createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new RuntimeException("Department name already exists");
        }

        User manager = null;
        if (request.getManagerUserId() != null) {
            manager = userRepository.findById(request.getManagerUserId())
                    .orElseThrow(() -> new RuntimeException("Manager user not found"));
        }

        Department department = Department.builder()
                .name(request.getName())
                .manager(manager)
                .build();

        return departmentRepository.save(department);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }
}