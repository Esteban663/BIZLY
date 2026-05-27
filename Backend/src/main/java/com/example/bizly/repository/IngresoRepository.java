package com.example.bizly.repository;

import com.example.bizly.entity.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IngresoRepository extends JpaRepository<Ingreso, Long> {
    List<Ingreso> findByCategoria(String categoria);
    List<Ingreso> findByFecha(LocalDate fecha);
    List<Ingreso> findByCategoriaAndFecha(String categoria, LocalDate fecha);
}