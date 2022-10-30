<template>
    <transition name="fade">
      <div class="Modal" v-if="show">
        <div class="modal__backdrop" @click="closeModal()"/>
  
        <div class="modal__dialog">
            <div class="modal__header">
                <slot name="header"/>
                <button type="button" class="modal__close" @click="closeModal()">
                </button>
            </div>
    
            <div class="modal__body">
                <slot name="body"/>
            </div>
    
            <div class="modal__footer">
                <slot name="footer"/>
            </div>
        </div>
      </div>
    </transition>
</template>
  
<script lang='ts'>
  export default {
    name: "Modal",
    data() {
      return {
        show: false
      };
    },
    methods: {
      closeModal() {
        this.show = false;
        document.querySelector("body").classList.remove("overflow-hidden");
      },
      openModal() {
        this.show = true;
        document.querySelector("body").classList.add("overflow-hidden");
      }
    }
  };
</script>
  