package com.example.bizly.controller;

import com.example.bizly.entity.Egreso;
import com.example.bizly.repository.EgresoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bizly/egresos")
public class EgresoController {

    @Autowired
    private EgresoRepository egresoRepository;

    @GetMapping
    public ResponseEntity<List<Egreso>> listar() {
        return ResponseEntity.ok(egresoRepository.findAll());
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(@RequestParam(required = false) String categoria,
                                    @RequestParam(required = false)
                                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        if (categoria != null && fecha != null) {
            return ResponseEntity.ok(egresoRepository.findByCategoriaAndFecha(categoria, fecha));
        }
        if (categoria != null) {
            return ResponseEntity.ok(egresoRepository.findByCategoria(categoria));
        }
        if (fecha != null) {
            return ResponseEntity.ok(egresoRepository.findByFecha(fecha));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Se requiere categoria o fecha"));
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Egreso egreso) {
        if (egreso == null || egreso.getFecha() == null || egreso.getMonto() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fecha y monto son requeridos"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(egresoRepository.save(egreso));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        return egresoRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Egreso con ID " + id + " no encontrado")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Egreso data) {
        return egresoRepository.findById(id)
                .<ResponseEntity<?>>map(e -> {
                    if (data.getFecha() != null) {
                        e.setFecha(data.getFecha());
                    }
                    if (data.getMonto() != null) {
                        e.setMonto(data.getMonto());
                    }
                    if (data.getCategoria() != null) {
                        e.setCategoria(data.getCategoria());
                    }
                    if (data.getDescripcion() != null) {
                    e.setDescripcion(data.getDescripcion());
                }
                    if (data.getReferencia() != null) {
                    e.setReferencia(data.getReferencia());
                }
                    return ResponseEntity.ok(egresoRepository.save(e));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Egreso con ID " + id + " no encontrado")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!egresoRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Egreso con ID " + id + " no encontrado"));
        }
        egresoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Egreso eliminado correctamente"));
    }
}
