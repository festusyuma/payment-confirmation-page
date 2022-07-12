<template>
  <div class="body">
    <Modal :modal-data="modalData" @countdownComplete="countdownComplete" />
  </div>
</template>

<style lang="scss">
.body {
  @apply h-screen flex items-center justify-center;
}
</style>

<script setup lang="ts">
import {io, Socket} from 'socket.io-client'
import {computed, onMounted, onUnmounted, ref, useRoute, useRouter, useRuntimeConfig, useState} from "#imports";
import {ModalData, PaymentResponse, PaymentStatus} from "~/types";
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
const modalData = computed<ModalData>(() => {
  const status = route.query.status as PaymentStatus
  return {status, ...messages.value[status]}
})

onMounted(() => {
  const {reference, email} = route.query
  const connectSocket = io(config.socketUrl, {
    reconnectionDelay: 5000,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 5,
    auth: { email }
  })

  connectSocket.on('paymentStatus', (data: PaymentResponse) => {
    const {status, reference: resReference} = data
    if (reference === resReference)
      router.push({
        path: '/',
        query: { status, reference, email }
      })
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
  methods: {
    countdownComplete() {

    }
  }
}
</script>