export interface ApiResponse<T = any> {
  status: boolean
  message: string
  data?: T
}

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

export interface Transaction {
  status: PaymentStatus
  reference: string
  type: string
}