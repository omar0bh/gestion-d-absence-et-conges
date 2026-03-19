package Laa.Urbaine.backend.repository;

import Laa.Urbaine.backend.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceEntityRepository extends JpaRepository<ServiceEntity, Long> {
    List<ServiceEntity> findByDivisionId(Long divisionId);
}