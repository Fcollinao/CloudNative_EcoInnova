package cloudnativeguia.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReciclajeController {

    // Ruta PÚBLICA: Puntos de reciclaje visibles para cualquier visitante
    @GetMapping("/public/puntos")
    public List<Map<String, String>> obtenerPuntosPublicos() {
        return List.of(
            Map.of("nombre", "Punto Verde Central", "tipo", "Plástico y Vidrio", "comuna", "Santiago"),
            Map.of("nombre", "Ecopunto Barrio Italia", "tipo", "Cartón y Cartón para Bebidas", "comuna", "Providencia")
        );
    }

    // Ruta PROTEGIDA: Catálogo de Pymes sustentables (Solo usuarios autenticados)
    @GetMapping("/pymes")
    public List<Map<String, String>> obtenerPymesSustentables() {
        return List.of(
            Map.of("nombre", "EcoDiseño Textil", "rubro", "Ropa de algodón reciclado", "contacto", "contacto@ecodiseno.cl"),
            Map.of("nombre", "ReMuebles Chile", "rubro", "Muebles con pallets y madera recuperada", "contacto", "ventas@remuebles.cl")
        );
    }
}