<template>
    <div class="server" v-bind:class="{running: formattedServerClientCount > 0}">
        <div class="content">
            <div class="name">
                {{server.name}}
                <div class="actions">
                    <span v-if="is_ro">
                        <i class="fas fa-tv" v-if="server.pid" v-on:click="live" :title="$t('view_live')"></i>
                    </span>
                    <span v-if="!ro">
                        <i class="fas fa-cog" v-on:click="edit" :title="$t('change_config')"></i>
                        <i class="fas fa-terminal" v-on:click="logs" :title="$t('view_logs')"></i>
                        <i class="fas fa-copy" v-on:click="copyConfig" v-if="is_admin" :title="$t('copy_config')"></i>
                        <i class="fas fa-file-download" v-on:click="exportConfig" :title="$t('export_config')"></i>
                        <i class="fas fa-trash" v-on:click="deleteServer" v-if="is_admin" :title="$t('delete_server')"></i>
                    </span>
                </div>
            </div>
            <div class="info">
                <span v-if="server.pid"><b>PID:</b> {{server.pid}} &nbsp;&bull;&nbsp;</span>
                <b>UDP:</b> {{server.udpPort}} &nbsp;&bull;&nbsp;
                <b>TCP:</b> {{server.tcpPort}} &nbsp;&bull;&nbsp;
                <b>{{$t("track")}}:</b> {{server.track}}
                <span v-if="!ro">&nbsp;&bull;&nbsp; <b>{{$t("configuration_directory")}}:</b> {{server.id}}</span>
            </div>
            <div class="info state">
                <b>{{$t("state")}}: </b>
                <span v-if="server.pid">{{$t(server.serverState)}}</span>
                <span v-else>{{$t("offline")}}</span>
                &nbsp;&bull;&nbsp;
                <b>{{$t("number_of_drivers")}}: </b>{{server.pid ? formattedServerClientCount : '-'}} &nbsp;&bull;&nbsp;
                <b>{{$t("session")}}: </b>
                <span v-if="server.pid && server.sessionType">{{server.sessionType}} ({{server.sessionPhase}}) - {{server.sessionRemaining}} min(s)</span>
                <span v-else-if="server.pid">{{$t('not_detected')}}</span>
                <span v-else>-</span>
            </div>
        </div>
        <button class="start" v-on:click="start" v-if="is_mod && !ro && !server.pid">{{$t("start_server")}}</button>
        <button class="stop" v-on:click="stop" v-if="is_mod && !ro && server.pid">{{$t("stop_server")}}</button>
        <div class="online" v-if="ro && server.pid">{{$t("running")}}</div>
        <div class="offline" v-if="ro && !server.pid">{{$t("offline")}}</div>
    </div>
</template>

<style scoped>
.content {
    width: 100%;
    min-width: 0;
}

.info {
    color: #a3b1c6;
    font-size: 12px;
    line-height: 1.6;
}

.info b {
    color: #e6ecf5;
    font-weight: 600;
}

.state {
    margin-top: 8px;
    padding: 8px 10px;
    background: rgba(56, 189, 248, 0.06);
    border-left: 3px solid #38bdf8;
    border-radius: 6px;
}

.state b {
    color: #38bdf8;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.4px;
}

.running {
    border-color: rgba(74, 222, 128, 0.35) !important;
    box-shadow: 0 0 0 1px rgba(74, 222, 128, 0.18), 0 8px 24px rgba(0, 0, 0, 0.3);
}

.actions {
    display: inline-flex;
    gap: 12px;
    float: right;
    margin-right: 4px;
}

.actions .fas {
    cursor: pointer;
    color: #6c7a93;
    transition: color 150ms ease;
}

.actions .fas:hover {
    color: #38bdf8;
}
</style>

<script>
import axios from "axios";

export default {
    props: ["server", "ro"],
    computed: {
        formattedServerClientCount: function () {
            return this.server.serverState === 'not_registered' ? '-' : this.server.nrClients;
        }
    },
    methods: {
        edit() {
            this.$router.push(`/server?id=${this.server.id}`);
        },
        logs() {
            this.$router.push(`/logs?id=${this.server.id}`);
        },
        live() {
            this.$router.push(`/live?id=${this.server.id}`);
        },
        copyConfig() {
            axios.post(`/api/instance/${this.server.id}/clone`)
            .then(() => {
                this.$emit("copied");
            })
            .catch(e => {
                this.$store.commit("toast", this.$t("copy_server_error"))
            });
        },
        exportConfig() {
            let link = document.createElement("a");
            link.setAttribute("type", "hidden");
            link.href = `/api/instance/${this.server.id}/export?token=${this.$store.state.auth.token}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
        deleteServer() {
            if (!window.confirm(this.$t("confirm_delete_server"))) {
                return;
            }

            axios.delete(`/api/instance/${this.server.id}`)
            .then(() => {
                this.$emit("deleted");
            })
            .catch(e => {
                this.$store.commit("toast", this.$t("delete_server_error"))
            });
        },
        start() {
            axios.post(`/api/instance/${this.server.id}/start`)
            .then(() => {
                this.$emit("started");
            })
            .catch(e => {
                this.$store.commit("toast", this.$t("start_server_error", {error: e.response.data.error}))
            });
        },
        stop() {
            axios.post(`/api/instance/${this.server.id}/stop`)
            .then(() => {
                this.$emit("stopped");
            })
            .catch(e => {
                this.$store.commit("toast", this.$t("stop_server_error", {error: e.response.data.error}))
            });
        }
    }
}
</script>

<i18n>
{
    "en": {
        "start_server": "Start",
        "stop_server": "Stop",
        "change_config": "Change config",
        "view_logs": "View logs",
        "view_live": "View live",
        "copy_config": "Copy config",
        "export_config": "Export config",
        "delete_server": "Delete server",
        "confirm_delete_server": "Do you really want to delete this server?",
        "copy_server_error": "Error copying server configuration.",
        "delete_server_error": "Error deleting server configuration.",
        "start_server_error": "Error starting server, please check the logs. ERROR: {error}",
        "stop_server_error": "Error stopping server. ERROR: {error}",
        "track": "Track",
        "configuration_directory": "Config dir",
        "running": "Running",

        "state": "State",
        "number_of_drivers": "Drivers",
        "session": "Session",
        "not_detected": "Not detected",

        "offline": "Offline",
        "starting": "Starting",
        "not_registered": "Waiting for events",
        "online": "Online"
    }
}
</i18n>
