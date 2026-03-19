package Laa.Urbaine.backend.repository;

import Laa.Urbaine.backend.entity.Division;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DivisionRepository extends JpaRepository<Division, Long> {
    List<Division> findByDepartmentId(Long departmentId);
}