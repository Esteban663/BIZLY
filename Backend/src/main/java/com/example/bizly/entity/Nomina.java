package com.example.bizly.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "nomina")
public class Nomina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Datos del periodo
    private String periodo;

    // Datos del empleado (embebidos)
    private String nombreEmpleado;
    private String cargoEmpleado;
    private Double sueldoBase;

    // Cálculos de nómina
    private Double deducciones;
    private Double totalPagar;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public String getNombreEmpleado() {
        return nombreEmpleado;
    }

    public void setNombreEmpleado(String nombreEmpleado) {
        this.nombreEmpleado = nombreEmpleado;
    }

    public String getCargoEmpleado() {
        return cargoEmpleado;
    }

    public void setCargoEmpleado(String cargoEmpleado) {
        this.cargoEmpleado = cargoEmpleado;
    }

    public Double getSueldoBase() {
        return sueldoBase;
    }

    public void setSueldoBase(Double sueldoBase) {
        this.sueldoBase = sueldoBase;
    }

    public Double getDeducciones() {
        return deducciones;
    }

    public void setDeducciones(Double deducciones) {
        this.deducciones = deducciones;
    }

    public Double getTotalPagar() {
        return totalPagar;
    }

    public void setTotalPagar(Double totalPagar) {
        this.totalPagar = totalPagar;
    }
}
