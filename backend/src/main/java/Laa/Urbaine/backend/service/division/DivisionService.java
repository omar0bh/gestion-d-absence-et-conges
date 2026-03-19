package Laa.Urbaine.backend.service.division;

import Laa.Urbaine.backend.dto.division.DivisionRequest;
import Laa.Urbaine.backend.entity.Division;

import java.util.List;

public interface DivisionService {
    Division createDivision(DivisionRequest request);
    List<Division> getAllDivisions();
    List<Division> getDivisionsByDepartment(Long departmentId);
    Division getDivisionById(Long id);
}