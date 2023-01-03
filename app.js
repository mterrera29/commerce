
/* ENLACES AL HTML */
const cards = document.getElementById("containerShop")
const carritoContainer = document.getElementById("carritoContainer")
const verCarrito= document.getElementById("verCarrito")



/* ARRAY CON OBJETOS DE PRODUCTOS */

const productos =[
    {id: 1, nombre : "Respaldo Lumbar", precio: 1500},
    {id: 2, nombre : "Masajeador Cervical", precio: 5000},
    {id: 3, nombre : "Blanqueador Dental", precio: 500},
    {id: 4, nombre : "Cepillo Biodegradable", precio: 800},
    ]


/* ARRAY DEL CARRITO */
/* llenar el carrito con lo guardado en localStorage(JSON) o (||) sino empezar con el carrito vacio */
let carrito= JSON.parse(localStorage.getItem("carrito")) || []


/* CICLO FOR EACH... PARA INSERTAR EN EL HTML UNA CARD PARA CADA UNO DE LOS PRODUCTOS DE ARRAY */
productos.forEach((product) =>{
    /* CREA EL DIV PARA LAS TARJETAS */
    let content = document.createElement("div")
    content.className= "tarjetas card"
    content.innerHTML=`
    <div class="card-body">
        <h5 class="card-title">ID: ${product.id}</h5>
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
            precio: product.precio
        })
        console.log(carrito)

        /* LLAMAR LA FUNCION PARA QUE EL BOTON COMPRAR SUME LOS PRODUCTOS AL CARRITO */
        agregarCarrito()   
    })
})

/* FUNCION PARA AGREGAR LOS PRODUCTOS AL CARRITO */
function agregarCarrito(){
    carritoContainer.innerHTML=""
    const carritoHeader = document.createElement("div")
    carritoHeader.innerHTML= `
    <h1 >CARRITO </h1>
    `
    carritoContainer.append(carritoHeader)

    carrito.forEach((product) =>{
         
        let carritoContent = document.createElement("div")
        carritoContent.className= "carritoContent"
        carritoContent.innerHTML= `
        <h6>ID:${product.id}</h6>

        <h4>${product.nombre}</h4>
        <p >Precio: $${product.precio}
        </p>
        `
        carritoContainer.append(carritoContent)

        /* CREAR EL BOTON PARA ELIMINAR EL PRODUCTO DEL CARRITO */

        let eliminar= document.createElement("button")
        eliminar.innerText="Eliminar"
        eliminar.className="btnEliminar btn btn-danger"
        carritoContent.append(eliminar)


        /* EVENT PARA QUE EL BOTON ELIMINAR BORRE EL PRODUCTO DEL CARRITO */
        eliminar.addEventListener("click",()=>{
            eliminarProducto(product.id)
             })
    
    }) 
    /* SUMAR LOS PRODUCTOS EN UN FILTRO ACUMULADOR (.REDUCE) */
    const total = carrito.reduce((acc,prod) => acc+prod.precio,0)
    const totalCarrito = document.createElement("div")
    totalCarrito.innerHTML= `
    <h3 >Total a pagar: $${total} </h3>
    `
    carritoContainer.append(totalCarrito)


    /* funcion para guardar el array en LOCAL STORAJE (JSON) */
    saveLocal()
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
    agregarCarrito()
}

/* guardar datos del carrito en JSONNN */
const saveLocal=()=>{
    localStorage.setItem("carrito",JSON.stringify(carrito))
 }

