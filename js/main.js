let postArray=[]
const getPost = () => {
    postArray=[]    
    $.ajax({
        method: "GET",
        url:`http://localhost:8000/posts`,          
        contentType:"application/json;charset=UTF-8",
        success: response => {
           const {payload}=response;
                   postArray=payload              
           },
        error: error => {
            console.log(error)
        },
        async: false
    })
    return postArray.reverse();
}

let sbc  
if ((sessionStorage.getItem('vim') !== null) && (sessionStorage.getItem('vim') === "95142") ) {
      sbc=true;
    }

let token = sessionStorage.getItem('apitoken');


if(sbc){
    let userData =JSON.parse(sessionStorage.getItem('user'));
    const{userName,pictureProfileUser}=userData
    $("#login").css('visibility','hidden');
    $("#buttons").css('visibility','show');  
    document.getElementById("btnBlue").innerHTML = "Create Post";
    $('#btnBlue').prop('href','newsPost.html?idpost');
    $('#menCreate').prop('href','newsPost.html?idpost');
    $('#userName').text(userName);
    $("#imgUser").attr("src",pictureProfileUser);  
  }
  else{
      $("#buttons").css('visibility','hidden');  
  }

 $("#signOut").click(function(){
    sessionStorage.clear();
    $(location).attr('href','index.html');         
  })
 
//funcion eliminar en bd con llamada ajax creada por Clau
const deletePost=(idPost) => {    
    $.ajax({
     method: "DELETE",
     url: `http://localhost:8000/posts/${idPost}`,
     contentType:"application/json;charset=UTF-8",
     headers: {"apitoken" : token },
     success: (response) => {         
         drawPost(getPost())
       },
       error: error => {
         let  {responseJSON}=error;
          if(responseJSON.message==="this operation is not possible")
          {
            alert("No es posible realizar esta accion");
          }          
       }
    })
 }
 //obtiene id y se llama  ala funcion delete
const clickToDeletePost=(e)=>{
    let idPost = e.target.dataset.postIdDelete
    deletePost(idPost)
}
const clickToEditPost=(e)=>{
    let idPost = e.target.dataset.postIdEdit
    $.ajax({
    method:"GET",
    url: `http://localhost:8000/busquedaPost/${idPost}`,
    contentType:"application/json;charset=UTF-8",
    headers: {"apitoken" : token },
    success: (response) => {         
         const {ok}=   response 
         if(ok){
          window.location.href = `newsPost.html?idpost=${idPost}`             
         }
      },
      error: error => {
         //console.log(error);
         let  {responseJSON}=error;
         if(responseJSON.message==="this operation is not possible")
         {
           alert("No es posible realizar esta accion");
         }          
      }
   })
}
function formatDate(date){
    let dateFormat = new Date(date);
    let dd = dateFormat.getDate();
    let mm = dateFormat.getMonth() + 1; //January is 0!
    let yyyy = dateFormat.getFullYear();   
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
         mm = '0' + mm;
       } 
    dateFormat = dd+'/'+mm+'/'+yyyy;
    return dateFormat
 }
//console.log(getPost())
const createNode = (typeElement, text,arrayClass) => {
            let node = document.createElement(typeElement)
            node.textContent = text
            arrayClass.forEach(className => {
                node.classList.add(className)
            });
   return node
}
//pinta article por posts
const drawPost =(arrayPost) =>{
   let divWrapper = document.getElementById("wrapperCards")
    while(divWrapper.lastElementChild) {
        divWrapper.removeChild(divWrapper.lastElementChild)
    }
      arrayPost.forEach((post, index) => {
            let {_id,fecha,imgUrlPostContent,imgUrlPostTiltle,opiniones,tags,titlePost,txtPost,usuario,reactionsCount,countComment}= post
            
            let articleCard= createNode("article",null,["card"])
            if(index === 0){
            let imgPost= createNode("img",null,["card-img-top"])
                imgPost.setAttribute('src',imgUrlPostTiltle )
                imgPost.setAttribute('alt',"principal")
                imgPost.setAttribute('height',"274px")
                articleCard.appendChild(imgPost)
            }
            let divCardbody= createNode("div",null,["card-body","container","pt-2"])
                articleCard.appendChild(divCardbody)

            let divInfoUser= createNode("div",null,["row","justify-content-sm-start","align-items-start","no-gutters"])
                divCardbody.appendChild(divInfoUser)

            let avatarDiv= createNode("div",null,["avatar"])
                divInfoUser.appendChild(avatarDiv)

            let avatarImgUser= createNode("img",null,[])
                avatarImgUser.setAttribute('src',usuario.pictureProfileUser)
                avatarDiv.appendChild(avatarImgUser)

            //card de visualizacion pequeña esta va dentro de row1
            let avatarDatosDiv= createNode("div",null,["datos","pl-2","pl-md-2"])
                divInfoUser.appendChild(avatarDatosDiv)

            let avatarNombreDiv= createNode("div",usuario.userName,["nombre"])
                avatarDatosDiv.appendChild(avatarNombreDiv)

            let avatarCardUserDiv= createNode("div","",["card","user","flex-md-column","justify-content-md-center"])
                avatarNombreDiv.appendChild(avatarCardUserDiv)

            let avatarCardheaderDiv= createNode("div","",["header","pt-md-2","d-md-flex","flex-md-row","align-items-center"])
                avatarCardUserDiv.appendChild(avatarCardheaderDiv)

            let avatarCardImgDiv= createNode("div","",["avatar"])
                avatarCardheaderDiv.appendChild(avatarCardImgDiv)

            let avatarImgUserCard= createNode("img",null,[])
                avatarImgUserCard.setAttribute('src',usuario.pictureProfileUser)
                avatarCardImgDiv.appendChild(avatarImgUserCard)

            let avatarNombreDivCard= createNode("div",usuario.userName,["name-avatar","pt-md-2"])
                avatarCardheaderDiv.appendChild(avatarNombreDivCard)

            let avatarCardBtnDiv= createNode("div","",["follow"])
                avatarCardUserDiv.appendChild(avatarCardBtnDiv)

            let buttonFollow = createNode("button","Follow",["btn-follow"])
                avatarCardBtnDiv.appendChild(buttonFollow)

            let avatarCardBodyDiv= createNode("div","",["card-body"])
                avatarCardUserDiv.appendChild(avatarCardBodyDiv)

            let avatarCardp= createNode("p",`Lorem iprehenderit aliquid, iustoiis eveniet. Exercitationem fugiat,nesciunt, veritatis optio quo,
                                            cupiditate eaque vitae quisquam nam repellendus atque numquam.`,[])
                avatarCardBodyDiv.appendChild(avatarCardp)
            //let time1=time(fecha)
            let avatarDatePostDiv= createNode("div",formatDate(fecha),["date"])
                avatarDatosDiv.appendChild(avatarDatePostDiv)

            let divWrappertTitlePost= createNode("div",null,["row","pt-2","ml-md-5","no-gutters"])
                divCardbody.appendChild(divWrappertTitlePost)
            let divTitlePost= createNode("div",null,["col-12","title"])
                divWrappertTitlePost.appendChild(divTitlePost)

            let ligaTitlePost= createNode("a",titlePost,["nav-link"])  
                ligaTitlePost.setAttribute('href',"detailPost.html?idpost="+_id)           

                divTitlePost.appendChild(ligaTitlePost)
            let divWTagsPost= createNode("div",null,["row","pt-2","ml-md-5","no-gutters"])
                divCardbody.appendChild(divWTagsPost)
            tags.forEach((tag) => {
                let divTagsPost= createNode("div",`#${tag}`,["flex-mark","pl-2","pl-md-2"])
                divWTagsPost.appendChild(divTagsPost)
                })
            let divWInteractions= createNode("div",null,["row","pt-3","ml-md-5","no-gutters","justify-content-sm-start","justify-content-md-between","align-items-center","flex-nowrap"])
                divCardbody.appendChild(divWInteractions)
            let divWheart=createNode("div",null,["heart","d-flex","flex-row"])
                divWheart.setAttribute('id',"heart-Count")
                divWheart.setAttribute("data-count-reactions", _id)
                divWInteractions.appendChild(divWheart)
            let divSvg=createNode("div",null,[])
                divWheart.appendChild(divSvg)
            let iHeart=createNode("i",null,["bi","bi-suit-heart"])
            divSvg.appendChild(iHeart)
            let countR= reactionsCount >0 ? reactionsCount : ""
            let divCountReactions=createNode("div",countR,[])
                divWheart.appendChild(divCountReactions)
            let divTxtReactions=createNode("div","reactions",["d-none","d-md-block","pl-md-1"])
                divWheart.appendChild(divTxtReactions)
            let divWComment=createNode("div",null,["comments","d-flex","flex-row"])
                divWInteractions.appendChild(divWComment)
            let divSvgC=createNode("div",null,[])
            divWComment.appendChild(divSvgC)
            let iChat=createNode("i",null,["bi","bi-chat-right"])
            divWComment.appendChild(iChat)
            let count= countComment >0 ? countComment : ""
            let divCountComments=createNode("div",count,[])
            divWComment.appendChild(divCountComments)
            let txtComment= countComment >0 ? "comments" : "Add Comm"
            let divTxtComment=createNode("div",txtComment,["d-none","d-md-block","pl-md-1"])
            divWComment.appendChild(divTxtComment)
            let divWInfo=createNode("div",null,["d-flex","flex-row","align-items-center"])
                divWInteractions.appendChild(divWInfo)
            //falta funcion para sacr min horas,dias,semans ,meses naios
            let divTime=createNode("div","1 min read",["min"])
            divWInfo.appendChild(divTime)

            let divWbtnSave=createNode("div","",["save","pl-1"])
                divWInfo.appendChild(divWbtnSave)

            let divbtnSave=createNode("button","Save",["btn-save"])
            divWbtnSave.appendChild(divbtnSave)
            if(sbc){
            let iEdit=createNode("i","",["bi","bi-pencil-square"])
            let buttonEdit = createNode("button","",["btn","btn-info","mr-1"])
            iEdit.setAttribute("data-post-id-edit", _id)
            buttonEdit.appendChild(iEdit)
            buttonEdit.setAttribute("data-post-id-edit", _id)
            buttonEdit.addEventListener("click", clickToEditPost)
            divWbtnSave.appendChild(buttonEdit)

            let iDelete=createNode("i","",["bi","bi-trash"])
            let buttonDelete = createNode("button","",["btn","btn-danger"])
            iDelete.setAttribute("data-post-id-delete", _id)
            buttonDelete.appendChild(iDelete)
            buttonDelete.setAttribute("data-post-id-delete", _id)
            buttonDelete.addEventListener("click", clickToDeletePost)
            divWbtnSave.appendChild(buttonDelete)
            }  
            divWrapper.appendChild(articleCard)

        })
}
drawPost(getPost())

const filterWeek= (arrayPost)=>{    
    let fecha = new Date() //Genera la fecha del dia de hoy
    let mes = (fecha.getMonth() + 1)
    let hoy = fecha.getDate()
    let finde = (hoy - 7)    

    arrayPost = arrayPost.map( post =>{
        return { ...post, fechaConvertida: formatDate(post.fecha).split('/')}
      })      
    arrayPost = arrayPost.filter( post => {
        return Number (post.fechaConvertida[1]) === mes 
        && Number (post.fechaConvertida[0]) >= finde 
        && Number (post.fechaConvertida[0]) <= hoy   
    })    
    drawPost(arrayPost) 
}

const filterMonth= (arrayPost)=>{    
      arrayPost = arrayPost.map( post =>{
        return { ...post, fechaConvertida: formatDate(post.fecha).split('/')}
    })
     arrayPost = arrayPost.filter( post => Number(post.fechaConvertida[1]) === new Date().getMonth() + 1 )
   drawPost(arrayPost)   
}

const filterYear= (arrayPost)=>{    
        arrayPost = arrayPost.map( post =>{
        return { ...post, fechaConvertida: formatDate(post.fecha).split('/')}
     })
     arrayPost = arrayPost.filter(post => Number(post.fechaConvertida[2]) === new Date().getFullYear())
     //console.log(postArray);
     drawPost(arrayPost)
}

$("#fechas").change(()=> {
    let select = $("#fechas option:selected").val()
    console.log(select)    
    switch (select){        
        case "week":
            filterWeek(getPost()) 
        break;
        case "month":
            filterMonth(getPost())
        break;
        case "year":
            filterYear(getPost())
        break;
        case "infinity":
            drawPost(getPost())
        break;  

        default:
           console.log("funcion aun no programada")
         break;
    }
})

document.querySelector('#week').addEventListener('click', (e) => {
    e.preventDefault()
   
   
    filterWeek(getPost())  
})

$('#month').click((e) => {
    e.preventDefault()
    filterMonth(getPost())
})

$('#infinity').click((e) => {
    e.preventDefault()
    drawPost(getPost().reverse())
})

document.querySelector('#year').addEventListener('click', (e) => {
    e.preventDefault()
    filterYear(getPost())
})

let inputSearch = document.getElementById("search")
    
inputSearch.addEventListener("keyup", (e)=> {
                let valorInput = inputSearch.value.toUpperCase()
                let resultadoBusqueda = postArray.filter(post => {
                    return post.titlePost.toUpperCase().includes(valorInput)    
                })
                drawPost(resultadoBusqueda)
})

