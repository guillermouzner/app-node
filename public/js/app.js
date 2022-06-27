console.log("hola desde el front");

document.addEventListener("click", (e) => {
    if (e.target.dataset.short) {
        const url = `${window.location.origin}/${e.target.dataset.short}`;
        // window.location.origin --> toma por defecto la url actaul
        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log("texto copiado");
            })
            .catch((err) => {
                console.log("algo salio mal");
            });
    }
});
