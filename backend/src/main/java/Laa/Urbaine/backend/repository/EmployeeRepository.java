package Laa.Urbaine.backend.repository;

import Laa.Urbaine.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByMatricule(String matricule);
    boolean existsByMatriculeAndIdNot(String matricule, Long id);

    Optional<Employee> findByUserId(Long userId);
    Optional<Employee> findByUserIdAndIdNot(Long userId, Long id);

    List<Employee> findByDepartmentId(Long departmentId);
    List<Employee> findByDivisionId(Long divisionId);
    List<Employee> findByServiceId(Long serviceId);
}