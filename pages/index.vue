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
  if (!currentTransaction) return {
    status: PaymentStatus.PENDING,
    ...messages.value[PaymentStatus.PENDING]
  }

  return {
    status: currentTransaction.status,
    ...messages.value[currentTransaction.status]
  }
})

watch(transaction, (currentTransaction) => {
  if (!currentTransaction) return

  const {status, reference} = currentTransaction
  const {email} = route.query

  router.push({
    path: '/',
    query: { status, reference, email }
  })
}, { deep: true })

onMounted(() => {
  const {email, reference} = route.query

  const connectSocket = io(config.socketUrl, {
    reconnectionDelay: 5000,
    reconnectionDelayMax: 10000,
    auth: { email }
  })

  connectSocket.on('connect', () => {
    const {data: transactionRes} = useTransaction(reference as string)

    watch(transactionRes, ({data}) => {
      if (data) transaction.value = data
    })
  })

  connectSocket.on(
      'paymentStatus',
      ({status, reference: resReference}: Transaction) => {
        if (reference === resReference && transaction.value)
          transaction.value.status = status
      })

  socket.value = connectSocket
})

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