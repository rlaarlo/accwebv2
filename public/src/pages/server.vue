<template>
    <layout>
        <div class="title">
            <h1>{{servername}}</h1>
            <div class="menu">
                <button v-on:click="$router.push('/')"><i class="fas fa-arrow-left"></i> {{$t("back_to_list")}}</button>
            </div>
        </div>

        <!-- Stepper -->
        <div class="wizard-stepper">
            <div
                v-for="(step, i) in steps"
                :key="step.key"
                class="wizard-step"
                :class="{ active: currentStep === i, done: i < currentStep }"
                v-on:click="goTo(i)"
            >
                <div class="wizard-step-bullet">
                    <i v-if="i < currentStep" class="fas fa-check"></i>
                    <span v-else>{{ i + 1 }}</span>
                </div>
                <div class="wizard-step-label">
                    <i :class="['fas', step.icon]"></i>
                    <span>{{ $t(step.key) }}</span>
                </div>
            </div>
        </div>

        <!-- Step content -->
        <div class="wizard-content">
            <div v-show="currentStep === 0">
                <h2>{{ $t('step_general_title') }}</h2>
                <p class="wizard-hint">{{ $t('step_general_hint') }}</p>
                <field :label="$t('servername_label')" v-model="servername"></field>
                <accweb ref="accweb"></accweb>
            </div>

            <div v-show="currentStep === 1">
                <h2>{{ $t('step_basic_title') }}</h2>
                <p class="wizard-hint">{{ $t('step_basic_hint') }}</p>
                <basic ref="basic"></basic>
            </div>

            <div v-show="currentStep === 2">
                <h2>{{ $t('step_settings_title') }}</h2>
                <p class="wizard-hint">{{ $t('step_settings_hint') }}</p>
                <settings ref="settings"></settings>
            </div>

            <div v-show="currentStep === 3">
                <h2>{{ $t('step_event_title') }}</h2>
                <p class="wizard-hint">{{ $t('step_event_hint') }}</p>
                <event ref="event"></event>
            </div>

            <div v-show="currentStep === 4">
                <h2>{{ $t('step_eventrules_title') }}</h2>
                <p class="wizard-hint">{{ $t('step_eventrules_hint') }}</p>
                <eventrules ref="eventrules"></eventrules>
            </div>

            <div v-show="currentStep === 5">
                <h2>{{ $t('step_entrylist_title') }}</h2>
                <p class="wizard-hint">{{ $t('step_entrylist_hint') }}</p>
                <entrylist ref="entrylist"></entrylist>
            </div>

            <div v-show="currentStep === 6">
                <h2>{{ $t('step_bop_title') }}</h2>
                <p class="wizard-hint">{{ $t('step_bop_hint') }}</p>
                <bop ref="bop"></bop>
            </div>

            <div v-show="currentStep === 7">
                <h2>{{ $t('step_assist_title') }}</h2>
                <p class="wizard-hint">{{ $t('step_assist_hint') }}</p>
                <assistrules ref="assistrules"></assistrules>
            </div>
        </div>

        <!-- Bottom nav -->
        <div class="wizard-nav">
            <button v-on:click="back" :disabled="currentStep === 0" :class="{ disabled: currentStep === 0 }">
                <i class="fas fa-chevron-left"></i> {{ $t('prev') }}
            </button>

            <div class="wizard-nav-meta">
                {{ $t('step') }} {{ currentStep + 1 }} / {{ steps.length }}
            </div>

            <div class="wizard-nav-right">
                <button v-if="currentStep < steps.length - 1" class="primary" v-on:click="next">
                    {{ $t('next') }} <i class="fas fa-chevron-right"></i>
                </button>
                <button v-if="is_admin && !is_running" class="primary" v-on:click="save">
                    <i class="fas fa-save"></i> {{ $t('save') }}
                </button>
            </div>
        </div>
    </layout>
</template>

<script>
import axios from "axios";
import {layout, end, accweb, basic, settings, event, eventrules, entrylist, bop, assistrules, field} from "../components";

export default {
    components: {layout, end, accweb, basic, settings, event, eventrules, entrylist, bop, assistrules, field},
    data() {
        return {
            currentStep: 0,
            steps: [
                { key: "step_general",    icon: "fa-server" },
                { key: "step_basic",      icon: "fa-network-wired" },
                { key: "step_settings",   icon: "fa-cog" },
                { key: "step_event",      icon: "fa-flag-checkered" },
                { key: "step_eventrules", icon: "fa-gavel" },
                { key: "step_entrylist",  icon: "fa-users" },
                { key: "step_bop",        icon: "fa-balance-scale" },
                { key: "step_assist",     icon: "fa-life-ring" }
            ],
            id: "",
            servername: "Server name (by accweb)",
            is_running: false
        };
    },
    mounted() {
        this.id = this.$route.query.id;

        if (this.id) {
            this.loadServer();
        }
    },
    methods: {
        goTo(i) {
            this.currentStep = i;
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        next() {
            if (this.currentStep < this.steps.length - 1) {
                this.goTo(this.currentStep + 1);
            }
        },
        back() {
            if (this.currentStep > 0) {
                this.goTo(this.currentStep - 1);
            }
        },
        loadServer() {
            axios.get("/api/instance/" + this.id)
            .then(r => {
                let settings = r.data.acc.settings;
                settings.passwordIsEmpty = r.data.accExtraSettings.passwordIsEmpty;
                settings.adminPasswordIsEmpty = r.data.accExtraSettings.adminPasswordIsEmpty;
                settings.spectatorPasswordIsEmpty = r.data.accExtraSettings.spectatorPasswordIsEmpty;

                this.is_running = r.data.is_running;
                this.servername = r.data.acc.settings.serverName;
                this.$refs.accweb.setData(r.data.accWeb);
                this.$refs.basic.setData(r.data.acc.configuration);
                this.$refs.settings.setData(r.data.acc.settings);
                this.$refs.event.setData(r.data.acc.event);
                this.$refs.eventrules.setData(r.data.acc.eventRules);
                this.$refs.entrylist.setData(r.data.acc.entrylist);
                this.$refs.bop.setData(r.data.acc.bop);
                this.$refs.assistrules.setData(r.data.acc.assistRules);
            });
        },
        save() {
            let accWeb = this.$refs.accweb.getData();
            let configuration = this.$refs.basic.getData();
            let settings = this.$refs.settings.getData();
            let event = this.$refs.event.getData();
            let eventRules = this.$refs.eventrules.getData();
            let entrylist = this.$refs.entrylist.getData();
            let bop = this.$refs.bop.getData();
            let assistrules = this.$refs.assistrules.getData();
            let data = {
                accWeb,
                acc: {
                    configuration,
                    settings,
                    event,
                    eventRules,
                    entrylist,
                    bop,
                    assistrules
                },
                accExtraSettings: {
                    passwordIsEmpty: settings.passwordIsEmpty,
                    adminPasswordIsEmpty: settings.adminPasswordIsEmpty,
                    spectatorPasswordIsEmpty: settings.spectatorPasswordIsEmpty,
                }
            };
            data.acc.settings.serverName = this.servername;

            let url = "/api/instance";
            if (this.id) {
                url += "/" + this.id;
            }

            axios.post(url, data)
            .then(() => {
                this.$router.push("/");
            })
            .catch(e => {
                this.$store.commit("toast", this.$t("save_error") + ' ERROR: ' + e.response.data.error);
            });
        }
    }
}
</script>

<i18n>
{
    "en": {
        "save": "Save",
        "cancel": "Cancel",
        "back": "Back",
        "back_to_list": "Back to list",
        "prev": "Previous",
        "next": "Next",
        "step": "Step",
        "servername_label": "Server name",
        "save_error": "Error saving configuration, please check your input.",

        "step_general":    "General",
        "step_basic":      "Network",
        "step_settings":   "Settings",
        "step_event":      "Event",
        "step_eventrules": "Event Rules",
        "step_entrylist":  "Entry List",
        "step_bop":        "BOP",
        "step_assist":     "Assists",

        "step_general_title":    "General",
        "step_general_hint":     "Server name and accweb-specific options (auto-start, identifiers, etc).",
        "step_basic_title":      "Network configuration",
        "step_basic_hint":       "TCP/UDP ports, public IP, registration to the ACC backend.",
        "step_settings_title":   "Server settings",
        "step_settings_hint":    "Passwords, car group, track medals, safety rating and rank requirements.",
        "step_event_title":      "Event",
        "step_event_hint":       "Pick the track, weather conditions and define the race sessions.",
        "step_eventrules_title": "Event rules",
        "step_eventrules_hint":  "Pit stop strategy: stint length, mandatory stops, refuelling and tyre rules.",
        "step_entrylist_title":  "Entry list",
        "step_entrylist_hint":   "Pre-defined drivers, car numbers, reserved slots and admins.",
        "step_bop_title":        "Balance of Performance",
        "step_bop_hint":         "Per-track and per-car ballast / restrictor adjustments.",
        "step_assist_title":     "Assist rules",
        "step_assist_hint":      "Driving assists allowed on the server (ABS, stability control, ideal line)."
    },
    "id": {
        "save": "Simpan",
        "cancel": "Batal",
        "back": "Kembali",
        "back_to_list": "Kembali ke daftar",
        "prev": "Sebelumnya",
        "next": "Berikutnya",
        "step": "Langkah",
        "servername_label": "Nama server",
        "save_error": "Gagal menyimpan konfigurasi, periksa input Anda.",

        "step_general":    "Umum",
        "step_basic":      "Jaringan",
        "step_settings":   "Pengaturan",
        "step_event":      "Event",
        "step_eventrules": "Aturan Event",
        "step_entrylist":  "Daftar Peserta",
        "step_bop":        "BOP",
        "step_assist":     "Bantuan",

        "step_general_title":    "Umum",
        "step_general_hint":     "Nama server dan opsi khusus accweb (auto-start, identifier, dll).",
        "step_basic_title":      "Konfigurasi jaringan",
        "step_basic_hint":       "Port TCP/UDP, IP publik, registrasi ke backend ACC.",
        "step_settings_title":   "Pengaturan server",
        "step_settings_hint":    "Password, grup mobil, medali sirkuit, syarat safety rating dan ranking.",
        "step_event_title":      "Event",
        "step_event_hint":       "Pilih sirkuit, cuaca, dan tentukan sesi balapan.",
        "step_eventrules_title": "Aturan event",
        "step_eventrules_hint":  "Strategi pit stop: panjang stint, wajib pit, isi bahan bakar dan aturan ban.",
        "step_entrylist_title":  "Daftar peserta",
        "step_entrylist_hint":   "Driver yang sudah ditentukan, nomor mobil, slot reservasi, dan admin.",
        "step_bop_title":        "Balance of Performance",
        "step_bop_hint":         "Penyesuaian ballast / restrictor per sirkuit dan per mobil.",
        "step_assist_title":     "Aturan bantuan",
        "step_assist_hint":      "Bantuan mengemudi yang diizinkan (ABS, stability control, ideal line)."
    }
}
</i18n>
