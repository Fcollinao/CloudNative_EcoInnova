package cloudnativeguia.demo.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class SolicitudConsumer {

    @RabbitListener(queues = "puntos-asignacion.queue")
    public void procesarSolicitudReciclaje(String mensajeJson) {
        System.out.println("=================================================");
        System.out.println("   [EVENTO RECIBIDO DE RABBITMQ]");
        System.out.println("   Payload JSON: " + mensajeJson);
        System.out.println("   Estado: Procesando puntos y ecomonedas en BD...");
        System.out.println("=================================================");
    }
}

