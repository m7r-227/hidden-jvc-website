import Vue from 'vue';

import { parse } from 'hidden-jvc-jvcode';

import user from './repositories/user.js';
import logs from './repositories/logs.js';
import reports from './repositories/reports';
import hidden from './repositories/hidden.js';
import application from './repositories/application';
import notifications from './repositories/notifications';

import getUserClass from './helpers/getUserClass.js';

import { mapState } from 'vuex';

Vue.mixin({
    data: () => ({
        repos: {
            user,
            logs,
            hidden,
            reports,
            application,
            notifications
        }
    }),

    computed: {
        ...mapState('user', ['isAdmin'])
    },

    methods: {
        setLoading(loading) {
            this.$store.commit('application/setLoading', loading);
        },

        openErrorDialog(message) {
            this.$store.commit('application/openErrorDialog', message);
        },

        getUserClass(user) {
            return getUserClass(user);
        },

        parseJvcode(content) {
            return parse(content);
        },

        closeErrorDialog() {
            this.$store.commit('application/closeErrorDialog');
        }
    }
});