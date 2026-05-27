package com.example.bizly.dto;

public class LoginRequest {
    private String correo;
    private String contrasena;

    // Constructor vacío (obligatorio para que Spring procese el JSON)
    public LoginRequest() {
    }

    // Getters y Setters
    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}