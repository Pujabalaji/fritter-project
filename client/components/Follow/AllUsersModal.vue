<template>
    <div>
      <button class="btn btn--primary mx-auto" @click="$refs.allUsersModal.openModal()">Add Users</button>

      <Modal ref="allUsersModal">
        <template v-slot:header>
          <h1>Add Users</h1>
        </template>
  
        <template v-slot:body>
            <div v-for="user in allUsers">
                <UserFollowResult v-bind:username="user.username" />
            </div>
        </template>
  
        <template v-slot:footer>
          <div class="d-flex align-items-center justify-content-between">
            <button class="btn btn--secondary" @click="$refs.allUsersModal.closeModal()">Cancel</button>
            <button class="btn btn--primary" @click="$refs.allUsersModal.closeModal()">Save</button>
          </div>
        </template>
      </Modal>
    </div>
</template>

<script lang="ts">
import Modal from "@/components/common/Modal.vue"
import UserFollowResult from "@/components/Follow/UserFollowResult.vue"

export default {
    name: "AllUsersModal",
    components: {
        Modal,
        UserFollowResult
    },
    data() {
        return {
            allUsers: this.getAllUsers(),
        }
    }, 
    methods: {
        async getAllUsers() {
            /** 
             * Gets list of users who follow this user.
             * GET /api/follow/followers/:username?
            */
            const params = {
                method: 'GET'
            }
            const response = await this.request(params);
            this.allUsers = response;
        },
        async request(params) {
            /**
             * Submits a request to the freet's endpoint
             * @param params - Options for the request
             * @param params.body - Body for the request, if it exists
             * @param params.callback - Function to run if the the request succeeds
             */
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'}
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch(`/api/users`, options);
                if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
                return res;
                }

                const response = await r.json();
                return response;
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>

<style scoped>
button {
      background-color: floralwhite;
}
</style>