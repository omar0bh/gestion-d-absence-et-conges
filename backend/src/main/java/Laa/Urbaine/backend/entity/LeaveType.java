package Laa.Urbaine.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Integer maxDays;

    @Column(nullable = false)
    private boolean requiresProof = false;

    @Column(nullable = false)
    private boolean requiresDirectorApproval = false;
}