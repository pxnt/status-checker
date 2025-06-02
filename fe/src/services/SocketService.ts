import { io, Socket } from 'socket.io-client'
import { useAuth } from '@clerk/vue'

class SocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect() {
    try {
      // Get backend URL from environment or use default
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      
      this.socket = io(backendUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      })

      this.setupEventHandlers()
    } catch (error) {
      console.error('Socket connection error:', error)
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id)
      this.reconnectAttempts = 0
      
      // Join public updates room
      this.joinPublicRoom()

    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
      }
    })
  }

  private joinPublicRoom() {
    // All clients join the public updates room automatically
    // This is handled on the server side when a client connects
  }

  public on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback)
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback)
  }

  public emit(event: string, data?: any) {
    this.socket?.emit(event, data)
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  public reconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
    this.connect()
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false
  }
}

// Export a singleton instance
export default new SocketService()  