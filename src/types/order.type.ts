export interface CreateOrderDetailPayload {
    trxId: string
    destination: string
    grossAmount: number
    userId: string
}

export interface CreateOrderItemPayload {
    itemId: string
    orderDetailId: string
}