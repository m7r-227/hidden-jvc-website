<template>
    <v-dialog v-model="open" :max-width="700">
        <template v-slot:activator="{ on }">
            <slot name="activator" v-bind:on="on" />
        </template>

        <v-card>
            <v-card-title class="primary py-1">
                Signalement
            </v-card-title>

            <v-card-text class="pt-4 pb-1">
                <ValidationObserver ref="observer">
                    <ValidationProvider v-slot="{ errors, failed }" name="Motif" rules="required">
                        <v-select v-model="reason" :items="types" label="Motif" outlined dense :hide-details="!failed" :error-messages="errors" :menu-props="{ offsetY: true }" class="mb-4" />
                    </ValidationProvider>

                    <ValidationProvider v-slot="{ errors }" name="Remarques" rules="max:2000">
                        <v-textarea v-model="comments" label="Remarques" outlined dense  counter="2000" :error-messages="errors" />
                    </ValidationProvider>
                </ValidationObserver>

                <v-row>
                    <v-col class="text-right">
                        <v-btn @click="submit()" color="primary" depressed small>
                            Valider
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'ReportDialog',

    props: {
        hiddenPostId: { default: null }
    },

    data: () => ({
        open: false,

        reason: null,
        comments: null,

        types: []
    }),

    methods: {
        async submit() {
            try {
                const valid = await this.$refs.observer.validate();
                if (!valid) {
                    return;
                }

                this.setLoading(true);
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        },

        async fetchReasons() {
            try {
                this.setLoading(true);
                const { types, error } = await this.repos.reports.getReportTypes();
                if (error) {
                    this.openErrorDialog(error);
                } else {
                    this.types = types.map((t) => ({ value: t.Id, text: t.Label }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        }
    },

    watch: {
        open(open) {
            if (open) {
                this.fetchReasons();
            }
        }
    }
};
</script>