package com.example.bizly.controller;

import com.example.bizly.dto.LoginRequest;
import com.example.bizly.entity.Usuario;
import com.example.bizly.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;



@RestController
@RequestMapping("/bizly/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> guardar(@RequestBody Usuario usuario) {
        try {
            // Validar que los campos requeridos no estén vacíos
            if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es requerido");
            }
            if (usuario.getCorreo() == null || usuario.getCorreo().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El correo es requerido");
            }
            if (usuario.getContrasena() == null || usuario.getContrasena().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La contraseña es requerida");
            }

            // Asignar rol por defecto si no viene
            if (usuario.getRol() == null || usuario.getRol().trim().isEmpty()) {
                usuario.setRol("Admin");
            }

            // Asignar fecha de creación si no viene o es null
            if (usuario.getFechaCreacion() == null) {
                usuario.setFechaCreacion(LocalDateTime.now());
            }

            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar el usuario: " + e.getMessage());
        }
    }
    //Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    /* 
    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable Long id, @RequestBody Usuario data) {
        Usuario u = usuarioRepository.findById(id).orElse(null);

        if (u != null) {
            u.setNombre(data.getNombre());
            u.setCorreo(data.getCorreo());
            u.setContrasena(data.getContrasena());
            u.setRol(data.getRol());
            return usuarioRepository.save(u);
        }

        return null;
    }
        */

    // Actualizar Usuario con validaciones y manejo de errores
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Usuario data) {
        try {
            Optional<Usuario> optional = usuarioRepository.findById(id);

            if (optional.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Usuario con ID " + id + " no encontrado"));
            }

            Usuario u = optional.get();

            // Solo actualiza los campos que vienen en el body
            if (data.getNombre() != null && !data.getNombre().trim().isEmpty()) {
                u.setNombre(data.getNombre());
            }
            if (data.getCorreo() != null && !data.getCorreo().trim().isEmpty()) {
                // Verificar que el nuevo correo no lo use otro usuario
                Usuario correoExistente = usuarioRepository.ObtenerPorCorreo(data.getCorreo());
                if (correoExistente != null && !correoExistente.getId().equals(id)) {
                    return ResponseEntity
                            .status(HttpStatus.CONFLICT)
                            .body(Map.of("error", "El correo ya está en uso por otro usuario"));
                }
                u.setCorreo(data.getCorreo());
            }
            if (data.getContrasena() != null && !data.getContrasena().trim().isEmpty()) {
                u.setContrasena(data.getContrasena());
            }
            if (data.getRol() != null && !data.getRol().trim().isEmpty()) {
                u.setRol(data.getRol());
            }

            return ResponseEntity.ok(usuarioRepository.save(u));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar el usuario: " + e.getMessage()));
        }
    }

   @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            if (!usuarioRepository.existsById(id)) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Usuario con ID " + id + " no encontrado"));
            }

            usuarioRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario con ID " + id + " eliminado correctamente"));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar el usuario: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest credenciales) {
        try {
            String correo = credenciales.getCorreo();
            String contrasena = credenciales.getContrasena();

            // Validar que vengan las credenciales
            if (correo == null || correo.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo es requerido"));
            }
            if (contrasena == null || contrasena.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "La contraseña es requerida"));
            }

            // Buscar usuario por correo y contraseña (login)
            Usuario usuario = usuarioRepository.loginUsuario(correo, contrasena);

            if (usuario == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Credenciales inválidas"));
            }

            // Login exitoso — aquí podrías generar un JWT en el futuro
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Login exitoso",
                    "id", usuario.getId(),
                    "nombre", usuario.getNombre(),
                    "correo", usuario.getCorreo(),
                    "rol", usuario.getRol()
            ));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error en el login: " + e.getMessage()));
        }
    }

}
