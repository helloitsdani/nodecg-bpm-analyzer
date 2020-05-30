import * as Polymer from '@polymer/polymer'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-radio-button/paper-radio-button'
import '@polymer/paper-radio-group/paper-radio-group'

nodecg.Replicant('bpm', 'nodecg-bpm-analyzer', {
  persistent: false,
})

const getAudioInputs = async () => {
  const inputs = await navigator.mediaDevices.enumerateDevices()
  return inputs.filter(input => input.kind === 'audioinput' && input.deviceId !== 'default')
}

class BPMAnalyzer extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <style>
      :root {
        --primary-text-color: #fff;
        --paper-radio-button-checked-color: #86cecb;
      }

      paper-button {
        background: #86cecb;
        color: #2F3A4F;
        display: flex;
        flex-flow: row nowrap;
        flex-direction: row;
      }

      .c-device-list {
        margin-bottom: 12px;
      }
    </style>

    <paper-radio-group class="c-device-list" selected="{{selectedDeviceId}}" label="Devices">
      <template is="dom-repeat" items="{{devices}}">
        <paper-radio-button name="{{item.deviceId}}">{{item.label}}</paper-radio-button>
      </template>
    </paper-radio-group>

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
      selectedDeviceId: {
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
