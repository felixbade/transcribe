const url = 'https://api.openai.com/v1/audio/transcriptions';


const transcribe = (apiKey, file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('model', 'whisper-1')

    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiKey}`)

    return fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers
    }).then(response => response.json())
      .then(data => data.text)
      .catch(error => console.error(error))
}


const hideStartView = () => {
    document.querySelector('#start-view').classList.add('hidden')
}

const showStartView = () => {
    document.querySelector('#start-view').classList.remove('hidden')
}

const setupAPIKeyInput = () => {
    const element = document.querySelector('#api-key')
    const savedAPIKey = localStorage.getItem('api-key') || ''
    element.value = savedAPIKey
    element.addEventListener('input', () => {
        const key = element.value
        console.log('saving:', key)
        localStorage.setItem('api-key', key)
        if (key) {
            hideStartView()
        } else {
            showStartView()
        }
    })

    if (savedAPIKey) {
        hideStartView()
    }
}


const updateTextareaSize = (element) => {
    element.style.height = 0

    const style = window.getComputedStyle(element)
    const paddingTop = parseFloat(style.getPropertyValue('padding-top'))
    const paddingBottom = parseFloat(style.getPropertyValue('padding-bottom'))

    const height = element.scrollHeight - paddingTop - paddingBottom

    element.style.height = `${height}px`
}

const setTranscribedText = (text) => {
    const element = document.querySelector('#output')
    element.innerText = text
}

window.addEventListener('load', () => {
    setupAPIKeyInput()

    const fileInput = document.querySelector('#audio-file')
    fileInput.addEventListener('change', () => {
        setTranscribedText('Transcribing...')

        const apiKey = localStorage.getItem('api-key')
        const file = fileInput.files[0]
        const response = transcribe(apiKey, file)

        response.then(transcription => {
            setTranscribedText(transcription)
        })
    })
})