<template>
    <transition name="fade">
      <div class="modal" v-if="show">
        <div class="modal-backdrop" @click="closeModal()"/>
  
        <div class="modal-dialog">
            <div class="modal-header">
                <slot name="header"/>
                <button type="button" class="modal__close" @click="closeModal()">
                </button>
            </div>
    
            <div class="modal-body">
                <slot name="body"/>
            </div>
    
            <div class="modal-footer">
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

<style scoped>
.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	background-color: rgba(32, 29, 29, 0.2);
	
	display: flex;
	align-items: center;
	justify-content: center;
}

/* .header.button {
  background-color: floralwhite;
} */

.modal > .modal-dialog {
		background-color:blanchedalmond;
		padding: 32px;
	}
</style>
  