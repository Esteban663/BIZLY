package com.example.bizly.controller;

import com.example.bizly.entity.Ingreso;
import com.example.bizly.repository.IngresoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bizly/ingresos")
public class IngresoController {

    @Autowired
    private IngresoRepository ingresoRepository;

    @GetMapping
    public ResponseEntity<List<Ingreso>> listar() {
        return ResponseEntity.ok(ingresoRepository.findAll());
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(@RequestParam(required = false) String categoria,
                                    @RequestParam(required = false)
                                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        if (categoria != null && fecha != null) {
            return ResponseEntity.ok(ingresoRepository.findByCategoriaAndFecha(categoria, fecha));
        }
        if (categoria != null) {
            return ResponseEntity.ok(ingresoRepository.findByCategoria(categoria));
        }
        if (fecha != null) {
            return ResponseEntity.ok(ingresoRepository.findByFecha(fecha));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Se requiere categoria o fecha"));
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Ingreso ingreso) {
        if (ingreso == null || ingreso.getFecha() == null || ingreso.getMonto() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fecha y monto son requeridos"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ingresoRepository.save(ingreso));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        return ingresoRepository.findById(id)
        .<ResponseEntity<?>>map(ResponseEntity::ok)
        .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Ingreso con ID " + id + " no encontrado")));
    }

   @PutMapping("/{id}")
public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Ingreso data) {
    return ingresoRepository.findById(id)
            .<ResponseEntity<?>>map(i -> {
                if (data.getFecha() != null) {
                    i.setFecha(data.getFecha());
                }
                if (data.getMonto() != null) {
                    i.setMonto(data.getMonto());
                }
                if (data.getCategoria() != null) {
                    i.setCategoria(data.getCategoria());
                }
                if (data.getDescripcion() != null) {
                    i.setDescripcion(data.getDescripcion());
                }
                if (data.getReferencia() != null) {
                    i.setReferencia(data.getReferencia());
                }
                return ResponseEntity.ok(ingresoRepository.save(i));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Ingreso con ID " + id + " no encontrado")));
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!ingresoRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Ingreso con ID " + id + " no encontrado"));
        }
        ingresoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Ingreso eliminado correctamente"));
    }
}
