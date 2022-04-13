const session = new onnx.InferenceSession();

async function load_model_async() {
    const message = document.getElementById('message-id');

    message.innerHTML = "Loading model..."
    await session.loadModel("./model-20.onnx");
    message.innerHTML = "Copy & paste an image:"
}

document.addEventListener("DOMContentLoaded", function(event) {
    load_model_async();
});

document.onpaste = function(event) {
    const image = document.getElementById('image-id');
    const label = document.getElementById('label-id');

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;    

    for (const item of items) {
        if (item.kind === 'file') {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                image.src = event.target.result;

                // todo:

                label.innerHTML = "Oh I think it is ...";
            };
            reader.readAsDataURL(blob);
        }
    }
  }