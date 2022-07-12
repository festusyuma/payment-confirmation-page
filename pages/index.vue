<template>
  <div class="body">
    <Modal v-if="modalData" :modal-data="modalData" @countdownComplete="countdownComplete" />
  </div>
</template>

<style lang="scss">
.body {
  @apply h-screen flex items-center justify-center;
}
</style>

<script setup lang="ts">
import {io, Socket} from 'socket.io-client'
import {ModalData, PaymentStatus, Transaction} from "~/types";
import Modal from "~/components/Modal.vue";

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();

const messages = ref({
  [PaymentStatus.PENDING]: {
    title: "Pending",
    message: "Please wait while we verify you're payment"
  },
  [PaymentStatus.SUCCESS]: {
    title: "Successful",
    message: "Payment has been successfully verified. please wait or click the button below if you're not automatically redirected"
  },
  [PaymentStatus.FAILED]: {
    title: "Successful",
    message: "Sorry, we are unable to verify your payment at this time, please reach out to our customer service if you have been charged"
  }
})

const socket = useState<Socket | null>('socket', () => null)
const transaction = useState<Transaction | null>('transaction', () => null)

const modalData = computed<ModalData | null>(() => {
  const currentTransaction = transaction.value
  if (!currentTransaction) return null
  return {
    status: currentTransaction.status,
    ...messages.value[currentTransaction.status]
  }
})

const {data: transactionRes} = useTransaction(route.query.reference as string)

watch(transactionRes, ({data}) => {
  if (data) transaction.value = data
})

watch(transaction, (currentTransaction) => {
  if (!currentTransaction) return

  const {status, reference} = currentTransaction
  const {email} = route.query

  if (currentTransaction.status === PaymentStatus.PENDING) {
    if (socket.value) socket.value.disconnect
    const connectSocket = io(config.socketUrl, {
      reconnectionDelay: 5000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 5,
      auth: { email }
    })

    connectSocket.on(
        'paymentStatus',
        ({status, reference: resReference}: Transaction) => {
          if (reference === resReference && transaction.value)
            transaction.value.status = status
        })

    socket.value = connectSocket
  }

  router.push({
    path: '/',
    query: { status, reference, email }
  })
}, { deep: true })

onUnmounted(() => {
  socket.value?.disconnect()
  socket.value = null
})

</script>

<script lang="ts">
export default {
  name: "IndexPage",

  methods: {
    countdownComplete() {
      console.log('redirected')
    }
  }
}
</script>