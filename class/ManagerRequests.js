

export class ManagerRequests {
    ipServer = null;
    setterServerConnected = null;

    setIpServer (ip) {
        this.ipServer = ip;
    }

    setSetterServerConnected (setter) {
        this.setterServerConnected = setter;
    }
}