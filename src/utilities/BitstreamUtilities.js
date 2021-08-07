


export let handle_file_chosen = (inputFile) =>{

    return new Promise((resolve, reject) => {
        let file = inputFile.current.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (evt) {
                resolve(reader.result.split(',')[1])
            }
            reader.readAsDataURL(file);
        }
    })
}