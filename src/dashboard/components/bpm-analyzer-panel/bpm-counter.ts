import * as Polymer from '@polymer/polymer'

import BeatDetektor from './BeatDetektor'

class BPMCounter extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <style>
      .c-bpm-counter {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;

        margin: 0 auto 1rem;
        font-size: 2em;
      }
    </style>

    <div class="c-bpm-counter">
      {{bpm}} bpm
    </div>
    `
  }

  static get is() {
    return 'bpm-counter'
  }

  static get properties() {
    return {
      deviceId: String,
      deviceConstraints: {
        type: Object,
        computed: '_getDeviceConstraints(deviceId)',
      },
      bpm: {
        type: Number,
        reflectToAttribute: true,
        notify: true,
        value: 90,
      },
      sampleSize: {
        type: Number,
        value: 2048,
      },
    }
  }

  deviceId: string = ''
  bpm: number = 90
  sampleSize: number = 2048

  _context?: AudioContext
  _analyzer?: AnalyserNode
  _beatDetektor?: any
  _streamNode?: MediaStreamAudioSourceNode
  _rafTimeout?: number

  _getDeviceConstraints(deviceId: string): MediaStreamConstraints {
    return {
      audio: {
        deviceId: {
          exact: deviceId,
        },
      },
    }
  }

  async _start() {
    this._context = new AudioContext()
    this._analyzer = this._context.createAnalyser()
    this._analyzer.fftSize = this.sampleSize

    this._beatDetektor = new BeatDetektor(undefined, undefined, undefined)

    const stream = await navigator.mediaDevices.getUserMedia(this._getDeviceConstraints(this.deviceId))
    this._streamNode = this._context.createMediaStreamSource(stream)

    this._streamNode.connect(this._analyzer)

    this._scheduleMeasurement()
  }

  _stop() {
    this._cancelMeasurement()
    this._analyzer?.disconnect()
    this._streamNode?.disconnect()
  }

  _scheduleMeasurement() {
    this._rafTimeout = window.requestAnimationFrame(this._measureBPM.bind(this))
  }

  _cancelMeasurement() {
    window.cancelAnimationFrame(this._rafTimeout!)
  }

  _measureBPM(timestamp: number) {
    const data = new Uint8Array(this.sampleSize)

    this._analyzer!.getByteFrequencyData(data)

    this._beatDetektor.process(timestamp / 1000, data)
    this.set('bpm', this._beatDetektor.win_bpm_int_lo)

    this._scheduleMeasurement()
  }

  connectedCallback() {
    super.connectedCallback()
    this._start()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._stop()
  }
}

customElements.define(BPMCounter.is, BPMCounter)
