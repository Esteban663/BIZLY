package com.example.bizly.controller;

import com.example.bizly.entity.Egreso;
import com.example.bizly.repository.EgresoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bizly/egresos")
public class EgresoController {

    @Autowired
    private EgresoRepository egresoRepository;

    @GetMapping
    public List<Egreso> listar() {
        return egresoRepository.findAll();
    }

    @PostMapping
    public Egreso guardar(@RequestBody Egreso egreso) {
        return egresoRepository.save(egreso);
    }

    @GetMapping("/{id}")
    public Egreso obtener(@PathVariable Long id) {
        return egresoRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Egreso actualizar(@PathVariable Long id, @RequestBody Egreso data) {
        Egreso e = egresoRepository.findById(id).orElse(null);

        if (e != null) {
            e.setFecha(data.getFecha());
            e.setMonto(data.getMonto());
            e.setCategoria(data.getCategoria());
            e.setDescripcion(data.getDescripcion());
            e.setReferencia(data.getReferencia());
            return egresoRepository.save(e);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        egresoRepository.deleteById(id);
    }
}
