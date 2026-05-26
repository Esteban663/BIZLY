package com.example.bizly.controller;

import com.example.bizly.entity.Nomina;
import com.example.bizly.repository.NominaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nomina")
@CrossOrigin("*")
public class NominaController {

    @Autowired
    private NominaRepository nominaRepository;

    @GetMapping
    public List<Nomina> listar() {
        return nominaRepository.findAll();
    }

    @PostMapping
    public Nomina guardar(@RequestBody Nomina nomina) {

        // cálculo automático
        double total = nomina.getSueldoBase() - nomina.getDeducciones();
        nomina.setTotalPagar(total);

        return nominaRepository.save(nomina);
    }

    @GetMapping("/{id}")
    public Nomina obtener(@PathVariable Long id) {
        return nominaRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Nomina actualizar(@PathVariable Long id, @RequestBody Nomina data) {

        Nomina n = nominaRepository.findById(id).orElse(null);

        if (n != null) {
            n.setPeriodo(data.getPeriodo());
            n.setNombreEmpleado(data.getNombreEmpleado());
            n.setCargoEmpleado(data.getCargoEmpleado());
            n.setSueldoBase(data.getSueldoBase());
            n.setDeducciones(data.getDeducciones());

            double total = data.getSueldoBase() - data.getDeducciones();
            n.setTotalPagar(total);

            return nominaRepository.save(n);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        nominaRepository.deleteById(id);
    }
}
