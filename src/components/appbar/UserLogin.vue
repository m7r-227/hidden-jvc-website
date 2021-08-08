<template>
    <v-dialog :max-width="450">
        <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on" depressed small>
                <v-icon small left> fas fa-user </v-icon>
                Connexion
            </v-btn>
        </template>

        <v-card>
            <v-card-title class="primary py-1">
                Connexion
            </v-card-title>

            <ValidationObserver ref="observer">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <ValidationProvider v-slot="{ errors }" name="Pseudo" rules="required|max:15">
                                <v-text-field v-model.trim="name" label="Pseudo" @keydown.enter="login()" :error-messages="errors" outlined dense />
                            </ValidationProvider>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-content>
                            <ValidationProvider v-slot="{ errors }" name="Mot de passe" rules="required">
                                <v-text-field v-model="password" label="Mot de passe" @keydown.enter="login()" :error-messages="errors" outlined dense type="password" />
                            </ValidationProvider>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </ValidationObserver>

            <v-card-actions>
                <v-btn @click="login()" color="primary" depressed small>
                    Se connecter
                </v-btn>

                <v-spacer />

                <v-btn @click="register()" color="orange darken-4" depressed small>
                    S'inscrire
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'UserLogin',

    data: () => ({
        name: '',
        password: ''
    }),

    methods: {
        async login() {
            const valid = await this.$refs.observer.validate();
            if (!valid) {
                return;
            }

            try {
                this.setLoading(true);

                const body = {
                    name: this.name,
                    password: this.password
                };
                const { jwt, error } = await this.repos.application.login(body);
                if (error) {
                    this.openErrorDialog(error);
                } else {
                    this.$store.commit('user/setJwt', { jwt });
                    this.repos.application.me().then((response) => {
                        this.$store.commit('user/setUser', response.user);
                        this.$store.commit('user/setNotifications', response.notifications);
                    }).catch(console.error);
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        },

        async register() {
            const valid = await this.$refs.observer.validate();
            if (!valid) {
                return;
            }

            try {
                this.setLoading(true);

                const body = {
                    name: this.name,
                    password: this.password
                };
                const { userId, isAdmin, jwt, moderators, error } = await this.repos.application.register(body);
                if (error) {
                    this.openErrorDialog(error);
                } else {
                    this.$store.commit('user/setUser', { userId, isAdmin, jwt, moderators, name: this.name });
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        }
    }
};
</script>