import {
   postObj,
   btnSubmit,
   formulario,
   misListener,
   reiniciarObjeto,
   }
    from './variables.js'

let editando = false
let arrayTags = []
let token = sessionStorage.getItem('apitoken');

misListener()

const CLOUDINARY = 'https://api.cloudinary.com/v1_1/dcakvkbpz/image/upload'
const Cloudinary_preset = 'vn5lewjj'

//esta funcion de encarga de on¿btener el valor de la variable enviada desde la pagina index
const queryString =  ()=> {
   let query_string = {};
   let query = window.location.search.substring(1);
   let vars = query.split("&");
   for (let i=0;i<vars.length;i++) {
     let pair = vars[i].split("=");
     if (typeof query_string[pair[0]] === "undefined") {
       query_string[pair[0]] = decodeURIComponent(pair[1]);
     } else if (typeof query_string[pair[0]] === "string") {
       let arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
       query_string[pair[0]] = arr;
     } else {
       query_string[pair[0]].push(decodeURIComponent(pair[1]));
     }
   }
   return query_string;
 }
let objectIdPost= queryString()
//para llebar el select
const getTags = () => {
    let tags
    $.ajax({
        method: "GET",
       // url:"http://localhost:8000/tags",
        url: 'https://backdev-humble-zebra-zj.mybluemix.net/tags',        
        success: response => {
            const {payload}=response
            tags = payload
         // llenaTags(tags)
        },
        error: error => {
            console.log(error)
        },
        async: false
    })
    return tags
}
 //pintar select 
  const llenaTags =(tags )=>{
       tags.forEach((post, index) => {
        const {_id,tag}=post;
        $("#tags").append('<option value=' + _id + '>' + tag + '</option>');
    })
 }
 llenaTags(getTags())
 //llena input
const llenaInpuTag=()=>{
   //let select_item = $("#tags").val()
    let select_text = $("#tags option:selected").text()
    $("#tags option:selected").remove()
     arrayTags=[...arrayTags, select_text]
     postObj.tags = arrayTags
    $("#inputTags").val(arrayTags.toString())
 }
//metodo change en tag
$("#tags").change(function() {
   llenaInpuTag()  
})
// obtener los valores de los inputs SELECTORES
let titlePost = $('#textareaTitle')
let tags= $('#inputTags');
let post = $('#textarea-post');
//let btnSubmit = $('#btn-submit')
let arrayImages = [];
post.change(obtenerDatos)
titlePost.change(obtenerDatos)
// imagenPrincipal.change(obtenerDatos)
//imagenes.change(obtenerDatos)
tags.change(obtenerDatos)

// obtiene url de la imagenes del servidor
// Imagen principal
$('#inputGroupFile01').change(async (e)=> {
   let imgPrev = document.getElementById('img-prev')
   let file = e.target.files[0]
   const formData = new FormData() //Crea un nuevo formulario en HTML
   formData.append('file', file) //crea un imput tipo file, y recibe la informacion de la imagen
   formData.append('upload_preset', Cloudinary_preset) // crea un nuevo input, en donde ingresa el psw de cloudinary
   //async = true
   const res = await axios.post(CLOUDINARY, formData, {
    headers: { 'Content-Type': 'multipart/form-data' } //informacion que ingresa a cloudinary
    })
   // console.log(res)
   let imgtoDb = res.data.secure_url
   // return imgtoDb
   postObj.imgUrlPostTiltle = imgtoDb
   imgPrev.src = res.data.secure_url
 // console.log(imgtoDb)
})
function obtenerDatos(e) {
     postObj[e.target.name] = e.target.value
}

function fechaActual(){
   let today = new Date();
   let dd = today.getDate();
   let mm = today.getMonth() + 1; //January is 0!
   let yyyy = today.getFullYear();   
   if (dd < 10) {
     dd = '0' + dd;
   }
   if (mm < 10) {
        mm = '0' + mm;
      } 
   today = dd + '/' + mm + '/' + yyyy;
   return today
}
btnSubmit.click( e =>{
   let fecha =fechaActual();
   const { titlePost, txtPost, imgUrlPostContent, imgUrlPostTiltle, tags } = postObj
   if (
      titlePost === undefined || titlePost === '' || tags.length === 0
      || txtPost === undefined || txtPost === '' 
      ) {
      mostrarMensaje()
      return txtPost
   }

   if(!editando){
   postObj.txtPost = txtPost
   postObj.fecha = new Date()
   postObj.reactionsCount = 0
   postObj.countComment =0      
   createPost(postObj)
   }else {
   postObj.fecha = new Date()
      if (
         titlePost === undefined || titlePost === '' || tags.length === 0
         || txtPost === undefined || txtPost === '' 
      ) {
         mostrarMensaje()
         return
      }
      updatingPost(postObj)
      editando = false
      btnSubmit.text('Create Post');
   }
   reiniciarObjeto()
   formulario[0].reset()
})

const createPost = (pObject) => {
   $.ajax({
      method: "POST",
      headers: {"apitoken" : token },  
      //url: 'http://localhost:8000/posts',
      url: 'https://backdev-humble-zebra-zj.mybluemix.net/posts',
      data: JSON.stringify(pObject),
      dataType:"json",        
      contentType:"application/json;charset=UTF-8",
      success: (response) => {
         const {ok}=response
         if(ok){
            $(location).attr('href','index.html');                
         }   
      },
      error: error => {
         console.log(error)
      }
   })
}

function updatingPost(post) {
   let { id } = post
   $.ajax({
      method: "PATCH",
      headers: {"apitoken" : token },  
      //url:`http://localhost:8000/posts/${id}`,
      url:`https://backdev-humble-zebra-zj.mybluemix.net/posts/${id}`,
      data: JSON.stringify(post),
      dataType:"json",        
      contentType:"application/json;charset=UTF-8",    
      success: (response) => {
         const{ok}=response
         if(ok){
            $(location).attr('href','index.html');         
         //console.log('se hizo el update', response);
         }   
      },
      error: error => {
         console.log(' NO se hizo el update', error);
      }
   })
}

function preparingUpdatingPost(id,todoUnPost){
    const { titlePost, txtPost, imgUrlPostContent, imgUrlPostTiltle, tags, usuario} = todoUnPost
    //aca relleno los inputs con los valores del objetoque quiero editar
   $('#textareaTitle').val(titlePost)
   $('#textarea-post').val(txtPost)
   $("#inputTags").val(tags.toString())
   $("#inputTags").val(tags.toString())
   $("#img-prev").attr("src",imgUrlPostTiltle);   
   //devolver valores al objeto
   postObj.id = id
   postObj.imgUrlPostContent = imgUrlPostContent
   postObj.imgUrlPostTiltle  = imgUrlPostTiltle
   postObj.tags  = tags
   postObj.usuario = usuario
   postObj.txtPost = txtPost
   postObj.titlePost = titlePost
   //cambiar boton aca
   btnSubmit.text('Guardar Cambios');
   editando = true
}
// se busca el post por medio del id
const findPost = (idPost) => {
   let post
   $.ajax({
       method: "GET",
       //url: `http://localhost:8000/posts/${idPost}`,
       url: `https://backdev-humble-zebra-zj.mybluemix.net/posts/${idPost}`,
       contentType:"application/json;charset=UTF-8",
       success: response => {
         let {payload}  =response;
         post = payload
           preparingUpdatingPost(idPost,post)
       },
       error: error => {
           console.log(error)
       },
       async: false
   })
   return post
}
if(objectIdPost.idpost !== "undefined") {
   let idPost=objectIdPost.idpost
   findPost(idPost)
 }

function mostrarMensaje() {
   let existe = document.querySelector(".mensaje")
   if(!existe){
      const mensajito = document.createElement('p');
      mensajito.textContent = 'Todos los campos son de llenado obligatorio :)'
      mensajito.setAttribute("style", "font-weight: bold;")
      mensajito.classList.add("mensaje","text-danger", "py-1", "mx-5", "mt-2")
      document.querySelector('.alerta').setAttribute("style","background-color:#FFE6E6;")
      document.querySelector('.jumbotron').setAttribute("style","padding: 2rem 2rem;")
      document.querySelector('.alerta').appendChild(mensajito)

         setTimeout(() => {
            mensajito.remove()
            document.querySelector('.jumbotron').removeAttribute("style");
         }, 2000);
   }
}



