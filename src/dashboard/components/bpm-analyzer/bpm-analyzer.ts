import * as Polymer from '@polymer/polymer'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-item/paper-item'

nodecg.Replicant('bpm', 'nodecg-bpm-analyzer', {
  persistent: false,
})

const getAudioInputs = async () => {
  const inputs = await navigator.mediaDevices.enumerateDevices()
  return inputs.filter(input => input.kind === 'audioinput')
}

class BPMAnalyzer extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <div>
      measure it {{isMeasuring}}
    </div>

    <paper-dropdown-menu label="Devices">
      <paper-listbox slot="dropdown-content" selected="0">
        <template is="dom-repeat" items="{{devices}}">
          <paper-item value="{{item.deviceId}}">{{item.label}}</paper-item>
        </template>
      </paper-listbox>
    </paper-dropdown-menu>

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
      devices: {
        type: Array,
        value: [],
      },
      selectedDevice: {
        type: String,
        value: '',
      },
    }
  }

  isMeasuring: boolean = false
  devices: any[] = []
  selectedDevice: string = ''

  startMeasuring() {
    this.isMeasuring = true
  }

  stopMeasuring() {
    this.isMeasuring = false
  }

  async ready() {
    super.ready()

    // request permissions first, so that listing audio devices returns deviceids
    await navigator.mediaDevices.getUserMedia({ audio: true })

    this.devices = await getAudioInputs()
  }
}

customElements.define(BPMAnalyzer.is, BPMAnalyzer)
