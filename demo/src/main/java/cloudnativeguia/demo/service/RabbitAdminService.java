package cloudnativeguia.demo.service;

import cloudnativeguia.demo.dto.CreateQueueRequest;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.stereotype.Service;

@Service
public class RabbitAdminService {

    private final RabbitAdmin rabbitAdmin;

    public RabbitAdminService(RabbitAdmin rabbitAdmin) {
        this.rabbitAdmin = rabbitAdmin;
    }

    public void crearCola(CreateQueueRequest request) {
        Queue queue;
        if (request.isDurable()) {
            queue = QueueBuilder.durable(request.getName()).build();
        } else {
            queue = new Queue(request.getName(), false);
        }
        rabbitAdmin.declareQueue(queue);
    }

    public boolean eliminarCola(String nombre) {
        return rabbitAdmin.deleteQueue(nombre);
    }
}

