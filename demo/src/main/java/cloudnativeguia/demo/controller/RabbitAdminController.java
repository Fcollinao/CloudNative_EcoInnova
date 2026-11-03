package cloudnativeguia.demo.controller;

import cloudnativeguia.demo.dto.CreateQueueRequest;
import cloudnativeguia.demo.service.RabbitAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class RabbitAdminController {

    private final RabbitAdminService adminService;

    public RabbitAdminController(RabbitAdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/queues")
    public ResponseEntity<String> crearCola(@RequestBody CreateQueueRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre de la cola no puede estar vacío");
        }
        adminService.crearCola(request);
        return ResponseEntity.ok("Cola '" + request.getName() + "' creada exitosamente.");
    }

    @DeleteMapping("/queues/{nombre}")
    public ResponseEntity<String> eliminarCola(@PathVariable String nombre) {
        boolean eliminada = adminService.eliminarCola(nombre);
        if (eliminada) {
            return ResponseEntity.ok("Cola '" + nombre + "' eliminada exitosamente.");
        }
        return ResponseEntity.badRequest().body("No se pudo eliminar la cola o no existía.");
    }
}
