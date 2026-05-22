<template>
    <footer class="end">
        <div class="end-row">
            <div class="end-brand">
                <i class="fas fa-flag-checkered"></i>
                <span class="end-brand-name">accweb</span>
                <span class="end-version" title="Version">v{{ version }}</span>
                <span class="end-commit" title="Build commit">{{ commit }}</span>
            </div>

            <div class="end-links">
                <a href="https://github.com/assetto-corsa-web/accweb" target="_blank" rel="noopener">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="https://github.com/assetto-corsa-web/accweb/wiki" target="_blank" rel="noopener">
                    <i class="fas fa-book"></i> {{ $t('docs') }}
                </a>
                <a href="https://discord.gg/AVWdF56t6c" target="_blank" rel="noopener">
                    <i class="fab fa-discord"></i> Discord
                </a>
                <a href="https://github.com/assetto-corsa-web/accweb/issues" target="_blank" rel="noopener">
                    <i class="fas fa-bug"></i> {{ $t('report_issue') }}
                </a>
            </div>
        </div>

        <div class="end-meta">
            {{ $t('made_with') }}
            <i class="fas fa-heart"></i>
            {{ $t('for_acc_sim_racers') }}
            &nbsp;&middot;&nbsp;
            <a href="https://github.com/assetto-corsa-web/accweb/blob/master/LICENSE" target="_blank" rel="noopener">MIT License</a>
        </div>
    </footer>
</template>

<script>
/* global __APP_VERSION__, __APP_COMMIT__ */
export default {
    data() {
        return {
            version: typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev",
            commit:  typeof __APP_COMMIT__  !== "undefined" ? __APP_COMMIT__  : "unknown"
        };
    }
}
</script>

<i18n>
{
    "en": {
        "docs": "Docs",
        "report_issue": "Report issue",
        "made_with": "Made with",
        "for_acc_sim_racers": "for ACC sim racers"
    },
    "id": {
        "docs": "Dokumentasi",
        "report_issue": "Laporkan masalah",
        "made_with": "Dibuat dengan",
        "for_acc_sim_racers": "untuk para sim racer ACC"
    }
}
</i18n>
