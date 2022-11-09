<template>
    <div>
      <button class="btn btn--primary mx-auto" @click="$refs.followeeModal.openModal()">Followees</button>

      <Modal ref="followeeModal">
        <template v-slot:header>
          <h1>View Followees</h1>
        </template>
  
        <template v-slot:body>
            <div v-for="followee in $store.state.followees" v-bind:key="followee.id">
                {{ followee }}
                <!-- <UserFollowResult v-bind:username="followee.username" /> -->
            </div>
        </template>
  
        <template v-slot:footer>
          <div class="d-flex align-items-center justify-content-between">
            <button class="btn btn--secondary" @click="$refs.followeeModal.closeModal()">Close</button>
          </div>
        </template>
      </Modal>
    </div>
</template>

<script>
import Modal from "@/components/common/Modal.vue";
import UserFollowResult from "@/components/Follow/UserFollowResult.vue";

export default {
    name: "FolloweeModal",
    components: {
        Modal,
        UserFollowResult
    },
    mounted() {
        this.$store.commit('refreshFollowees', true);
    }
}
</script>

<style scoped>
button {
  background-color: floralwhite;
}
</style>