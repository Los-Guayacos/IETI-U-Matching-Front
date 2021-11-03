import React, { useEffect, useState } from "react"
import { Client } from "@stomp/stompjs"

export default function AppStomp() {
    const [message, setMesage] = useState("");
    const SOCKET_URL = 'http://localhost:8080/ws-message';

    useEffect(() => {
        let currentComponent = this;
        onConnected(currentComponent);
        onDisconnected();
        const client = new Client({
            brokerURL: SOCKET_URL,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: onConnected,
            onDisconnect: onDisconnected
        });

        client.activate();
    });

    const onConnected = (currentComponent) => {
        console.log("Connected!!")
        client.subscribe('/topic/message', function (msg) {
            if (msg.body) {
                var jsonBody = JSON.parse(msg.body);
                if (jsonBody.message) {
                    currentComponent.setState({ messages: jsonBody.message })
                }
            }
        });
    }

    let onDisconnected = () => {
        console.log("Disconnected!!")
    }

    return (
        <div>
            <div>{message}</div>
        </div>
    )
}
