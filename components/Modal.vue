<template>
  <div class="modal" :class="modalData.status">
    <div class="icon-cover">
      <IconSpinner v-if="modalData.status === PaymentStatus.PENDING" class="spinner"/>
      <img v-if="modalData.status === PaymentStatus.SUCCESS" src="@/assets/icons/checked.png" alt="icon"/>
      <img v-if="modalData.status === PaymentStatus.FAILED" src="@/assets/icons/cancel.png" alt="icon"/>
    </div>
    <p class="title">{{modalData.title}}</p>
    <p class="message">{{modalData.message}}</p>
    <button v-if="modalData.status !== PaymentStatus.PENDING">
      Redirecting in ...{{countdown}}
    </button>
    <p class="footer">{{ config.hostname }}</p>
  </div>
</template>

<script setup lang="ts">
import {ModalData, PaymentStatus} from "~/types";

interface Props {
  modalData: ModalData | null,
}

const config = useRuntimeConfig()
const emit = defineEmits(['countdownComplete'])
const props = withDefaults(defineProps<Props>(), {})

const countdown = useState('countdown', () => 5)
const countdownInterval = useState<any>('countdownInterval', () => null)

const startCountdown = () => {
  countdownInterval.value = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(countdownInterval.value)
      emit('countdownComplete')
    }
  }, 1000)
}

onMounted(() => {
  if (props.modalData?.status !== PaymentStatus.PENDING)
    startCountdown()
})

watch(() => props.modalData?.status, (value) => {
  if (value !== PaymentStatus.PENDING) {
    if (countdownInterval) {
      clearInterval(countdownInterval.value)
      countdown.value = 5
    }

    startCountdown()
  }
})
</script>

<script lang="ts">
export default {
  name: "Modal",
}
</script>

<style scoped lang="scss">
.modal {
  @apply border-0 rounded-3xl p-[2rem] bg-white drop-shadow-xl w-[30rem] text-center relative;

  .icon-cover {
    @apply absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-50%] w-[7rem] h-[7rem];

    .spinner {
      @apply h-full w-full drop-shadow-md;
    }

    img {
      @apply h-full w-full;
    }
  }

  .title {
    @apply text-2xl font-bold mb-4 mt-[4rem];
  }

  .message {
    @apply font-light opacity-75 font-light;
  }

  .footer {
    @apply mt-[1rem] text-sm opacity-50 font-light;
  }

  button {
    @apply font-bold rounded-md text-white px-1.5 py-2.5 w-full mt-8;
  }

  &.pending {
    .title { @apply text-[#F8A827];}
    button {@apply bg-[#F8A827];  }
  }

  &.success {
    .title { @apply text-[#33B97C];}
    button { @apply bg-[#33B97C]; }
  }

  &.failed {
    .title { @apply text-[#F15249];}
    button { @apply bg-[#F15249] }
  }

  @media screen and (max-width: 600px) {
    @apply w-[80%] px-[1rem];

    .icon-cover {
      @apply w-[5rem] h-[5rem];
    }

    .title {
      @apply text-lg mt-[2.5rem];
    }

    .message {
      @apply text-sm;
    }
  }
}
</style>