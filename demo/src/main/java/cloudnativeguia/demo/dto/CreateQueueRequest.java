package cloudnativeguia.demo.dto;

public class CreateQueueRequest {
    private String name;
    private boolean durable = true;

    public CreateQueueRequest() {}

    public CreateQueueRequest(String name, boolean durable) {
        this.name = name;
        this.durable = durable;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isDurable() {
        return durable;
    }

    public void setDurable(boolean durable) {
        this.durable = durable;
    }
}
