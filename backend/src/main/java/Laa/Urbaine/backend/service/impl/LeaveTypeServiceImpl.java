package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.dto.leavetype.LeaveTypeRequest;
import Laa.Urbaine.backend.entity.LeaveType;
import Laa.Urbaine.backend.repository.LeaveTypeRepository;
import Laa.Urbaine.backend.service.leavetype.LeaveTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveTypeServiceImpl implements LeaveTypeService {

    private final LeaveTypeRepository leaveTypeRepository;

    @Override
    public LeaveType createLeaveType(LeaveTypeRequest request) {
        if (leaveTypeRepository.existsByName(request.getName())) {
            throw new RuntimeException("Leave type name already exists");
        }

        LeaveType leaveType = LeaveType.builder()
                .name(request.getName())
                .description(request.getDescription())
                .maxDays(request.getMaxDays())
                .requiresProof(Boolean.TRUE.equals(request.getRequiresProof()))
                .requiresDirectorApproval(Boolean.TRUE.equals(request.getRequiresDirectorApproval()))
                .build();

        return leaveTypeRepository.save(leaveType);
    }

    @Override
    public List<LeaveType> getAllLeaveTypes() {
        return leaveTypeRepository.findAll();
    }

    @Override
    public LeaveType getLeaveTypeById(Long id) {
        return leaveTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave type not found"));
    }
}