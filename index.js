const Vue = window.Vue;

const styleEl = document.createElement('style');
styleEl.innerHTML = `
  .row {
    border: 1px solid #000;
    padding: 16px;
    display: flex;
    justify-content: space-evenly;
  }
  video {
    border: 1px solid #000;
  }
  .videojs video {
    width: 100%;
    height: 100%;
  }
`;
document.head.appendChild(styleEl);

const App = {
  template: `<div class="app" style="display: flex; flex-direction: column;">
  <input v-model="m3u8s[0]" style="margin-bottom: 16px;" />
  <input v-model="m3u8s[1]" style="margin-bottom: 16px;" />
  <button @click="playVideo" style="margin-bottom: 16px;">play (click and wait 10s)</button>
  <div>vanilla (not working)</div>
  <div class="row vanilla">
    <video ref="vanilla0" controls width="320" height="240">
      <source />
    </video>
    <video ref="vanilla1" controls width="320" height="240">
      <source />
    </video>
  </div>
  <div>hls</div>
  <div class="row hls">
    <video ref="hls0" width="320" height="240" />
    <video ref="hls1" width="320" height="240" />
  </div>
  <div>videojs</div>
  <div class="row videojs">
    <div style="width: 320px; height: 240px;">
      <video ref="videojs0" controls />
    </div>
    <div style="width: 320px; height: 240px;">
      <video ref="videojs1" controls />
    </div>
  </div>
</div>`,
  data() {
    return {
      m3u8s: [
        'https://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8',
      ],
      hlsPlayers: [
        null,
        null,
      ],
      videojsPlayers: [
        null,
        null,
      ],
    };
  },
  mounted() {
    this.m3u8s.forEach((_, i) => {
      this.hlsPlayers[i] = new Hls();
      this.videojsPlayers[i] = videojs(this.$refs[`videojs${i}`], { controls: false, children: [] });
      this.videojsPlayers[i].width(320);
      this.videojsPlayers[i].width(240);
    });
  },
  methods: {
    playVideo() {
      this.m3u8s.forEach((m3u8, i) => {
        const vanillaEl = this.$refs[`vanilla${i}`];
        const vanillaSourceEl = vanillaEl.querySelector('source');
        vanillaSourceEl.src = m3u8;
        vanillaSourceEl.type = 'application/x-mpegURL';
        vanillaSourceEl.crossOrigin = 'anonymous';

        const hlsEl = this.$refs[`hls${i}`];
        const hls = this.hlsPlayers[i];
        hls.loadSource(m3u8);
        hls.attachMedia(hlsEl);

        const vp = this.videojsPlayers[i];
        vp.width
        vp.src({ src: m3u8, type: 'application/x-mpegURL' });
      });

      setTimeout(() => {
        this.m3u8s.forEach((_, i) => {
          const vanillaEl = this.$refs[`vanilla${i}`];
          vanillaEl.play();

          const hlsEl = this.$refs[`hls${i}`];
          hlsEl.play();

          this.videojsPlayers[i].play();
        });
      }, 10000);
    },
  },
};

Promise.resolve().then(async () => {
  const vue = new Vue({ render: (h) => h(App) })
  vue.$mount('#root');
  window.vue = vue;
});
