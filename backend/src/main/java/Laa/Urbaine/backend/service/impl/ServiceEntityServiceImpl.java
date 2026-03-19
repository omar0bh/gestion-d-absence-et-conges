package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.dto.serviceentity.ServiceEntityRequest;
import Laa.Urbaine.backend.entity.Division;
import Laa.Urbaine.backend.entity.ServiceEntity;
import Laa.Urbaine.backend.entity.User;
import Laa.Urbaine.backend.repository.DivisionRepository;
import Laa.Urbaine.backend.repository.ServiceEntityRepository;
import Laa.Urbaine.backend.repository.UserRepository;
import Laa.Urbaine.backend.service.serviceentity.ServiceEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceEntityServiceImpl implements ServiceEntityService {

    private final ServiceEntityRepository serviceEntityRepository;
    private final DivisionRepository divisionRepository;
    private final UserRepository userRepository;

    @Override
    public ServiceEntity createService(ServiceEntityRequest request) {
        Division division = divisionRepository.findById(request.getDivisionId())
                .orElseThrow(() -> new RuntimeException("Division not found"));

        User manager = null;
        if (request.getManagerUserId() != null) {
            manager = userRepository.findById(request.getManagerUserId())
                    .orElseThrow(() -> new RuntimeException("Manager user not found"));
        }

        ServiceEntity serviceEntity = ServiceEntity.builder()
                .name(request.getName())
                .division(division)
                .manager(manager)
                .build();

        return serviceEntityRepository.save(serviceEntity);
    }

    @Override
    public List<ServiceEntity> getAllServices() {
        return serviceEntityRepository.findAll();
    }

    @Override
    public List<ServiceEntity> getServicesByDivision(Long divisionId) {
        return serviceEntityRepository.findByDivisionId(divisionId);
    }

    @Override
    public ServiceEntity getServiceById(Long id) {
        return serviceEntityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }
}