<template>
    <article>
        <div>
            {{ username }}
            <button v-if = "$store.state.username !== username && this.doesNotFollow(username)" class="btn btn--primary mx-auto" @click="followRequest">Follow</button>
            <button v-if = "$store.state.username !== username && !this.doesNotFollow(username)" class="btn btn--primary mx-auto" @click="unfollowRequest">Unfollow</button>
        </div>
        <section class="alerts">
            <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
    </article>
</template>

<script>

export default {
    name: "UserFollowResult",
    props: {
        username: String,
    },
    data() {
        return {
            alerts: {} // Displays success/error messages encountered during freet modification
        }
    },
    methods: {
        doesNotFollow(username) {
            return (this.$store.state.followees.filter(followeeUsername => followeeUsername == username)).length == 0
        },
        async unfollowRequest() {
            /**
             * POST /api/follow?username=username
             */
            const params = {
                method: 'DELETE',
                message: "Successfully unfollowed " + this.username,
                callback: () => {
                    this.$set(this.alerts, params.message, "success");
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                    this.$store.commit('deleteFromFollowees', this.username);
                    this.$store.commit('refreshFollowees', true);
                }
            }
            const response = await this.requestFollow(params);
            
        },
        async followRequest() {
            /** 
             * Gets list of users who follow this user.
             * POST /api/follow?username=username
            */
            const params = {
                method: 'POST',
                message: "Successfully followed " + this.username,
                callback: () => {
                    this.$set(this.alerts, params.message, "success");
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                    console.log("adding" + this.username + " to followees");
                    this.$store.commit('addToFollowees', this.username);
                    this.$store.commit('refreshFollowees', true);
                }
            }
            const response = await this.requestFollow(params);
        },
        async requestFollow(params) {
            /**
             * Adds and deletes follow.
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
                let r = await fetch(`/api/follow?username=${this.username}`, options);
                if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
                return res;
                }
                
                this.$store.commit('refreshFollowees', true);
                params.callback();

                const response = await r.json();
                return response;
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async getAllFollowees() {
            /** 
             * Gets list of users who follow this user.
             * GET /api/follow/followees/:username?
            */
            const params = {
                method: 'GET'
            }
            const response = await this.requestAllFollowees(params);
            this.followees = response.map(x => x.username);
        },
        async requestAllFollowees(params) {
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
                console.log(response);
                return response;
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>