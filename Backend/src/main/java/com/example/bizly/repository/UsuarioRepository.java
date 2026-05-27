package com.example.bizly.repository;

import com.example.bizly.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
     // Método para login de usuario
     @Query(value = "SELECT * FROM usuario WHERE correo = :correo AND contrasena = :contrasena", nativeQuery = true)
     public Usuario loginUsuario(@Param("correo") String correo, @Param("contrasena") String contrasena);

     // Método para obtener usuario por correo
     @Query(value = "SELECT * FROM usuario WHERE correo = :correo", nativeQuery = true)
     public Usuario ObtenerPorCorreo(@Param("correo") String correo);


}
