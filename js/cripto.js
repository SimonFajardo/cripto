//crear selectores
const moneda = document.querySelector('#moneda');
const selectCripto = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

//crear eventos
document.addEventListener('DOMContentLoaded',()=>{
    consultarCripto();
    moneda.addEventListener('input', obtenerValores);
    selectCripto.addEventListener('change', obtenerValores);
    formulario.addEventListener('submit', cotizar)
})


function consultarCripto(e){
    //url toplist del market cap API cripto compare
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD'

    fetch(url)
        .then(respuesta=>respuesta.json())
        .then(resultado => obtenerCripto(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
        .catch(error => console.log(error))
    
}

const obtenerCripto = criptomoneda => new Promise(resolve=>{
    resolve(criptomoneda);
})

function obtenerValores(e){
    //console.log(e.target.name)
    objBusqueda[e.target.name] = e.target.value;
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {Name,FullName} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.textContent = FullName;
        option.value = Name;
        //insertar en el HTML
        selectCripto.appendChild(option);
    });
}

function cotizar(e){
    e.preventDefault();

    //consultar valores guardados en el objeto
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda ==='' || criptomoneda === ''){
        mostrarError('Los campos son obligatorios');
        return;
    }

    consultarAPI();
}

function mostrarError(mensaje){
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    //mostrar mensaje de error
    divMensaje.textContent = mensaje;

    //insertar en el HTML
    formulario.appendChild(divMensaje)

    //bloque de error va a desaparecer luego de 5 segundos
    setTimeout(()=>{
        divMensaje.remove();
    },5000);
}

function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;
    //url Price(inc. CCCAGG). Multiple symbol full data
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizar =>{
            mostrarResultado(cotizar.DISPLAY[criptomoneda][moneda])
        })
}

function mostrarResultado(cotizacion){
    limpiarHTML();

    const {CHANGEPCT24HOUR,PRICE,HIGHDAY,LOWDAY,LASTUPDATE} = cotizacion;

    const ult24horas = document.createElement('p');
    ult24horas.innerHTML = `<p>Variación últimas 24 horas: ${CHANGEPCT24HOUR}</p>`
    
    const precio = document.createElement('p');
    precio.innerHTML = `<p>El precio es: ${PRICE}</p>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>El precio más alto del día es: ${HIGHDAY}</p>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>El precio más bajo del día es: ${LOWDAY}</p>`

    const ultAct = document.createElement('p');
    ultAct.innerHTML = `<p>La última actualización es: ${LASTUPDATE}</p>`
    
    resultado.appendChild(ult24horas)
    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultAct)
    formulario.appendChild(resultado)
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){

    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner')

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    //mostrar en el html
    resultado.appendChild(spinner)
}
