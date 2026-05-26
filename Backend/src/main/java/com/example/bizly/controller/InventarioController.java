package com.example.bizly.controller;

import com.example.bizly.entity.Inventario;
import com.example.bizly.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario")
@CrossOrigin("*")
public class InventarioController {

    @Autowired
    private InventarioRepository inventarioRepository;

    @GetMapping
    public List<Inventario> listar() {
        return inventarioRepository.findAll();
    }

    @PostMapping
    public Inventario guardar(@RequestBody Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    @GetMapping("/{id}")
    public Inventario obtener(@PathVariable Long id) {
        return inventarioRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Inventario actualizar(@PathVariable Long id, @RequestBody Inventario data) {
        Inventario inv = inventarioRepository.findById(id).orElse(null);

        if (inv != null) {
            inv.setNombre(data.getNombre());
            inv.setCategoria(data.getCategoria());
            inv.setCantidad(data.getCantidad());
            inv.setPrecio(data.getPrecio());
            inv.setCodigo(data.getCodigo());
            return inventarioRepository.save(inv);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        inventarioRepository.deleteById(id);
    }
}