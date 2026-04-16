package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.dto.division.DivisionRequest;
import Laa.Urbaine.backend.entity.Department;
import Laa.Urbaine.backend.entity.Division;
import Laa.Urbaine.backend.entity.User;
import Laa.Urbaine.backend.repository.DepartmentRepository;
import Laa.Urbaine.backend.repository.DivisionRepository;
import Laa.Urbaine.backend.repository.UserRepository;
import Laa.Urbaine.backend.service.division.DivisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DivisionServiceImpl implements DivisionService {

    private final DivisionRepository divisionRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    public Division createDivision(DivisionRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
            if (divisionRepository.existsByNameIgnoreCaseAndDepartmentId(
                request.getName(),
                 request.getDepartmentId())) {
                throw new RuntimeException("Division name already exists in this department");
            }

        User manager = null;
        if (request.getManagerUserId() != null) {
            manager = userRepository.findById(request.getManagerUserId())
                    .orElseThrow(() -> new RuntimeException("Manager user not found"));
        }

        Division division = Division.builder()
                .name(request.getName())
                .department(department)
                .manager(manager)
                .build();

        return divisionRepository.save(division);
    }

    @Override
    public List<Division> getAllDivisions() {
        return divisionRepository.findAll();
    }

    @Override
    public List<Division> getDivisionsByDepartment(Long departmentId) {
        return divisionRepository.findByDepartmentId(departmentId);
    }

    @Override
    public Division getDivisionById(Long id) {
        return divisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Division not found"));
    }
}