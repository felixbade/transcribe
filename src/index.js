const url = 'https://api.openai.com/v1/audio/transcriptions';


const transcribe = (apiKey, file, language, response_format) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('model', 'whisper-1')
    formData.append('response_format', response_format || 'verbose_json') // Set default value to verbose_json
    if (language) {
        formData.append('language', language)
    }

    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiKey}`)

    return fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers
    }).then(response => {
        console.log(response)
        // Automatically handle response format
        if (response_format === 'json' || response_format === 'verbose_json') {
            return response.json().then(data => {
                console.log("JSON: ", JSON.stringify(data, null, 2));
                return data;
            });
        } else {
            return response.text().then(data => {
                console.log("TEXT: ", data);
                return data;
            });
        }
    }).catch(error => console.error(error))
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

const setTranscribingMessage = (text) => {
    const container = document.querySelector('#output')
    container.innerHTML = text
}

const setTranscribedTextBasedFormats = (text) => {
    console.log(text)

    const container = document.querySelector('#output')
    container.innerHTML = '<pre>' + text + '</pre>' // Wrap the content in a <pre> tag
}

const setTranscribedSegments = (segments) => {
    console.log(segments)

    const container = document.querySelector('#output')
    container.innerHTML = ''
    for (const segment of segments) {
        const element = document.createElement('div')
        element.classList.add('segment')
        element.innerText = segment.text
        container.appendChild(element)
    }
}

window.addEventListener('load', () => {
    setupAPIKeyInput()

    const fileInput = document.querySelector('#audio-file')
    fileInput.addEventListener('change', () => {
        setTranscribedTextBasedFormats('Transcribing...');
    
        const apiKey = localStorage.getItem('api-key');
        const file = fileInput.files[0];
        const language = document.querySelector('#language').value;
        const response_format = document.querySelector('#response_format').value;
        const response = transcribe(apiKey, file, language, response_format);
    
        response.then(transcription => {
            if (response_format === 'json') {
                setTranscribedTextBasedFormats(transcription.text);
            } else if (response_format === 'verbose_json') {
                setTranscribedSegments(transcription.segments);
            } else {
                setTranscribedTextBasedFormats(transcription);
            }
            fileInput.value = null; // Clear the file input
        });
    });    
})