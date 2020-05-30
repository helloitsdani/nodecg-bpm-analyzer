import * as Polymer from '@polymer/polymer'
import '@polymer/iron-pages/iron-pages'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-radio-button/paper-radio-button'
import '@polymer/paper-radio-group/paper-radio-group'

import './bpm-counter'

const bpm = nodecg.Replicant('bpm', 'nodecg-bpm-analyzer', {
  persistent: false,
})

const getAudioInputs = async () => {
  const inputs = await navigator.mediaDevices.enumerateDevices()
  return inputs.filter(input => input.kind === 'audioinput')
}

class BPMAnalyzerPanel extends Polymer.PolymerElement {
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

    <iron-pages
      id="pages"
      selected="device-selection"
      attr-for-selected="name"
    >
      <section name="device-selection">
        <paper-radio-group class="c-device-list" selected="{{selectedDeviceId}}" label="Devices">
          <template is="dom-repeat" items="[[devices]]">
            <paper-radio-button name="[[item.deviceId]]">[[item.label]]</paper-radio-button>
          </template>
        </paper-radio-group>

        <paper-button raised="" on-tap="_startMeasuring">
          Start
        </paper-button>
      </section>

      <section name="analyzer">
        <template is="dom-if" if="[[isMeasuring]]" restamp>
          <p>
            Listening to <strong>[[selectedDevice.label]]</strong>...
          </p>

          <bpm-counter
            device-id="[[selectedDeviceId]]"
            bpm="{{bpm}}"
          />
        </template>

        <paper-button raised="" on-tap="_stopMeasuring">
          Stop
        </paper-button>
      </section>
    </iron-pages>
`
  }

  static get is() {
    return 'bpm-analyzer-panel'
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
        type: Object,
        computed: '_getSelectedDevice(selectedDeviceId)',
      },
      selectedDeviceId: {
        type: String,
        value: '',
      },
      bpm: {
        type: Number,
        value: 90,
        observer: '_onBPMChange',
      },
    }
  }

  isMeasuring: boolean = false
  devices: any[] = []
  selectedDevice: string = ''

  _startMeasuring() {
    this.isMeasuring = true

    // @ts-ignore
    this.$.pages.selected = 'analyzer'
  }

  _stopMeasuring() {
    this.isMeasuring = false

    // @ts-ignore
    this.$.pages.selected = 'device-selection'
  }

  _getSelectedDevice(selectedDeviceId: string) {
    return this.devices.find(device => device.deviceId === selectedDeviceId)
  }

  _onBPMChange(newBPM: number) {
    console.log('new bpm', newBPM)
    bpm.value = newBPM
  }

  async ready() {
    super.ready()

    // request permissions first, so that listing audio devices returns deviceids
    await navigator.mediaDevices.getUserMedia({ audio: true })

    this.devices = await getAudioInputs()
  }
}

customElements.define(BPMAnalyzerPanel.is, BPMAnalyzerPanel)
