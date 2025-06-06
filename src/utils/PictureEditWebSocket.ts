export default class PictureEditWebSocket {
    private pictureId: number
    private socket: WebSocket | null
    private eventHandlers: any

    constructor(pictureId: number) {
        this.pictureId = pictureId
        this.socket = null
        this.eventHandlers = {}
    }

    /**
     * Initialise WebSocket connection
     */
    connect(): void {
        const url = `ws://${import.meta.env.VITE_BASE_URL}/ws/picture/edit?pictureId=${this.pictureId}`
        this.socket = new WebSocket(url)

        // Add cookie
        this.socket.binaryType = 'blob'

        // Add event when successfully connected
        this.socket.onopen = () => {
            this.triggerEvent('open')
        }

        // Listen to messages
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data)

            // Trigger event according to its type
            const type = message.type
            this.triggerEvent(type, message)
        }

        // Add event when closing
        this.socket.onclose = (event) => {
            this.triggerEvent('close', event)
        }

        // Listen to errors
        this.socket.onerror = (error) => {
            this.triggerEvent('error', error)
        }
    }


    disconnect(): void {
        if (this.socket) {
            this.socket.close()
        }
    }

    sendMessage(msg: object): void {
        if(this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(msg))
        } else {
            console.error("WebSocket is not connected, fail to send: ", msg)
        }
    }

    /**
     * Records a callback function based on the given message type
     * @param type Message type (INFO, ERROR etc.)
     * @param handler A callback function to handle events
     */
    on(type: string, handler: (data?: any) => void): void {
        if (!this.eventHandlers[type]) {
            this.eventHandlers[type] = []
        }
        this.eventHandlers[type].push(handler)
    }


    /**
     * Trigger a particular type of event
     * @param type Message type (INFO, ERROR etc.)
     * @param data Message data
     */
    triggerEvent(type: string, data ?: any): void {
        const handlers = this.eventHandlers[type]
        if (handlers) {
            handlers.forEach(handler => handler(data))
        }
    }
}