export interface ModalData {
  title: string
  message: string
  status: PaymentStatus
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface PaymentResponse {
  status: PaymentStatus
  reference: string
}