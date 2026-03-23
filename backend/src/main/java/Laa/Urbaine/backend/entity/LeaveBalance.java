package Laa.Urbaine.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "leave_balances",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employee_id", "leave_type_id", "year"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(optional = false)
    @JoinColumn(name = "leave_type_id")
    private LeaveType leaveType;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer remainingDays;
}