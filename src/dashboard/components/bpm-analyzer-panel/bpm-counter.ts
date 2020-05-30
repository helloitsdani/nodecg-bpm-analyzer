import * as Polymer from '@polymer/polymer'

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
      bpm: {
        type: Number,
        reflectToAttribute: true,
        notify: true,
      },
    }
  }

  deviceId: string = ''
  bpm: number = 0

  ready() {
    super.ready()

    setTimeout(() => {
      this.set('bpm', 69)
    }, 1000)
  }
}

customElements.define(BPMCounter.is, BPMCounter)
