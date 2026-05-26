package com.example.bizly.controller;

import com.example.bizly.entity.Ingreso;
import com.example.bizly.repository.IngresoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingresos")
@CrossOrigin("*")
public class IngresoController {

    @Autowired
    private IngresoRepository ingresoRepository;

    @GetMapping
    public List<Ingreso> listar() {
        return ingresoRepository.findAll();
    }

    @PostMapping
    public Ingreso guardar(@RequestBody Ingreso ingreso) {
        return ingresoRepository.save(ingreso);
    }

    @GetMapping("/{id}")
    public Ingreso obtener(@PathVariable Long id) {
        return ingresoRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Ingreso actualizar(@PathVariable Long id, @RequestBody Ingreso data) {
        Ingreso i = ingresoRepository.findById(id).orElse(null);

        if (i != null) {
            i.setFecha(data.getFecha());
            i.setMonto(data.getMonto());
            i.setCategoria(data.getCategoria());
            i.setDescripcion(data.getDescripcion());
            i.setReferencia(data.getReferencia());
            return ingresoRepository.save(i);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        ingresoRepository.deleteById(id);
    }
}
