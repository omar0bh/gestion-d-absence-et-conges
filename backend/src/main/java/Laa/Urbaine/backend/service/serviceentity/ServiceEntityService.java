package Laa.Urbaine.backend.service.serviceentity;

import Laa.Urbaine.backend.dto.serviceentity.ServiceEntityRequest;
import Laa.Urbaine.backend.entity.ServiceEntity;

import java.util.List;

public interface ServiceEntityService {
    ServiceEntity createService(ServiceEntityRequest request);
    List<ServiceEntity> getAllServices();
    List<ServiceEntity> getServicesByDivision(Long divisionId);
    ServiceEntity getServiceById(Long id);
}