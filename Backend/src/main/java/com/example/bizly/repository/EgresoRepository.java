package com.example.bizly.repository;

import com.example.bizly.entity.Egreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EgresoRepository extends JpaRepository<Egreso, Long> {
    List<Egreso> findByCategoria(String categoria);
    List<Egreso> findByFecha(LocalDate fecha);
    List<Egreso> findByCategoriaAndFecha(String categoria, LocalDate fecha);
}

