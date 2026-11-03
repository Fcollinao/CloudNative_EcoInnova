package cloudnativeguia.demo.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_PUNTOS = "puntos-asignacion.queue";
    public static final String QUEUE_PYMES = "pymes-notificacion.queue";
    public static final String QUEUE_DLQ = "ecoinnova.dlq";

    public static final String EXCHANGE_EVENTS = "ecoinnova.events.exchange";
    public static final String EXCHANGE_DLX = "ecoinnova.dlx.exchange";

    public static final String ROUTING_KEY_PUNTOS = "solicitud.reciclaje.creada";
    public static final String ROUTING_KEY_DLQ = "solicitud.error";

    // --- COLAS ---
    @Bean
    public Queue puntosQueue() {
        return QueueBuilder.durable(QUEUE_PUNTOS)
                .withArgument("x-dead-letter-exchange", EXCHANGE_DLX)
                .withArgument("x-dead-letter-routing-key", ROUTING_KEY_DLQ)
                .build();
    }

    @Bean
    public Queue pymesQueue() {
        return QueueBuilder.durable(QUEUE_PYMES).build();
    }

    @Bean
    public Queue dlqQueue() {
        return QueueBuilder.durable(QUEUE_DLQ).build();
    }

    // --- EXCHANGES ---
    @Bean
    public TopicExchange eventsExchange() {
        return new TopicExchange(EXCHANGE_EVENTS, true, false);
    }

    @Bean
    public DirectExchange dlxExchange() {
        return new DirectExchange(EXCHANGE_DLX, true, false);
    }

    // --- BINDINGS ---
    @Bean
    public Binding puntosBinding(Queue puntosQueue, TopicExchange eventsExchange) {
        return BindingBuilder.bind(puntosQueue).to(eventsExchange).with(ROUTING_KEY_PUNTOS);
    }

    @Bean
    public Binding dlqBinding(Queue dlqQueue, DirectExchange dlxExchange) {
        return BindingBuilder.bind(dlqQueue).to(dlxExchange).with(ROUTING_KEY_DLQ);
    }

    @Bean
    public RabbitAdmin rabbitAdmin(org.springframework.amqp.rabbit.connection.ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }
}

