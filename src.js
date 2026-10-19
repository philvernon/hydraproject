import hydraUrl from './node_modules/hydra-synth/dist/hydra-synth.js?url'
import initialSketch from './sketch.js?raw'
import './style.css'

const canvas = document.querySelector('#hydra')
const editor = document.querySelector('#code')
const status = document.querySelector('#status')

function report(message, error = false) {
  status.textContent = message
  status.classList.toggle('error', error)
}

try {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = hydraUrl
    script.onload = resolve
    script.onerror = () => reject(new Error('Could not load hydra-synth'))
    document.head.append(script)
  })

  const hydra = new window.Hydra({
    canvas,
    detectAudio: false,
    enableStreamCapture: false,
    makeGlobal: true,
    width: canvas.clientWidth,
    height: canvas.clientHeight,
  })

  function run(code = editor.value) {
    if (typeof code !== 'string') throw new TypeError('Sketch must be a string')
    editor.value = code
    try {
      // Hydra sketches intentionally execute trusted JavaScript in the global synth context.
      // pi-lens-ignore: no-global-eval-js
      new Function(code)()
      report('Running')
      return { ok: true }
    } catch (error) {
      report(error.message, true)
      return { ok: false, error: error.message }
    }
  }

  function stop() {
    window.hush()
    report('Stopped')
  }

  window.hydraPlayground = {
    synth: hydra,
    run,
    stop,
    getCode: () => editor.value,
  }

  document.querySelector('#run').addEventListener('click', () => run())
  document.querySelector('#stop').addEventListener('click', stop)
  editor.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      run()
    }
  })

  new ResizeObserver(() => {
    hydra.setResolution(Math.round(canvas.clientWidth), Math.round(canvas.clientHeight))
  }).observe(canvas)

  run(initialSketch)

  if (import.meta.hot) {
    import.meta.hot.accept('./sketch.js?raw', (module) => {
      if (module) run(module.default)
    })
  }
} catch (error) {
  report(`Hydra could not start: ${error.message}`, true)
}
