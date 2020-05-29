import * as Polymer from '@polymer/polymer'
import '@polymer/paper-button/paper-button'

nodecg.Replicant('bpm', 'nodecg-bpm-analyzer', {
  persistent: false,
})

class BPMAnalyzer extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <div>
      measure it {{isMeasuring}}
    </div>

    <paper-button raised="" on-tap="startMeasuring">
      Start
    </paper-button>
`
  }

  static get is() {
    return 'bpm-analyzer'
  }

  static get properties() {
    return {
      isMeasuring: {
        type: Boolean,
        value: false,
      },
      device: {
        type: String,
        value: '',
      },
    }
  }

  isMeasuring: boolean = false
  device: string = ''

  startMeasuring() {
    this.isMeasuring = true
  }

  stopMeasuring() {
    this.isMeasuring = false
  }
}

customElements.define(BPMAnalyzer.is, BPMAnalyzer)
