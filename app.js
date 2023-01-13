//////////ENLACES AL HTML 

const cards = document.getElementById("containerShop")
const carritoContainer = document.getElementById("carritoContainer")
const verCarrito= document.getElementById("verCarrito")
const verCarrito2= document.getElementById("verCarrito2")
const carritoVacio= document.getElementById("carritoVacio")
const modal = document.getElementById("modal")



/* ARRAY DEL CARRITO *//* llenar el carrito con lo guardado en localStorage(JSON) o (||) sino empezar con el carrito vacio */let carrito= JSON.parse(localStorage.getItem("carrito")) || []
    
    
    
/////PRODUCTOS EN HTML
    
fetch("./data.json") /// carga los objetos de forma asincronica desde el archivo data.JSON
.then((resp)=> resp.json())
.then((data) =>{
        /* CICLO FOR EACH... PARA INSERTAR EN EL HTML UNA CARD PARA CADA UNO DE LOS PRODUCTOS DE ARRAY */
    data.forEach((product)=>{
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
            Toastify({
    
                text: `${product.nombre} añadido...`,
                duration: 1500,
                position: "center",
                style: {
                    background: "#1bac23",
                  },
                }).showToast();
        })
        vacio()///mostrar cartel de carrito vacio
    })
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
    carritoBtn.innerText=("Cerrar")
    carritoBtn.className=("carritoBtn btn btn-danger")
    carritoHeader.append(carritoBtn)
    
    carritoBtn.addEventListener("click",()=>{ ///evento que oculta el carrito
        carritoContainer.style.display="none"
        modal.style.display = "none" /// oculta el fondo sombra del carrito
    }) 
            
    llenarCarrito() /// llama la funcion del ciclo FOR EACH que crea el html y el boton eliminar para cada producto del array carrito
         
    /* CREA BOTON para vaciar el CARRITO */
    const carritoBtn2 = document.createElement("h4")
    carritoBtn2.innerText=("Vaciar Carrito")
    carritoBtn2.className=("carritoBtn2 btn btn-warning")
    carritoContainer.append(carritoBtn2)
    
    ///FUNCION AVANZADA (? : REEMPLAZA IF ELSE)
    carrito.length === 0 ?//SI EL CARRITO YA ESTA VACIO HACE ESTO...
        carritoBtn2.addEventListener("click",()=>{
            Swal.fire({
                icon: 'warning',
                title: 'El carrito ya está vacio...',
                text: 'Elegir algún producto.',
              })
        })
    :    //SI NO ESTÁ VACIO HACE ESTO..
    carritoBtn2.addEventListener("click",()=>{
        /* LIBRERIA SWEETALERT PARA AVISAR QUE VAS A VACIAR EL CARRITO */
        Swal.fire({
            title: 'Está seguro de VACIAR el CARRITO?',
            text: "Esta acción no podrá revertirse!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Vaciar Carrito',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito()///funcion para vaciar el carrito
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

    /* CREA BOTON para COMPRAR LOS PRODUCTOS */
    const carritoBtn3 = document.createElement("h4")
    carritoBtn3.innerText=("Realizar Compra")
    carritoBtn3.className=("carritoBtn3 btn btn-primary")
    carritoContainer.append(carritoBtn3)
    
    ///FUNCION AVANZADA (? : REEMPLAZA IF ELSE)
    carrito.length === 0 ?//SI EL CARRITO ESTA VACIO HACE ESTO...
        carritoBtn3.addEventListener("click",()=>{
            Swal.fire({
                icon: 'warning',
                title: 'El carrito está vacio...',
                text: 'Elige algún producto para comprar.',
              })
        })
    :  //SI NO ESTÁ VACIO HACE ESTO..
        carritoBtn3.addEventListener("click",()=>{
            /* LIBRERIA SWEETALERT PARA AVISAR QUE VAS A COMPRAR LOS PRODUCTOS */
            Swal.fire({
                title: 'Desea realizar la COMPRA?',
                text: "Esta acción vaciara el carrito",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#42ba96',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Realizar Compra',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    pedirEmail() ////funcion que pide el email para confirmar la comprar
                }
            })
        })
        

    totalProductos() /// suma el TOTAL del PRECIO de los productos

    cantidadProductos() /// suma la cantidad de productos al icono carrito
    
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
        eliminar.innerText="X"
        eliminar.className="btnEliminar btn btn-danger"
        carritoContent.append(eliminar)

        eliminar.addEventListener("click",()=>{
            eliminarProducto(product.id)
            Toastify({

                text:`${product.nombre} eliminado...`,
                
                duration: 1500,
                position: "center",
                style: {
                    background: "#df4759",
                },
            }).showToast();
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

carritoVacio.addEventListener("click",()=>{ ///abre un alert cuando se clickea sobre el boton de carrito vacio
    Swal.fire({
        icon: 'warning',
        title: 'El carrito está vacio...',
        text: 'Pulse COMPRAR en algun producto.',
      })
})

/* EVENTO PARA ABRIR EL CARRITO CON EL BOTON CARRITO */
verCarrito.addEventListener("click",()=>{
    pintarCarrito()
    modal.style.display = "block" /// muestra el fondo sombra del carrito

     })

cantidadProductos() ///llama funcion para sumar la cantidad de productos al icono carrito


/* FUNCION asincronica PARA DESPLEGAR EL ALERT AL CONFIRMAR LA COMPRA */
const pedirEmail = async () => {
    const { value: email } = await Swal.fire({ 
        title: 'Para completar la COMPRA ingrese su email.',
        input: 'email',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        inputLabel: 'Tu casilla de EMAIL',
        inputPlaceholder: 'example@example.com'
      })
      
    if (email) {
        Swal.fire(
            'Gracias por REALIZAR LA COMPRA!',
            `En breve <strong>BOLIVAR VIP</strong> se contactará con Ud. a la casilla <strong>${email}</strong> para coordinar la entrega.`,
            'success'
        )
        vaciarCarrito()///funcion para vaciar el carrito
        cantidadProductos()/// sumar la cantidad de productos al icono carrito
        vacio()///mostrar cartel de carrito vacio
        carritoContainer.style.display="none"
        modal.style.display = "none" /// oculta el fondo sombra del carrito
    }
}