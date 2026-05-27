package com.example.bizly.controller;

import com.example.bizly.entity.Nomina;
import com.example.bizly.repository.NominaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bizly/nomina")
public class NominaController {

    @Autowired
    private NominaRepository nominaRepository;

    @GetMapping
    public List<Nomina> listar() {
        return nominaRepository.findAll();
    }

    public Nomina agregar(@RequestBody Nomina data){
        Nomina nuevaNomina = new Nomina();

        
        nuevaNomina.setNombreEmpleado(data.getNombreEmpleado());
        nuevaNomina.setCedula(data.getCedula());
        nuevaNomina.setSueldoBase(data.getSueldoBase());
        

        return nominaRepository.save(nuevaNomina);
    }

    @PutMapping("/{id}")
    public Nomina actualizar(@PathVariable Long id, @RequestBody Nomina data) {

        Nomina n = nominaRepository.findById(id).orElse(null);

        if (n != null) {
            
            n.setNombreEmpleado(data.getNombreEmpleado());
            n.setCedula(data.getCedula());
            n.setSueldoBase(data.getSueldoBase());
            n.setSueldoBase(data.getSueldoBase());

            return nominaRepository.save(n);
        }

        return null;
    }

    @PutMapping("/{id}")
    public String buscar(@PathVariable Long id){
        Nomina n = nominaRepository.findById(id).orElse(null);

        String nombre = n.getNombreEmpleado();
        String cedula = n.getCedula();
        String sueldoBase = n.getSueldoBase().toString();

        return id + nombre + cedula + sueldoBase;
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        nominaRepository.deleteById(id);
    }
}
