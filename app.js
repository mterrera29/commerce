//////////ENLACES AL HTML 

const cards = document.getElementById("containerShop")
const carritoContainer = document.getElementById("carritoContainer")
const verCarrito= document.getElementById("verCarrito")
const verCarrito2= document.getElementById("verCarrito2")
const carritoVacio= document.getElementById("carritoVacio")
const modal = document.getElementById("modal")



////////ARRAY CON OBJETOS DE PRODUCTOS 

const productos =[
    {id: 1, nombre : "Respaldo Lumbar", precio: 1500, img: "https://http2.mlstatic.com/D_NQ_NP_819600-MLA44124471429_112020-V.webp", cantidad: 1},
    {id: 2, nombre : "Masajeador Cervical", precio: 5000, img:"https://http2.mlstatic.com/D_NQ_NP_853352-MLA51767605021_092022-O.webp", cantidad: 1},
    {id: 3, nombre : "Blanqueador Dental", precio: 500, img: "https://http2.mlstatic.com/D_NQ_NP_667173-MLA48322978191_112021-O.webp", cantidad: 1},
    {id: 4, nombre : "Cepillo Biodegradable", precio: 800, img: "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/040/363/products/meraki-21-123e4ac70e276d920615722213253108-640-0.webp", cantidad: 1},
    ]


/* ARRAY DEL CARRITO */
/* llenar el carrito con lo guardado en localStorage(JSON) o (||) sino empezar con el carrito vacio */
let carrito= JSON.parse(localStorage.getItem("carrito")) || []



/////PRODUCTOS EN HTML



/* CICLO FOR EACH... PARA INSERTAR EN EL HTML UNA CARD PARA CADA UNO DE LOS PRODUCTOS DE ARRAY */
productos.forEach((product) =>{
    /* CREA EL HTML PARA LAS TARJETAS */
    let content = document.createElement("div")
    content.className= "tarjetas card shadow"
    content.innerHTML=`
    <div class="card-body">
        <h5 class="card-header">ID: ${product.id}</h5>
        <img src="${product.img}" alt="" class="img-card">
        <h4 >${product.nombre}</h4>
        <p >Precio: $${product.precio}</p>
    </div>        
    `
    cards.append(content)

    /* CREA EL BOTON COMPRAR DENTRO DE LAS TARJETAS */

    let comprar = document.createElement("button")
    comprar.innerText = "Comprar"
    comprar.className = "comprar btn btn-primary"
    content.append(comprar)
    
    /* EVENTO CLICK PARA CADA TARJETA Y PUSH DEL PRODUCTO AL CARRITO */
  
    comprar.addEventListener("click",()=>{
        carrito.push({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            cantidad: product.cantidad,
            img: product.img,
        })
        console.log(carrito)
        carritoContainer.style.display="none" ///oculta el carrito cada vez que damos COMPRAR en un producto
        modal.style.display = "none" /// oculta el fondo sombra del carrito
        cantidadProductos()/// sumar la cantidad de productos al icono carrito
        vacio()///mostrar cartel de carrito vacio
    })
    vacio()///mostrar cartel de carrito vacio
})




////////ACA EMPIEZA EL CARRITO




/* FUNCION PARA LLENAR EL CARRITO */
const pintarCarrito = () =>{

    carritoContainer.style.display="block" ///muestra el carrito
    
    carritoContainer.innerHTML=""  ///resetea el html para que se vuelva a llenar

    /* HEADER DEL CARRITO */
    const carritoHeader = document.createElement("div")
    carritoHeader.className="carritoHeader card-header"
    carritoHeader.innerHTML= `
    <h3 >Carrito 🛒</h3>
    `
    carritoContainer.append(carritoHeader)
    

    /* BOTON CERRAR DEL CARRITO */
    const carritoBtn = document.createElement("h2")
    carritoBtn.innerText=("X")
    carritoBtn.className=("carritoBtn btn btn-danger")
    carritoHeader.append(carritoBtn)
    
    carritoBtn.addEventListener("click",()=>{
        carritoContainer.style.display="none"
        modal.style.display = "none" /// oculta el fondo sombra del carrito
    }) ///evento que oculta el carrito
            
    llenarCarrito() /// ciclo FOR EACH que crea el html y el boton eliminar para cada producto del array carrito
         
    /* BOTON para vaciar el CARRITO */
    const carritoBtn2 = document.createElement("h4")
    carritoBtn2.innerText=("Vaciar Carrito")
    carritoBtn2.className=("carritoBtn2 btn btn-primary")
    carritoContainer.append(carritoBtn2)
         
    carritoBtn2.addEventListener("click",()=>{
        /* LIBRERIA SWEETALERT PARA AVISAR QUE VAS A VACIAR EL CARRITO */
        Swal.fire({
            title: 'Está seguro de VACIAR el CARRITO?',
            text: "Esta acción no podrá revertirse!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Vaciar Carrito!'
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito()
                cantidadProductos()/// sumar la cantidad de productos al icono carrito
                vacio()///mostrar cartel de carrito vacio
                carritoContainer.style.display="none"
                modal.style.display = "none" /// oculta el fondo sombra del carrito
              Swal.fire(
                'Carrito Vacio!',
                'Vuelva a elegir otros productos.',
                'success'
                 )
            }
        })
    })

    totalProductos() /// suma el TOTAL del PRECIO de los productos

    cantidadProductos() /// sumar la cantidad de productos al icono carrito
    
    saveLocal()///guardar los productos del array en LOCAL STORAGE
}


///////FUNCIONES


/* FUNCION QUE CREA EL HTML PARA CADA PRODUCTO EN EL CARRITO */
function llenarCarrito(){
    carrito.forEach((product) =>{
         
        let carritoContent = document.createElement("div")
        carritoContent.className= "carritoContent card-body"
        carritoContent.innerHTML= `
        <img src="${product.img}" alt="" class="img-carrito">
        <h4>${product.nombre}</h4>
        <p >Precio: $${product.precio}
        </p>
        ` 
        carritoContainer.append(carritoContent)


        /* CREA BOTON PARA ELIMINAR PRODUCTOS DEL CARRITO */
        let eliminar= document.createElement("button")
        eliminar.innerText="Eliminar"
        eliminar.className="btnEliminar btn btn-danger"
        carritoContent.append(eliminar)

        eliminar.addEventListener("click",()=>{
            eliminarProducto(product.id)
             })

    })
}

/* FUNCION SUMAR LOS PRODUCTOS EN UN FILTRO ACUMULADOR (.REDUCE) */
function totalProductos(){
    const total = carrito.reduce((acc,prod) => acc+prod.precio,0)
    const totalCarrito = document.createElement("div")
    totalCarrito.className = "carritoFooter card-footer"
    totalCarrito.innerHTML= `
    <h3 >Total a pagar: $${total} </h3>
    `
    carritoContainer.append(totalCarrito)
}

/* FUNCION SUMAR LOS PRODUCTOS AL LADO DEL ICONO CARRITO*/
function cantidadProductos(){
    verCarrito2.innerHTML=""
    const cantidad = carrito.reduce((acc,prod) => acc+prod.cantidad,0)
    const cantidadCarrito = document.createElement("div")
    cantidadCarrito.className = "carritoCantidad"
    cantidadCarrito.innerHTML= `
    <h5>${cantidad}</h5>
    `
    verCarrito2.append(cantidadCarrito)

    /* SI LA CANTIDAD DEL CARRITO ES 0(CERO) NO SE MUESTRA EL NUMERO AL LADO DEL ICONO CARRITO (OPERADOR TERNARIO) */

    cantidad === 0? verCarrito2.style.display="none" : verCarrito2.style.display="block"
    
    saveLocal()///guardar los productos del array en LOCAL STORAGE
}

/* FUNCION PARA VACIAR CARRITO */
function vaciarCarrito() {
    carrito = [];
    pintarCarrito() ///llenar el carrito con los productos del array
}



/* FUNCION PARA ELIMINAR EL PRODUCTO DEL CARRITO */
const eliminarProducto= (id)=>{
    const foundId = carrito.find((element)=>element.id === id)
    
    carrito = carrito.filter((carritoId)=>{
        return carritoId !==foundId
    })
    
    /* funcion para guardar el array en LOCAL STORAJE (JSON) */
    saveLocal()
    /* FUNCION PARA QUE VUELVA A MOSTRAR LOS PRODUCTOS QUE ESTAN EN EL CARRITO MENOS EL QUE PEDI ELIMINAR */
    pintarCarrito() ///llenar el carrito con los productos del array
    vacio() ///mostrar cartel de carrito vacio
}


/*  FUNCION para guardar datos del carrito en JSONNN */
const saveLocal=()=>{
    localStorage.setItem("carrito",JSON.stringify(carrito))
}


/* FUNCION PARA MOSTRAR EL CARTEL DE CARRITO VACIO (OPERADOR TERNARIO) */
function vacio(){
    carrito.length === 0 ? carritoVacio.style.display = "block" : carritoVacio.style.display = "none"
}

/* EVENTO PARA ABRIR EL CARRITO CON EL BOTON CARRITO */
verCarrito.addEventListener("click",()=>{
    pintarCarrito()
    modal.style.display = "block" /// muestra el fondo sombra del carrito

     })

cantidadProductos() /// sumar la cantidad de productos al icono carrito


