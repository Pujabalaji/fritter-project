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
        this.getAllFollowees();
    }, 
    methods: {
        async getAllFollowees() {
            /** 
             * Gets list of users who follow this user.
             * GET /api/follow/followees/:username?
            */
            const params = {
                method: 'GET'
            }
            const response = await this.request(params);
            const followees = response.map(followee => followee.username);
            console.log("followees");
            console.log(this.$store.state.followees);
            this.$store.commit('setFollowees', followees);
            // console.log("followees");
            // console.log(this.$store.state.followees);
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
                const r = await fetch(`/api/follow/followees/${this.$store.state.username}`, options);
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