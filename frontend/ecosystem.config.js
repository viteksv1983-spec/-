module.exports = {
    apps: [{
        name: "instagram-scraper",
        script: "./scrape-reviews.js",
        watch: false,
        max_memory_restart: "600M",
        exp_backoff_restart_delay: 100,
        env: {
            NODE_ENV: "production",
        }
    }]
}
