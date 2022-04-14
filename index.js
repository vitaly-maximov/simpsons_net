const classes = ['abraham_grampa_simpson', 'agnes_skinner',
    'apu_nahasapeemapetilon', 'barney_gumble', 'bart_simpson',
    'carl_carlson', 'charles_montgomery_burns', 'chief_wiggum',
    'cletus_spuckler', 'comic_book_guy', 'disco_stu', 'edna_krabappel',
    'fat_tony', 'gil', 'groundskeeper_willie', 'homer_simpson',
    'kent_brockman', 'krusty_the_clown', 'lenny_leonard',
    'lionel_hutz', 'lisa_simpson', 'maggie_simpson', 'marge_simpson',
    'martin_prince', 'mayor_quimby', 'milhouse_van_houten',
    'miss_hoover', 'moe_szyslak', 'ned_flanders', 'nelson_muntz',
    'otto_mann', 'patty_bouvier', 'principal_skinner',
    'professor_john_frink', 'rainier_wolfcastle', 'ralph_wiggum',
    'selma_bouvier', 'sideshow_bob', 'sideshow_mel', 'snake_jailbird',
    'troy_mcclure', 'waylon_smithers'];

const session = new onnx.InferenceSession();

async function load_model_async() {
    const message = document.getElementById('message-id');

    message.innerHTML = "Loading model..."
    await session.loadModel("./model.onnx");
    message.innerHTML = "Copy & paste an image of a character from the Simpsons:"
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
            reader.onload = async function(event) {
                image.src = event.target.result;
                
                label.innerHTML = "Let me think...";

                const width = 224;
                const height = 224;

                var bitmap = await createImageBitmap(blob);
                var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                var context = canvas.getContext('2d');
                context.drawImage(bitmap, 0, 0, width, height);

                const imageData = new Float32Array(context.getImageData(0, 0, width, height).data);

                const inputTensor = new onnx.Tensor(imageData, 'float32');
                const outputMap = await session.run([inputTensor]);
                const outputData = outputMap.values().next().value.data;

                var max_index = 0;
                var max_value = outputData[0];
                for (i = 1; i < outputData.length; ++i) {
                    if (max_value < outputData[i])
                    {
                        max_value = outputData[i];
                        max_index = i;
                    }
                }
                var x = classes[max_index];                
                label.innerHTML = "Oh I think it is ... " + x;
            };
            reader.readAsDataURL(blob);
        }
    }
}